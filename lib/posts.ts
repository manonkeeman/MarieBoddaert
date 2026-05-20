import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import { sanityClient, allPostsQuery, postBySlugQuery } from './sanity'

export { getReadingTime } from './utils'

const postsDir = path.join(process.cwd(), 'content', 'posts')

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string          // HTML for markdown posts, empty for Sanity posts
  portableContent?: any[]  // Portable Text blocks for Sanity posts
  category: string
  color: string
  emoji: string
  source?: 'markdown' | 'sanity'
}

// ─── Markdown ──────────────────────────────────────────────────────

function getMarkdownPosts(): Post[] {
  if (!fs.existsSync(postsDir)) return []
  return fs
    .readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => getMarkdownPostBySlug(f.replace(/\.md$/, '')))
    .filter((p): p is Post => p !== undefined)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function getMarkdownPostBySlug(slug: string): Post | undefined {
  const filePath = path.join(postsDir, `${slug}.md`)
  if (!fs.existsSync(filePath)) return undefined
  const { data, content } = matter(fs.readFileSync(filePath, 'utf8'))
  return {
    slug,
    title:    data.title ?? '',
    date:     String(data.date ?? ''),
    excerpt:  data.excerpt ?? '',
    content:  String(marked.parse(content)),
    category: data.category ?? '',
    color:    data.color ?? '#FAD5DA',
    emoji:    data.emoji ?? '',
    source:   'markdown',
  }
}

// ─── Sanity ────────────────────────────────────────────────────────

async function getSanityPosts(): Promise<Post[]> {
  try {
    const raw = await sanityClient.fetch(allPostsQuery)
    return (raw ?? []).map((p: any) => ({
      slug:            p.slug,
      title:           p.title ?? '',
      date:            p.date ?? '',
      excerpt:         p.excerpt ?? '',
      content:         '',
      portableContent: p.content ?? [],
      category:        p.category ?? '',
      color:           p.color ?? '#FAD5DA',
      emoji:           p.emoji ?? '✍️',
      source:          'sanity' as const,
    }))
  } catch {
    return []
  }
}

async function getSanityPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const p = await sanityClient.fetch(postBySlugQuery, { slug })
    if (!p) return undefined
    return {
      slug:            p.slug,
      title:           p.title ?? '',
      date:            p.date ?? '',
      excerpt:         p.excerpt ?? '',
      content:         '',
      portableContent: p.content ?? [],
      category:        p.category ?? '',
      color:           p.color ?? '#FAD5DA',
      emoji:           p.emoji ?? '✍️',
      source:          'sanity' as const,
    }
  } catch {
    return undefined
  }
}

// ─── Public API ────────────────────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
  const [sanityPosts, markdownPosts] = await Promise.all([
    getSanityPosts(),
    Promise.resolve(getMarkdownPosts()),
  ])
  const sanitySlugSet = new Set(sanityPosts.map(p => p.slug))
  const uniqueMarkdown = markdownPosts.filter(p => !sanitySlugSet.has(p.slug))
  return [...sanityPosts, ...uniqueMarkdown].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const sanity = await getSanityPostBySlug(slug)
  if (sanity) return sanity
  return getMarkdownPostBySlug(slug)
}
