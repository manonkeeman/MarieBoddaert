'use client'

import { useState, useEffect } from 'react'

interface Comment {
  _id: string
  name: string
  message: string
  createdAt: string
}

export default function CommentForm({ postTitle, postSlug }: { postTitle: string; postSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  useEffect(() => {
    fetch(`/api/comments?slug=${encodeURIComponent(postSlug)}`)
      .then(r => r.json())
      .then(d => setComments(d.comments || []))
      .catch(() => {})
  }, [postSlug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/comments', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, message, postSlug }),
      })
      if (res.ok) {
        setStatus('sent')
        setName('')
        setMessage('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="comment-section">

      {comments.length > 0 && (
        <div className="comment-list">
          <h3 className="comment-heading">Reacties ({comments.length})</h3>
          {comments.map(c => (
            <div key={c._id} className="comment-item">
              <div className="comment-item-meta">
                <span className="comment-item-name">{c.name}</span>
                <span className="comment-item-date">
                  {new Date(c.createdAt).toLocaleDateString('nl-NL', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
              <p className="comment-item-message">{c.message}</p>
            </div>
          ))}
        </div>
      )}

      <h3 className="comment-heading">Laat een reactie achter</h3>

      {status === 'sent' ? (
        <p className="comment-sent">Bedankt voor je reactie! Hij verschijnt na goedkeuring. ✉️</p>
      ) : (
        <form className="comment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="c-name" className="form-label">Naam</label>
            <input
              id="c-name"
              type="text"
              className="form-input"
              placeholder="Jouw naam"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={100}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="c-msg" className="form-label">Reactie</label>
            <textarea
              id="c-msg"
              className="form-textarea"
              placeholder="Schrijf jouw reactie..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              maxLength={2000}
              required
            />
          </div>
          {status === 'error' && (
            <p className="comment-error">Er ging iets mis. Probeer het opnieuw.</p>
          )}
          <button
            type="submit"
            className="btn btn-lavender"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Bezig...' : 'Verstuur reactie →'}
          </button>
        </form>
      )}
    </div>
  )
}
