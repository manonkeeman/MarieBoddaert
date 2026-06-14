import Link from 'next/link'
import NavLinks from './NavLinks'
import SearchBar from './SearchBar'

export default function Header() {
  return (
    <header className="header">

      {/* Rij 1: foto + merknaam links, zoekbalk rechts */}
      <div className="header-top">
        <div className="header-brand-group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/marie-en-paco.jpeg" alt="Marie en Paco" className="header-photo" />
          <div className="header-brand-text">
            <Link href="/" className="header-brand">Blog</Link>
            <p className="header-tagline">Marie H. Boddaert</p>
          </div>
        </div>
        <SearchBar />
      </div>

      {/* Rij 2: navigatie gecentreerd */}
      <NavLinks />

    </header>
  )
}
