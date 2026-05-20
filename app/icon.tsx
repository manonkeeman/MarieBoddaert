import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div style={{
      width: '512px', height: '512px',
      borderRadius: '96px',
      background: 'linear-gradient(135deg, #F7C5D1 0%, #DDD0F0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        fontSize: 240,
        fontWeight: 900,
        color: '#2A1A2A',
        display: 'flex',
        letterSpacing: '-12px',
        fontFamily: 'Arial Black, Arial, sans-serif',
        lineHeight: 1,
        paddingRight: '12px',
      }}>
        MB
      </div>
    </div>
  )
}
