import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'
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

  const photo = readFileSync(join(process.cwd(), 'public', 'marie.png'))
  const photoSrc = `data:image/png;base64,${photo.toString('base64')}`

  const fontSize = title.length > 60 ? 52 : title.length > 40 ? 62 : title.length > 25 ? 72 : 84

  // Lichtere versie van de kaartkleur als tweede kleur
  const bgMap: Record<string, string> = {
    '#FAD5DA': '#fce8ec',
    '#BEE9E9': '#daf4f4',
    '#E2D4F0': '#ede4f7',
    '#FAE5CE': '#fdf0e0',
    '#C8EAD8': '#dff3e8',
    '#DDD0F0': '#e9e0f7',
    '#D5DCF0': '#e3e8f7',
  }
  const lightColor = bgMap[color] ?? '#fef8fa'

  return new ImageResponse(
    <div style={{
      width: '1200px', height: '630px',
      background: `linear-gradient(135deg, ${color} 0%, ${lightColor} 100%)`,
      display: 'flex', flexDirection: 'column',
      padding: '60px 80px',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Decoratieve cirkel */}
      <div style={{
        position: 'absolute', top: -100, right: -80,
        width: 360, height: 360, borderRadius: '50%',
        background: 'rgba(255,255,255,0.25)', display: 'flex',
      }} />

      {/* Categorie badge */}
      <div style={{ display: 'flex', marginBottom: 32 }}>
        <div style={{
          display: 'flex',
          border: '2px solid #2A1A2A',
          padding: '6px 18px',
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#2A1A2A',
          background: 'rgba(255,255,255,0.5)',
        }}>
          {category}
        </div>
      </div>

      {/* Titel */}
      <div style={{
        display: 'flex', flex: 1, alignItems: 'flex-start',
      }}>
        <div style={{
          fontSize,
          fontWeight: 800,
          color: '#2A1A2A',
          lineHeight: 1.15,
          fontFamily: 'Georgia, "Times New Roman", serif',
          maxWidth: '820px',
          display: 'flex',
          flexWrap: 'wrap',
        }}>
          {title}
        </div>
      </div>

      {/* Onderste balk: auteur + foto */}
      <div style={{
        display: 'flex', alignItems: 'center',
        borderTop: '3px solid rgba(42,26,42,0.25)',
        paddingTop: 24, marginTop: 8,
      }}>
        <img
          src={photoSrc}
          width={56}
          height={56}
          style={{
            objectFit: 'cover',
            objectPosition: 'top',
            border: '2px solid #2A1A2A',
            marginRight: 16,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontSize: 22, fontWeight: 800,
            color: '#2A1A2A', display: 'flex',
            fontFamily: 'Georgia, serif',
          }}>
            Marie H. Boddaert
          </div>
          <div style={{
            fontSize: 15, color: '#6A5A6A',
            display: 'flex', letterSpacing: '0.04em',
          }}>
            Blogs · Gedichten · Kattenbellen
          </div>
        </div>

        {/* URL rechts */}
        <div style={{
          marginLeft: 'auto',
          fontSize: 16, color: '#2A1A2A',
          opacity: 0.45,
          fontWeight: 600,
          display: 'flex',
          letterSpacing: '0.04em',
        }}>
          marie-boddaert.netlify.app
        </div>
      </div>

    </div>
  )
}
