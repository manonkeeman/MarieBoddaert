'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function ReactieActies({ id, approved }: { id: string; approved: boolean }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function toggle() {
    setBusy(true)
    setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('comments')
      .update({ approved: !approved })
      .eq('id', id)
      .select()

    if (err) {
      setError(err.message)
    } else if (!data || data.length === 0) {
      setError('Kon niet opslaan (geen rechten of niet ingelogd).')
    } else {
      router.refresh()
    }
    setBusy(false)
  }

  async function remove() {
    if (!confirm('Reactie definitief verwijderen?')) return
    setBusy(true)
    setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)
      .select()

    if (err) {
      setError(err.message)
    } else if (!data || data.length === 0) {
      setError('Kon niet verwijderen (geen rechten of niet ingelogd).')
    } else {
      router.refresh()
    }
    setBusy(false)
  }

  return (
    <div className="admin-comment-actions">
      <button onClick={toggle} disabled={busy} className={approved ? 'admin-btn-ghost' : 'admin-btn-primary'}>
        {approved ? 'Afkeuren' : '✓ Goedkeuren'}
      </button>
      <button onClick={remove} disabled={busy} className="admin-btn-danger">
        Verwijderen
      </button>
      {error && <p className="admin-error">{error}</p>}
    </div>
  )
}
