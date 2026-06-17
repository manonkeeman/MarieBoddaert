'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [naam, setNaam]           = useState('')
  const [email, setEmail]         = useState('')
  const [onderwerp, setOnderwerp] = useState('')
  const [bericht, setBericht]     = useState('')
  const [status, setStatus]       = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    const body = new URLSearchParams({
      'form-name': 'contact',
      naam,
      email,
      onderwerp,
      bericht,
    }).toString()

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })
      if (res.ok) {
        setStatus('sent')
        setNaam(''); setEmail(''); setOnderwerp(''); setBericht('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <p style={{ textAlign: 'center', padding: '2rem' }}>
        Bedankt voor je bericht! Marie neemt zo snel mogelijk contact met je op.
      </p>
    )
  }

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      className="comment-form"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value="contact" />
      <input type="hidden" name="bot-field" />

      <div className="form-group">
        <label htmlFor="naam" className="form-label">Naam</label>
        <input
          type="text" id="naam" name="naam" className="form-input"
          placeholder="Jouw naam" required
          value={naam} onChange={e => setNaam(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email" className="form-label">E-mailadres</label>
        <input
          type="email" id="email" name="email" className="form-input"
          placeholder="jij@voorbeeld.nl" required
          value={email} onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="onderwerp" className="form-label">Onderwerp</label>
        <input
          type="text" id="onderwerp" name="onderwerp" className="form-input"
          placeholder="Waar gaat je bericht over?"
          value={onderwerp} onChange={e => setOnderwerp(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="bericht" className="form-label">Bericht</label>
        <textarea
          id="bericht" name="bericht" className="form-textarea"
          placeholder="Schrijf hier je bericht..." rows={5} required
          value={bericht} onChange={e => setBericht(e.target.value)}
        />
      </div>

      {status === 'error' && (
        <p style={{ color: 'red', marginBottom: '1rem' }}>
          Er ging iets mis. Probeer het opnieuw of mail naar{' '}
          <a href="mailto:mh.boddaert@gmail.com">mh.boddaert@gmail.com</a>.
        </p>
      )}

      <button type="submit" className="btn btn-turquoise" disabled={status === 'sending'}>
        {status === 'sending' ? 'Versturen...' : 'Verstuur bericht →'}
      </button>
    </form>
  )
}