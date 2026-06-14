'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [naam, setNaam]           = useState('')
  const [email, setEmail]         = useState('')
  const [onderwerp, setOnderwerp] = useState('')
  const [bericht, setBericht]     = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(onderwerp || `Bericht van ${naam}`)
    const body    = encodeURIComponent(`Naam: ${naam}\nE-mail: ${email}\n\n${bericht}`)
    window.location.href = `mailto:mh.boddaert@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="naam" className="form-label">Naam</label>
        <input
          type="text" id="naam" className="form-input"
          placeholder="Jouw naam" required
          value={naam} onChange={e => setNaam(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email" className="form-label">E-mailadres</label>
        <input
          type="email" id="email" className="form-input"
          placeholder="jij@voorbeeld.nl" required
          value={email} onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="onderwerp" className="form-label">Onderwerp</label>
        <input
          type="text" id="onderwerp" className="form-input"
          placeholder="Waar gaat je bericht over?"
          value={onderwerp} onChange={e => setOnderwerp(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="bericht" className="form-label">Bericht</label>
        <textarea
          id="bericht" className="form-textarea"
          placeholder="Schrijf hier je bericht..." rows={5} required
          value={bericht} onChange={e => setBericht(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-turquoise">Verstuur bericht →</button>
    </form>
  )
}
