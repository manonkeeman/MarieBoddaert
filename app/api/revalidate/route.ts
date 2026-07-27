import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

const CATEGORY_PATHS: Record<string, string> = {
  Verhalen: '/verhalen',
  Gedichten: '/gedichten',
  Kattenbellen: '/kattenbellen',
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { scope, slug, category, previousCategory } = body as {
    scope?: 'post' | 'about'
    slug?: string
    category?: string
    previousCategory?: string
  }

  if (scope === 'about') {
    revalidatePath('/over')
    return NextResponse.json({ revalidated: true })
  }

  revalidatePath('/')
  revalidatePath('/zoeken')
  revalidatePath('/sitemap.xml')
  if (slug) revalidatePath(`/blog/${slug}`)
  if (category && CATEGORY_PATHS[category]) revalidatePath(CATEGORY_PATHS[category])
  if (previousCategory && previousCategory !== category && CATEGORY_PATHS[previousCategory]) {
    revalidatePath(CATEGORY_PATHS[previousCategory])
  }

  return NextResponse.json({ revalidated: true })
}
