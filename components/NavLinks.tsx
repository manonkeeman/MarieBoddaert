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
  { href: '#',             label: 'Nieuwsbrief', highlight: true },
]

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="header-nav" aria-label="Hoofdnavigatie">
      {links.map(({ href, label, highlight }) => (
        <Link
          key={label}
          href={href}
          className={[
            pathname === href ? 'nav-active' : '',
            highlight ? 'nav-highlight' : '',
          ].filter(Boolean).join(' ')}
        >
          {label}
        </Link>
      ))}
    </nav>
  )
}
