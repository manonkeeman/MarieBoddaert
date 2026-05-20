import { ImageResponse } from 'next/og'

export const alt = 'Marie H. Boddaert — Blog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    <div style={{
      background: 'linear-gradient(135deg, #FBCFDB 0%, #E8D0F5 50%, #C5E5EF 100%)',
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '60px', fontFamily: 'sans-serif',
      position: 'relative',
    }}>
      <div style={{ fontSize: 96, fontWeight: 800, color: '#2A1A2A', letterSpacing: '0.08em', lineHeight: 1, display: 'flex' }}>
        Blog
      </div>
      <div style={{ width: 160, height: 4, background: 'rgba(42,26,42,0.25)', margin: '28px 0 24px', borderRadius: 2, display: 'flex' }} />
      <div style={{ fontSize: 38, fontWeight: 700, color: '#2A1A2A', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'flex' }}>
        Marie H. Boddaert
      </div>
      <div style={{ fontSize: 24, color: '#6A5A6A', marginTop: 18, textAlign: 'center', display: 'flex' }}>
        Blogs · Gedichten · Kattenbellen · Gevatte teksten
      </div>
    </div>
  )
}
