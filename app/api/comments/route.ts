import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-server'

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
    const { name, message, postSlug } = await req.json()

    if (!name?.trim() || !message?.trim() || !postSlug?.trim()) {
      return NextResponse.json({ error: 'Vul alle velden in' }, { status: 400 })
    }
    if (name.length > 100 || message.length > 2000) {
      return NextResponse.json({ error: 'Tekst te lang' }, { status: 400 })
    }

    const supabase = createSupabaseAdminClient()
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
