import { ImageResponse } from 'next/og'
import { createSupabaseAdminClient } from '@/lib/supabase-server'

export const alt = 'Marie H. Boddaert — Blog'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://marieboddaert.nl'

async function fetchPhoto(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return null
    const buf = await res.arrayBuffer()
    const mime = res.headers.get('content-type') ?? 'image/jpeg'
    return `data:${mime};base64,${Buffer.from(buf).toString('base64')}`
  } catch {
    return null
  }
}

export default async function Image() {
  // 1. Foto die Marie heeft geüpload via het admin panel
  let photoSrc: string | null = null
  try {
    const supabase = createSupabaseAdminClient()
    const { data } = await supabase
      .from('about')
      .select('photo_url')
      .eq('id', 'about-page')
      .single()
    if (data?.photo_url) {
      photoSrc = await fetchPhoto(data.photo_url)
    }
  } catch {}

  // 2. Fallback: marie-over-mij.jpeg van de live site (statisch bestand)
  if (!photoSrc) {
    photoSrc = await fetchPhoto(`${SITE}/marie-over-mij.jpeg`)
  }

  return new ImageResponse(
    <div style={{
      width: '1200px', height: '630px',
      background: 'linear-gradient(135deg, #FBCFDB 0%, #E8D0F5 55%, #C5E5EF 100%)',
      display: 'flex', alignItems: 'center',
      padding: '64px 80px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -160, left: -120,
        width: 440, height: 440, borderRadius: '50%',
        background: 'rgba(255,255,255,0.18)', display: 'flex',
      }} />

      {/* Tekst links */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, zIndex: 1 }}>
        <div style={{ display: 'flex', marginBottom: 28 }}>
          <div style={{
            display: 'flex', border: '2px solid #2A1A2A',
            padding: '6px 20px', fontSize: 15, fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#2A1A2A', background: 'rgba(255,255,255,0.6)',
          }}>
            Blog
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 24 }}>
          <span style={{
            display: 'flex',
            fontFamily: 'Georgia, serif', fontSize: 72, fontWeight: 800,
            color: '#2A1A2A', lineHeight: 1.05,
          }}>Marie H.</span>
          <span style={{
            display: 'flex',
            fontFamily: 'Georgia, serif', fontSize: 72, fontWeight: 800,
            color: '#2A1A2A', lineHeight: 1.05,
          }}>Boddaert</span>
        </div>
        <div style={{ width: 100, height: 4, background: '#2A1A2A', marginBottom: 22, display: 'flex' }} />
        <div style={{ display: 'flex', gap: 12 }}>
          {['Blogs', 'Gedichten', 'Kattenbellen'].map(cat => (
            <div key={cat} style={{
              display: 'flex', background: 'rgba(255,255,255,0.55)',
              border: '2px solid #2A1A2A', padding: '6px 16px',
              fontSize: 18, fontWeight: 700, color: '#2A1A2A',
            }}>
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Foto rechts */}
      {photoSrc ? (
        <div style={{ display: 'flex', zIndex: 1, flexShrink: 0, marginLeft: 60 }}>
          <img src={photoSrc} width={280} height={502}
            style={{ objectFit: 'cover', objectPosition: '50% 15%',
              border: '3px solid #2A1A2A', boxShadow: '8px 8px 0 #2A1A2A' }}
          />
        </div>
      ) : (
        <div style={{
          display: 'flex', zIndex: 1, flexShrink: 0, marginLeft: 60,
          width: 280, height: 502,
          background: 'rgba(255,255,255,0.4)',
          border: '3px solid #2A1A2A',
          alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Georgia, serif', fontSize: 80, fontWeight: 800,
          color: '#2A1A2A',
        }}>M</div>
      )}
    </div>
  )
}
