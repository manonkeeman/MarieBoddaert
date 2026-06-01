'use client'

import { useState } from 'react'

export default function ProfilePhoto({ sanityUrl }: { sanityUrl: string | null }) {
  const [src, setSrc] = useState(sanityUrl || '/marie-profiel.png')

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Marie H. Boddaert"
      className="over-photo"
      onError={() => setSrc('/marie-profiel.png')}
    />
  )
}
