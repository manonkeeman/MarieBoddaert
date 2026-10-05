import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-server'
import { clientIp, isRateLimited } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ comments: [] })

  try {
    const supabase = createSupabaseAdminClient()
    const { data } = await supabase
      .from('comments')
      .select('id, name, message, created_at')
      .eq('post_slug', slug)
      .eq('approved', true)
      .order('created_at', { ascending: true })

    return NextResponse.json({ comments: data ?? [] })
  } catch {
    return NextResponse.json({ comments: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (isRateLimited(`comment:${clientIp(req)}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Even geduld, probeer het later opnieuw' }, { status: 429 })
    }

    const { name, message, postSlug, website } = await req.json()

    // Honeypot: mensen zien dit veld niet, spambots vullen het wel in
    if (website) return NextResponse.json({ ok: true })

    if (!name?.trim() || !message?.trim() || !postSlug?.trim()) {
      return NextResponse.json({ error: 'Vul alle velden in' }, { status: 400 })
    }
    if (name.length > 100 || message.length > 2000) {
      return NextResponse.json({ error: 'Tekst te lang' }, { status: 400 })
    }

    const supabase = createSupabaseAdminClient()
    const { data: post } = await supabase
      .from('posts')
      .select('slug')
      .eq('slug', postSlug.trim())
      .eq('published', true)
      .maybeSingle()
    if (!post) {
      return NextResponse.json({ error: 'Onbekende post' }, { status: 400 })
    }

    const { error } = await supabase.from('comments').insert({
      post_slug: postSlug.trim(),
      name:      name.trim(),
      message:   message.trim(),
      approved:  false,
    })

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
