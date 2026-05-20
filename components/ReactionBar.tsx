'use client'

const reactions = [
  { emoji: '❤️', label: 'Liefde' },
  { emoji: '👏', label: 'Applaus' },
  { emoji: '😂', label: 'Grappig' },
  { emoji: '🌸', label: 'Mooi' },
  { emoji: '✨', label: 'Bijzonder' },
  { emoji: '🥺', label: 'Ontroerend' },
]

export default function ReactionBar({ postTitle }: { postTitle: string }) {
  function react(emoji: string, label: string) {
    const s = encodeURIComponent(`Reactie op: ${postTitle}`)
    const b = encodeURIComponent(`Mijn reactie: ${emoji} (${label})\n\nPost: ${postTitle}`)
    window.open(`mailto:mh.boddaert@gmail.com?subject=${s}&body=${b}`)
  }

  return (
    <div className="reaction-bar">
      <p className="reaction-label">Wat vond je ervan?</p>
      <div className="reaction-buttons">
        {reactions.map(r => (
          <button
            key={r.emoji}
            className="reaction-btn"
            title={r.label}
            onClick={() => react(r.emoji, r.label)}
          >
            {r.emoji}
          </button>
        ))}
      </div>
    </div>
  )
}
