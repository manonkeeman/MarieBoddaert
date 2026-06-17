'use client'

import { useState, useEffect } from 'react'

const slides = [
  { quote: 'Alles is hetzelfde, maar alles is anders. Dit is mijn nieuwe hoofdstuk.', color: '#FAD5DA' },
  { quote: 'Ik wil een bakfiets waar mijn hond de kop uitsteekt, zijn oren waaiend in de wind.', color: '#BEE9E9' },
  { quote: 'De geur is de moederlijke geborgenheid om je in te wentelen.', color: '#E2D4F0' },
  { quote: 'Aan deze kant van Morpheus\' oever is er ook wat reuring.', color: '#FAE5CE' },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length)
        setVisible(true)
      }, 500)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  function goTo(index: number) {
    if (index === current) return
    setVisible(false)
    setTimeout(() => {
      setCurrent(index)
      setVisible(true)
    }, 300)
  }

  return (
    <div className="hero-slider" style={{ backgroundColor: slides[current].color }}>
      <div className={`hero-slide-content${visible ? ' visible' : ''}`}>
        <blockquote className="hero-quote">
          &ldquo;{slides[current].quote}&rdquo;
        </blockquote>
      </div>
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Quote ${i + 1}`}
            className={`hero-dot${i === current ? ' active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  )
}
