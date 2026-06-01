import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const readClient = createClient({
  projectId: 'xfgj8bxt',
  dataset:   'production',
  apiVersion: '2025-01-01',
  useCdn:    true,
})

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ comments: [] })

  try {
    const comments = await readClient.fetch(
      `*[_type == "comment" && postSlug == $slug && approved == true] | order(createdAt asc) {
        _id, name, message, createdAt
      }`,
      { slug }
    )
    return NextResponse.json({ comments })
  } catch {
    return NextResponse.json({ comments: [] })
  }
}

export async function POST(req: NextRequest) {
  const token = process.env.SANITY_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Server configuratie fout' }, { status: 500 })
  }

  try {
    const { name, message, postSlug } = await req.json()

    if (!name?.trim() || !message?.trim() || !postSlug?.trim()) {
      return NextResponse.json({ error: 'Vul alle velden in' }, { status: 400 })
    }
    if (name.length > 100 || message.length > 2000) {
      return NextResponse.json({ error: 'Tekst te lang' }, { status: 400 })
    }

    const writeClient = createClient({
      projectId: 'xfgj8bxt',
      dataset:   'production',
      apiVersion: '2025-01-01',
      token,
      useCdn:    false,
    })

    await writeClient.create({
      _type:     'comment',
      postSlug:  postSlug.trim(),
      name:      name.trim(),
      message:   message.trim(),
      approved:  false,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
