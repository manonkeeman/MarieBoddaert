'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

// Landingspagina voor de link uit de "wachtwoord resetten"-mail.
// Supabase stuurt de sessie mee als #access_token (mail vanuit het dashboard)
// of als ?code= (mail aangevraagd via "Wachtwoord vergeten?" op de loginpagina).
export default function AdminWachtwoord() {
  const [ready, setReady]         = useState(false)
  const [linkError, setLinkError] = useState('')
  const [password, setPassword]   = useState('')
  const [repeat, setRepeat]       = useState('')
  const [error, setError]         = useState('')
  const [saving, setSaving]       = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function loadSession() {
      const supabase = createClient()
      const hash  = new URLSearchParams(window.location.hash.slice(1))
      const query = new URLSearchParams(window.location.search)

      const errorDescription = hash.get('error_description') ?? query.get('error_description')
      if (errorDescription) {
        setLinkError('Deze link is verlopen of al gebruikt. Vraag een nieuwe aan.')
        return
      }

      const accessToken  = hash.get('access_token')
      const refreshToken = hash.get('refresh_token')
      const code         = query.get('code')

      let failed = false
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        failed = !!error
      } else if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        failed = !!error
      }

      // Tokens uit de adresbalk halen
      window.history.replaceState(null, '', window.location.pathname)

      const { data: { user } } = await supabase.auth.getUser()
      if (failed || !user) {
        setLinkError('Deze link is verlopen of al gebruikt. Vraag een nieuwe aan.')
        return
      }
      setReady(true)
    }
    loadSession()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Kies een wachtwoord van minstens 8 tekens.')
      return
    }
    if (password !== repeat) {
      setError('De wachtwoorden zijn niet hetzelfde.')
      return
    }

    setSaving(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError('Opslaan mislukt: ' + updateError.message)
      setSaving(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <h1 className="admin-login-title">Marie Boddaert</h1>
        <p className="admin-login-sub">Nieuw wachtwoord</p>

        {linkError && (
          <>
            <p className="admin-error">{linkError}</p>
            <p><a href="/admin/login">Naar inloggen</a></p>
          </>
        )}

        {!linkError && !ready && <p className="admin-login-sub">Even geduld...</p>}

        {ready && (
          <form onSubmit={handleSubmit} className="admin-login-form">
            <label className="admin-label">
              Nieuw wachtwoord
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="admin-input"
                autoComplete="new-password"
                required
                autoFocus
              />
            </label>

            <label className="admin-label">
              Herhaal wachtwoord
              <input
                type="password"
                value={repeat}
                onChange={e => setRepeat(e.target.value)}
                className="admin-input"
                autoComplete="new-password"
                required
              />
            </label>

            {error && <p className="admin-error">{error}</p>}

            <button type="submit" className="admin-btn-primary" disabled={saving}>
              {saving ? 'Bezig...' : 'Wachtwoord opslaan'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
