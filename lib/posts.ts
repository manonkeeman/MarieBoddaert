import { createSupabaseAdminClient } from './supabase-server'

export { getReadingTime } from './utils'

export interface Post {
  slug:     string
  title:    string
  date:     string
  excerpt:  string
  content:  string    // HTML
  category: string
  color:    string
  emoji:    string
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('posts')
      .select('slug, title, date, excerpt, content, category, color, emoji')
      .eq('published', true)
      .order('date', { ascending: false })

    if (error || !data) return []
    return data.map(normalizePost)
  } catch {
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('posts')
      .select('slug, title, date, excerpt, content, category, color, emoji')
      .eq('slug', slug)
      .eq('published', true)
      .single()

    if (error || !data) return undefined
    return normalizePost(data)
  } catch {
    return undefined
  }
}

function normalizePost(p: any): Post {
  return {
    slug:     p.slug     ?? '',
    title:    p.title    ?? '',
    date:     p.date     ?? '',
    excerpt:  p.excerpt  ?? '',
    content:  p.content  ?? '',
    category: p.category ?? '',
    color:    p.color    ?? '#FAD5DA',
    emoji:    p.emoji    ?? '✍️',
  }
}
