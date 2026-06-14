import { createSupabaseAdminClient } from '@/lib/supabase-server'
import type { Metadata } from 'next'
import ReactieActies from './ReactieActies'

export const metadata: Metadata = { title: 'Reacties' }

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default async function AdminReacties() {
  const supabase = createSupabaseAdminClient()
  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false })

  const pending   = comments?.filter(c => !c.approved) ?? []
  const approved  = comments?.filter(c =>  c.approved) ?? []

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Reacties</h1>
        {pending.length > 0 && (
          <span className="admin-badge-count">{pending.length} wacht op goedkeuring</span>
        )}
      </div>

      {/* Wacht op goedkeuring */}
      {pending.length > 0 && (
        <section className="admin-section">
          <h2 className="admin-section-title">⏳ Wacht op goedkeuring</h2>
          <div className="admin-comments-list">
            {pending.map(c => (
              <div key={c.id} className="admin-comment-card pending">
                <div className="admin-comment-meta">
                  <strong>{c.name}</strong>
                  <span className="admin-muted"> op </span>
                  <a href={`/blog/${c.post_slug}`} target="_blank" className="admin-table-link">/blog/{c.post_slug}</a>
                  <span className="admin-muted"> · {formatDate(c.created_at)}</span>
                </div>
                <p className="admin-comment-text">{c.message}</p>
                <ReactieActies id={c.id} approved={c.approved} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Goedgekeurd */}
      <section className="admin-section">
        <h2 className="admin-section-title">✅ Goedgekeurde reacties ({approved.length})</h2>
        {approved.length === 0 ? (
          <p className="admin-empty">Nog geen goedgekeurde reacties.</p>
        ) : (
          <div className="admin-comments-list">
            {approved.map(c => (
              <div key={c.id} className="admin-comment-card">
                <div className="admin-comment-meta">
                  <strong>{c.name}</strong>
                  <span className="admin-muted"> op </span>
                  <a href={`/blog/${c.post_slug}`} target="_blank" className="admin-table-link">/blog/{c.post_slug}</a>
                  <span className="admin-muted"> · {formatDate(c.created_at)}</span>
                </div>
                <p className="admin-comment-text">{c.message}</p>
                <ReactieActies id={c.id} approved={c.approved} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
