'use client'

import { useState, useEffect } from 'react'

const REACTIONS = [
  { emoji: '❤️', key: 'heart',    label: 'Liefde' },
  { emoji: '👏', key: 'applause', label: 'Applaus' },
  { emoji: '😂', key: 'laugh',    label: 'Grappig' },
  { emoji: '🌸', key: 'flower',   label: 'Mooi' },
  { emoji: '✨', key: 'sparkle',  label: 'Bijzonder' },
  { emoji: '🥺', key: 'sad',      label: 'Ontroerend' },
]

function storageKey(postSlug: string, key: string) {
  return `reacted_${postSlug}_${key}`
}

export default function ReactionBar({ postTitle, postSlug }: { postTitle: string; postSlug: string }) {
  const [counts, setCounts]   = useState<Record<string, number>>({})
  const [reacted, setReacted] = useState<Record<string, boolean>>({})
  const [bounce, setBounce]   = useState<string | null>(null)

  useEffect(() => {
    const stored: Record<string, boolean> = {}
    for (const r of REACTIONS) {
      stored[r.key] = localStorage.getItem(storageKey(postSlug, r.key)) === '1'
    }
    setReacted(stored)

    fetch(`/api/reactions?slug=${encodeURIComponent(postSlug)}`)
      .then(res => res.json())
      .then(data => setCounts(data))
      .catch(() => {})
  }, [postSlug])

  async function handleClick(emoji: string, key: string) {
    if (reacted[key]) return

    localStorage.setItem(storageKey(postSlug, key), '1')
    setReacted(prev => ({ ...prev, [key]: true }))
    setCounts(prev => ({ ...prev, [key]: (prev[key] ?? 0) + 1 }))
    setBounce(key)
    setTimeout(() => setBounce(null), 400)

    fetch('/api/reactions', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ emoji, postSlug }),
    }).catch(() => {})
  }

  return (
    <div className="reaction-bar">
      <p className="reaction-label">Wat vond je ervan?</p>
      <div className="reaction-buttons">
        {REACTIONS.map(r => (
          <button
            key={r.emoji}
            type="button"
            className={`reaction-btn${reacted[r.key] ? ' reacted' : ''}${bounce === r.key ? ' bounce' : ''}`}
            title={r.label}
            onClick={() => handleClick(r.emoji, r.key)}
            disabled={reacted[r.key]}
          >
            <span className="reaction-emoji">{r.emoji}</span>
            {(counts[r.key] ?? 0) > 0 && (
              <span className="reaction-count">{counts[r.key]}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
