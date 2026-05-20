import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const alt = 'Marie H. Boddaert — Blog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  const photo = readFileSync(join(process.cwd(), 'public', 'marie.png'))
  const photoSrc = `data:image/png;base64,${photo.toString('base64')}`

  return new ImageResponse(
    <div style={{
      width: '1200px', height: '630px',
      background: 'linear-gradient(135deg, #FBCFDB 0%, #E8D0F5 55%, #C5E5EF 100%)',
      display: 'flex', alignItems: 'center',
      padding: '64px 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Decoratieve cirkel achtergrond */}
      <div style={{
        position: 'absolute', top: -160, left: -120,
        width: 440, height: 440, borderRadius: '50%',
        background: 'rgba(255,255,255,0.18)', display: 'flex',
      }} />
      <div style={{
        position: 'absolute', bottom: -140, right: 260,
        width: 320, height: 320, borderRadius: '50%',
        background: 'rgba(255,255,255,0.14)', display: 'flex',
      }} />

      {/* Links: tekst */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, zIndex: 1 }}>

        {/* Badge */}
        <div style={{
          display: 'flex', alignItems: 'center',
          marginBottom: 28,
        }}>
          <div style={{
            display: 'flex',
            border: '2px solid #2A1A2A',
            padding: '6px 20px',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#2A1A2A',
            background: 'rgba(255,255,255,0.6)',
          }}>
            Blog
          </div>
        </div>

        {/* Naam */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          fontSize: 72, fontWeight: 800,
          color: '#2A1A2A', lineHeight: 1.05,
          fontFamily: 'Georgia, "Times New Roman", serif',
          marginBottom: 24,
        }}>
          <span style={{ display: 'flex' }}>Marie H.</span>
          <span style={{ display: 'flex' }}>Boddaert</span>
        </div>

        {/* Lijn */}
        <div style={{
          width: 100, height: 4,
          background: '#2A1A2A',
          marginBottom: 22,
          display: 'flex',
        }} />

        {/* Categorieën */}
        <div style={{
          display: 'flex', gap: 12, flexWrap: 'wrap',
        }}>
          {['Blogs', 'Gedichten', 'Kattenbellen'].map(cat => (
            <div key={cat} style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.55)',
              border: '2px solid #2A1A2A',
              borderRadius: 0,
              padding: '6px 16px',
              fontSize: 18,
              fontWeight: 700,
              color: '#2A1A2A',
            }}>
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Rechts: foto */}
      <div style={{
        display: 'flex', zIndex: 1, flexShrink: 0,
        marginLeft: 60,
      }}>
        <img
          src={photoSrc}
          width={260}
          height={260}
          style={{
            objectFit: 'cover',
            objectPosition: 'top',
            border: '3px solid #2A1A2A',
            boxShadow: '8px 8px 0 #2A1A2A',
          }}
        />
      </div>

    </div>
  )
}
