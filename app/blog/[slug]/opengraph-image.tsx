import { ImageResponse } from 'next/og'
import { getAllPosts, getPostBySlug } from '@/lib/posts'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(p => ({ slug: p.slug }))
}

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  const color    = post?.color    ?? '#FAD5DA'
  const title    = post?.title    ?? 'Marie H. Boddaert'
  const category = post?.category ?? ''
  const fontSize = title.length > 50 ? 52 : title.length > 30 ? 64 : 76

  return new ImageResponse(
    <div style={{
      background: color,
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px 80px', fontFamily: 'sans-serif',
    }}>
      <div style={{ fontSize: 20, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#6A5A6A', display: 'flex' }}>
        {category}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize, fontWeight: 800, color: '#2A1A2A', lineHeight: 1.2, marginBottom: 28, display: 'flex' }}>
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 4, background: 'rgba(42,26,42,0.3)', borderRadius: 2, display: 'flex' }} />
          <div style={{ fontSize: 26, color: '#6A5A6A', fontWeight: 600, display: 'flex' }}>
            Marie H. Boddaert
          </div>
        </div>
      </div>
    </div>
  )
}
