'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function ProfilePhoto({ sanityUrl }: { sanityUrl: string | null }) {
  const [src, setSrc] = useState(sanityUrl || '/marie-profiel.png')

  return (
    <Image
      src={src}
      alt="Marie H. Boddaert"
      width={200}
      height={200}
      className="over-photo"
      priority
      onError={() => setSrc('/marie-profiel.png')}
    />
  )
}
