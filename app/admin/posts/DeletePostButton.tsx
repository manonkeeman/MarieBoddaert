'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function DeletePostButton({ slug, title }: { slug: string; title: string }) {
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Weet je zeker dat je "${title}" wilt verwijderen?`)) return
    setBusy(true)
    const supabase = createClient()
    await supabase.from('posts').delete().eq('slug', slug)
    router.refresh()
  }

  return (
    <button onClick={handleDelete} disabled={busy} className="admin-btn-danger" title="Verwijderen">
      {busy ? '…' : '🗑'}
    </button>
  )
}
