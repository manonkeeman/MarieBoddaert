'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function AdminLogin() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Verkeerd e-mailadres of wachtwoord.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  async function handleForgotPassword() {
    setError('')
    if (!email) {
      setError('Vul eerst je e-mailadres in.')
      return
    }

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/wachtwoord`,
    })

    if (resetError) {
      setError('Versturen mislukt, probeer het later nog eens.')
      return
    }
    setResetSent(true)
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <h1 className="admin-login-title">Marie Boddaert</h1>
        <p className="admin-login-sub">Beheer</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <label className="admin-label">
            E-mailadres
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="admin-input"
              required
              autoFocus
            />
          </label>

          <label className="admin-label">
            Wachtwoord
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="admin-input"
              required
            />
          </label>

          {error && <p className="admin-error">{error}</p>}
          {resetSent && <p className="admin-success">Als dit adres bekend is, staat er een mail met een link in je inbox.</p>}

          <button type="submit" className="admin-btn-primary" disabled={loading}>
            {loading ? 'Bezig...' : 'Inloggen'}
          </button>

          <button type="button" className="admin-link-button" onClick={handleForgotPassword}>
            Wachtwoord vergeten?
          </button>
        </form>
      </div>
    </div>
  )
}
