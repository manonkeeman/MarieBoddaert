import { createSupabaseAdminClient } from '@/lib/supabase-server'
import type { Metadata } from 'next'
import OverMijForm from './OverMijForm'

export const metadata: Metadata = { title: 'Over mij' }

export default async function AdminOverMij() {
  const supabase = createSupabaseAdminClient()
  const { data } = await supabase
    .from('about')
    .select('*')
    .eq('id', 'about-page')
    .single()

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Over mij pagina</h1>
        <a href="/over" target="_blank" rel="noopener noreferrer" className="admin-btn-ghost">
          Bekijk op site ↗
        </a>
      </div>
      <OverMijForm initial={data} />
    </div>
  )
}
