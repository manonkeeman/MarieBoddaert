import Link from 'next/link'
import { FaInstagram, FaLinkedin, FaBlogger } from 'react-icons/fa'
import { SiSubstack } from 'react-icons/si'

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/bodhimari/',         icon: FaInstagram },
  { label: 'Substack',  href: '#',                                             icon: SiSubstack  },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/marieboddaert/',   icon: FaLinkedin  },
  { label: 'Blogger',   href: 'https://dewereldvanmarie.blogspot.com',         icon: FaBlogger   },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer" aria-label="Sitefooter">
      <div className="footer-inner">
        <div className="footer-col">
          <p className="footer-brand">Marie H. Boddaert</p>
          <p className="footer-tagline">Schrijft blogs, gedichten, kattenbellen en gevatte teksten. Op verzoek en aanvraag.</p>
          <address className="footer-address">
            <a href="mailto:mh.boddaert@gmail.com" className="footer-email">mh.boddaert@gmail.com</a>
          </address>
        </div>

        <nav className="footer-col" aria-label="Sitemap">
          <p className="footer-col-title">Navigatie</p>
          <Link href="/">Home</Link>
          <Link href="/verhalen">Verhalen</Link>
          <Link href="/gedichten">Gedichten</Link>
          <Link href="/kattenbellen">Kattenbellen</Link>
          <Link href="/over">Over mij</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="footer-col">
          <p className="footer-col-title">Socials</p>
          <div className="footer-socials-row">
            {socials.map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="footer-social" aria-label={label}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} Marie H. Boddaert &mdash; All rights reserved</p>
        <p>Made by <a href="https://manonit.com" target="_blank" rel="noopener noreferrer" className="footer-maker">Manonit.com</a></p>
      </div>
    </footer>
  )
}
