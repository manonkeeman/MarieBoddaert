import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const postsDir = path.join(process.cwd(), 'content', 'posts')

export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  content: string
  category: string
  color: string
  emoji: string
}

export { getReadingTime } from './utils'

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDir)) return []
  return fs
    .readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => getPostBySlug(f.replace(/\.md$/, '')))
    .filter((p): p is Post => p !== undefined)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | undefined {
  const filePath = path.join(postsDir, `${slug}.md`)
  if (!fs.existsSync(filePath)) return undefined

  const { data, content } = matter(fs.readFileSync(filePath, 'utf8'))

  return {
    slug,
    title: data.title ?? '',
    date: String(data.date ?? ''),
    excerpt: data.excerpt ?? '',
    content: String(marked.parse(content)),
    category: data.category ?? '',
    color: data.color ?? '#FAD5DA',
    emoji: data.emoji ?? '',
  }
}
