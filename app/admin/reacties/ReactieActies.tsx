'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function ReactieActies({ id, approved }: { id: string; approved: boolean }) {
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  async function toggle() {
    setBusy(true)
    const supabase = createClient()
    await supabase.from('comments').update({ approved: !approved }).eq('id', id)
    router.refresh()
  }

  async function remove() {
    if (!confirm('Reactie definitief verwijderen?')) return
    setBusy(true)
    const supabase = createClient()
    await supabase.from('comments').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div className="admin-comment-actions">
      <button onClick={toggle} disabled={busy} className={approved ? 'admin-btn-ghost' : 'admin-btn-primary'}>
        {approved ? 'Afkeuren' : '✓ Goedkeuren'}
      </button>
      <button onClick={remove} disabled={busy} className="admin-btn-danger">
        Verwijderen
      </button>
    </div>
  )
}
