import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://marie-boddaert.netlify.app'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                    lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/verhalen`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/gedichten`,     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/kattenbellen`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/over`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`,       lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.5 },
  ]

  const postPages: MetadataRoute.Sitemap = posts.map(post => ({
    url:              `${BASE}/blog/${post.slug}`,
    lastModified:     new Date(post.date),
    changeFrequency:  'monthly',
    priority:         0.8,
  }))

  return [...staticPages, ...postPages]
}
