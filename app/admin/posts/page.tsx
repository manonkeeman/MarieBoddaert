import Link from 'next/link'
import { createSupabaseAdminClient } from '@/lib/supabase-server'
import type { Metadata } from 'next'
import DeletePostButton from './DeletePostButton'

export const metadata: Metadata = { title: 'Posts' }

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function AdminPosts() {
  const supabase = createSupabaseAdminClient()
  const { data: posts } = await supabase
    .from('posts')
    .select('id, slug, title, date, category, published')
    .order('date', { ascending: false })

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Posts</h1>
        <Link href="/admin/posts/nieuw" className="admin-btn-primary">+ Nieuwe post</Link>
      </div>

      {!posts?.length ? (
        <p className="admin-empty">Nog geen posts. Maak er een aan!</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titel</th>
                <th>Categorie</th>
                <th>Datum</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td>
                    <Link href={`/admin/posts/${post.slug}`} className="admin-table-link">
                      {post.title}
                    </Link>
                  </td>
                  <td><span className="admin-badge">{post.category}</span></td>
                  <td className="admin-muted">{formatDate(post.date)}</td>
                  <td>
                    <span className={`admin-status ${post.published ? 'published' : 'draft'}`}>
                      {post.published ? 'Gepubliceerd' : 'Concept'}
                    </span>
                  </td>
                  <td className="admin-actions-cell">
                    <Link href={`/blog/${post.slug}`} target="_blank" className="admin-btn-ghost" title="Bekijk op site">
                      ↗
                    </Link>
                    <DeletePostButton slug={post.slug} title={post.title} category={post.category} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
