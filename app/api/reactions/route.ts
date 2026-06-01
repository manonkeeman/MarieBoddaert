import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

const EMOJI_KEYS: Record<string, string> = {
  '❤️': 'heart',
  '👏': 'applause',
  '😂': 'laugh',
  '🌸': 'flower',
  '✨': 'sparkle',
  '🥺': 'sad',
}

const readClient = createClient({
  projectId:  'xfgj8bxt',
  dataset:    'production',
  apiVersion: '2025-01-01',
  useCdn:     true,
})

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({})

  try {
    const doc = await readClient.fetch(
      `*[_id == $id][0]`,
      { id: `reactions-${slug}` }
    )
    const counts: Record<string, number> = {}
    for (const key of Object.values(EMOJI_KEYS)) {
      counts[key] = doc?.[key] ?? 0
    }
    return NextResponse.json(counts)
  } catch {
    return NextResponse.json({})
  }
}

export async function POST(req: NextRequest) {
  const token = process.env.SANITY_TOKEN
  if (!token) return NextResponse.json({ error: 'niet geconfigureerd' }, { status: 500 })

  try {
    const { emoji, postSlug } = await req.json()
    const key = EMOJI_KEYS[emoji]
    if (!key || !postSlug?.trim()) {
      return NextResponse.json({ error: 'ongeldige invoer' }, { status: 400 })
    }

    const writeClient = createClient({
      projectId:  'xfgj8bxt',
      dataset:    'production',
      apiVersion: '2025-01-01',
      token,
      useCdn:     false,
    })

    const docId = `reactions-${postSlug.trim()}`
    await writeClient
      .transaction()
      .createIfNotExists({ _id: docId, _type: 'reactionCount', postSlug: postSlug.trim() })
      .patch(docId, p => p.setIfMissing({ [key]: 0 }).inc({ [key]: 1 }))
      .commit()

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'er ging iets mis' }, { status: 500 })
  }
}
