import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{
      width: '180px', height: '180px',
      borderRadius: '40px',
      background: 'linear-gradient(135deg, #F7C5D1 0%, #DDD0F0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        fontSize: 88,
        fontWeight: 900,
        color: '#2A1A2A',
        display: 'flex',
        letterSpacing: '-4px',
        fontFamily: 'Arial Black, Arial, sans-serif',
        lineHeight: 1,
        paddingRight: '4px',
      }}>
        MB
      </div>
    </div>
  )
}
