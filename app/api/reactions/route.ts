import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-server'
import { clientIp, isRateLimited } from '@/lib/rate-limit'

const VALID_EMOJIS = ['❤️', '👏', '😂', '🌸', '✨', '🥺']

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({})

  try {
    const supabase = createSupabaseAdminClient()
    const { data } = await supabase
      .from('reactions')
      .select('emoji, count')
      .eq('post_slug', slug)

    const counts: Record<string, number> = {}
    for (const emoji of VALID_EMOJIS) counts[emoji] = 0
    for (const row of data ?? []) counts[row.emoji] = row.count

    return NextResponse.json(counts)
  } catch {
    return NextResponse.json({})
  }
}

export async function POST(req: NextRequest) {
  try {
    if (await isRateLimited('reaction', clientIp(req), 20, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Even geduld, probeer het later opnieuw' }, { status: 429 })
    }

    const { emoji, postSlug } = await req.json()

    if (!VALID_EMOJIS.includes(emoji) || !postSlug?.trim()) {
      return NextResponse.json({ error: 'Ongeldige invoer' }, { status: 400 })
    }

    const supabase = createSupabaseAdminClient()
    const slug = postSlug.trim()

    const { data: post } = await supabase
      .from('posts')
      .select('slug')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
    if (!post) {
      return NextResponse.json({ error: 'Onbekende post' }, { status: 400 })
    }

    // Upsert: maak aan als niet bestaat, verhoog teller
    const { data: existing } = await supabase
      .from('reactions')
      .select('id, count')
      .eq('post_slug', slug)
      .eq('emoji', emoji)
      .single()

    if (existing) {
      await supabase
        .from('reactions')
        .update({ count: existing.count + 1 })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('reactions')
        .insert({ post_slug: slug, emoji, count: 1 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
