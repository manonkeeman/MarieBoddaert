import type { Metadata } from 'next'
import AdminNav from './AdminNav'

export const metadata: Metadata = {
  title: { default: 'Beheer', template: '%s — Beheer' },
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell">
      <AdminNav />
      <main className="admin-main">{children}</main>
    </div>
  )
}
