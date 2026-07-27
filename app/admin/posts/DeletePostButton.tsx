'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function DeletePostButton({ slug, title, category }: { slug: string; title: string; category: string }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Weet je zeker dat je "${title}" wilt verwijderen?`)) return
    setBusy(true)
    setError('')
    const supabase = createClient()
    const { data, error: err } = await supabase.from('posts').delete().eq('slug', slug).select()

    if (err) {
      setError(err.message)
      setBusy(false)
      return
    }
    if (!data || data.length === 0) {
      setError('Kon niet verwijderen (geen rechten of niet ingelogd).')
      setBusy(false)
      return
    }

    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'post', slug, category }),
      })
    } catch {}

    router.refresh()
    setBusy(false)
  }

  return (
    <>
      <button onClick={handleDelete} disabled={busy} className="admin-btn-danger" title="Verwijderen">
        {busy ? '…' : '🗑'}
      </button>
      {error && <span className="admin-error" title={error}>⚠</span>}
    </>
  )
}
