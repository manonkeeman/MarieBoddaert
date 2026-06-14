'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/',             label: 'Home' },
  { href: '/verhalen',     label: 'Verhalen' },
  { href: '/gedichten',    label: 'Gedichten' },
  { href: '/kattenbellen', label: 'Kattenbellen' },
  { href: '/over',         label: 'Over' },
  { href: '/contact',      label: 'Contact' },
  { href: 'https://substack.com/@marieboddaert', label: 'Substack', highlight: true, external: true },
]

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="header-nav" aria-label="Hoofdnavigatie">
      {links.map(({ href, label, highlight, external }) => {
        const cls = [
          !external && pathname === href ? 'nav-active' : '',
          highlight ? 'nav-highlight' : '',
        ].filter(Boolean).join(' ')

        if (external) {
          return (
            <a key={label} href={href} className={cls} target="_blank" rel="noopener noreferrer">
              {label}
            </a>
          )
        }
        return (
          <Link key={label} href={href} className={cls || undefined}>
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
