import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'xfgj8bxt',
  dataset:   'production',
  apiVersion: '2025-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})

export const aboutQuery = `
  *[_type == "about" && _id == "about-page"][0] {
    photo, tagline, services, bio, slogan,
    instagram, linkedin, blogger, substack
  }
`

export function sanityImageUrl(image: any): string | null {
  if (!image?.asset?._ref) return null
  const ref: string = image.asset._ref
  const withoutPrefix = ref.slice('image-'.length)
  const lastDash = withoutPrefix.lastIndexOf('-')
  const name = withoutPrefix.slice(0, lastDash) + '.' + withoutPrefix.slice(lastDash + 1)
  return `https://cdn.sanity.io/images/xfgj8bxt/production/${name}?w=400&h=400&fit=crop&crop=faces`
}

export const allPostsQuery = `
  *[_type == "post"] | order(date desc) {
    "slug":   slug.current,
    title, date, excerpt, content, category,
    "color":  coalesce(color, "#FAD5DA"),
    "emoji":  coalesce(emoji, "✍️")
  }
`

export const postBySlugQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    "slug":   slug.current,
    title, date, excerpt, content, category,
    "color":  coalesce(color, "#FAD5DA"),
    "emoji":  coalesce(emoji, "✍️")
  }
`
