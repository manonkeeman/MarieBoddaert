import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{
      width: '180px', height: '180px',
      background: '#2A1A2A',
      display: 'flex',
      padding: '0 14px 14px 0',
    }}>
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #F7C5D1 0%, #DDD0F0 100%)',
        border: '6px solid #2A1A2A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          display: 'flex',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 78,
          fontWeight: 800,
          color: '#2A1A2A',
          letterSpacing: '-3px',
        }}>
          MB
        </div>
      </div>
    </div>
  )
}
