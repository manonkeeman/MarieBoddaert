import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div style={{
      width: '512px', height: '512px',
      background: '#2A1A2A',         // schaduwkleur (90s offset)
      display: 'flex',
      padding: '0 40px 40px 0',      // schaduw rechts-onder
    }}>
      {/* Hoofdvlak */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #F7C5D1 0%, #DDD0F0 100%)',
        border: '16px solid #2A1A2A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 0,
      }}>
        {/* Initialen */}
        <div style={{
          display: 'flex',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 220,
          fontWeight: 800,
          color: '#2A1A2A',
          letterSpacing: '-8px',
          lineHeight: 1,
        }}>
          MB
        </div>
      </div>
    </div>
  )
}
