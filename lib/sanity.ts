import { createClient } from 'next-sanity'

export const sanityClient = createClient({
  projectId: 'xfgj8bxt',
  dataset:   'production',
  apiVersion: '2025-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})

export const allPostsQuery = `
  *[_type == "post"] | order(date desc) {
    "slug":    slug.current,
    title,
    date,
    excerpt,
    content,
    category,
    "color":  coalesce(color, "#FAD5DA"),
    "emoji":  coalesce(emoji, "✍️")
  }
`

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    "slug":   slug.current,
    title,
    date,
    excerpt,
    content,
    category,
    "color":  coalesce(color, "#FAD5DA"),
    "emoji":  coalesce(emoji, "✍️")
  }
`
