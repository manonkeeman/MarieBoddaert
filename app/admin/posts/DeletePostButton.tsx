'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function DeletePostButton({ slug, title, category }: { slug: string; title: string; category: string }) {
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Weet je zeker dat je "${title}" wilt verwijderen?`)) return
    setBusy(true)
    const supabase = createClient()
    await supabase.from('posts').delete().eq('slug', slug)

    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scope: 'post', slug, category }),
      })
    } catch {}

    router.refresh()
  }

  return (
    <button onClick={handleDelete} disabled={busy} className="admin-btn-danger" title="Verwijderen">
      {busy ? '…' : '🗑'}
    </button>
  )
}
