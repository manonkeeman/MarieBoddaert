'use client'

import { useState } from 'react'

export default function ProfilePhoto({ photoUrl }: { photoUrl: string | null }) {
  const [src, setSrc] = useState(photoUrl || '/marie-paco.jpeg')

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Marie H. Boddaert"
      className="over-photo"
      onError={() => setSrc('/marie-paco.jpeg')}
    />
  )
}
