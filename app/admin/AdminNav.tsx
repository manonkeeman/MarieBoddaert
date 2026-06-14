'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const NAV = [
  { href: '/admin/posts',    label: '✍️ Posts' },
  { href: '/admin/over-mij', label: '👤 Over mij' },
  { href: '/admin/reacties', label: '💬 Reacties' },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  if (pathname === '/admin/login') return null

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <span>Marie Boddaert</span>
        <small>Beheer</small>
      </div>

      <nav className="admin-nav">
        {NAV.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={pathname.startsWith(href) ? 'admin-nav-link active' : 'admin-nav-link'}
          >
            {label}
          </Link>
        ))}
      </nav>

      <button onClick={handleLogout} className="admin-logout-btn">
        Uitloggen
      </button>
    </aside>
  )
}
