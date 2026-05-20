'use client'

import { useState } from 'react'

export default function CommentForm({ postTitle }: { postTitle: string }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const s = encodeURIComponent(`Reactie op "${postTitle}"`)
    const b = encodeURIComponent(`Naam: ${name}\n\nReactie:\n${message}\n\n— Verstuurd via marieboddaert.nl`)
    window.open(`mailto:mh.boddaert@gmail.com?subject=${s}&body=${b}`)
    setSent(true)
  }

  return (
    <div className="comment-section">
      <h3 className="comment-heading">Laat een reactie achter</h3>
      {sent ? (
        <p className="comment-sent">Bedankt! Je e-mailprogramma opent met je reactie klaar om te versturen. ✉️</p>
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
              required
            />
          </div>
          <button type="submit" className="btn btn-lavender">Verstuur reactie →</button>
        </form>
      )}
    </div>
  )
}
