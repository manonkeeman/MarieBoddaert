import Link from 'next/link'
import NavLinks from './NavLinks'
import SearchBar from './SearchBar'

export default function Header() {
  return (
    <header className="header">
      <div className="header-photo-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/marie-en-paco.jpeg" alt="Marie en Paco" className="header-photo" />
      </div>
      <div className="header-center">
        <Link href="/" className="header-brand">Blog</Link>
        <p className="header-tagline">Marie H. Boddaert</p>
        <NavLinks />
        <SearchBar />
      </div>
    </header>
  )
}
