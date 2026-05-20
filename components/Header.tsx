import Link from 'next/link'
import NavLinks from './NavLinks'
import SearchBar from './SearchBar'

export default function Header() {
  return (
    <header className="header">
      <Link href="/" className="header-brand">Blog</Link>
      <p className="header-tagline">Marie H. Boddaert</p>
      <NavLinks />
      <SearchBar />
    </header>
  )
}
