import type { Metadata } from 'next'
import Image from 'next/image'
import { FaInstagram, FaLinkedin, FaBlogger } from 'react-icons/fa'
import { SiSubstack } from 'react-icons/si'

export const metadata: Metadata = {
  title: 'Over mij',
  description: 'Marie H. Boddaert schrijft blogs, gedichten, kattenbellen en gevatte teksten. Psychologe uit Leiden, moeder van drie, eigenaar van Paco.',
}

const socials = [
  { label: 'Substack',  href: '#',                                           icon: SiSubstack  },
  { label: 'Instagram', href: 'https://www.instagram.com/bodhimari/',        icon: FaInstagram },
  { label: 'Blogger',   href: 'https://dewereldvanmarie.blogspot.com',        icon: FaBlogger   },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/marieboddaert/',  icon: FaLinkedin  },
]

const services = [
  { label: 'Blogs',                  color: '#FAD5DA' },
  { label: 'Gedichten',              color: '#BEE9E9' },
  { label: 'Kattenbellen',           color: '#E2D4F0' },
  { label: 'Gevatte teksten',        color: '#FAE5CE' },
  { label: 'Bevredigende content',   color: '#C8EAD8' },
]

export default function Over() {
  return (
    <>
      <div className="post-banner" style={{ backgroundColor: '#FAD5DA' }}>
        <div className="post-banner-inner">
          <p className="post-category">Over mij</p>
          <h1 className="post-title">Marie H. Boddaert schrijft.</h1>
        </div>
      </div>

      <div className="over-page">
        <Image
          src="/marie.png"
          alt="Marie H. Boddaert"
          width={130}
          height={130}
          className="over-photo"
          priority
        />

        <div className="over-content">

          <div className="over-block">
            <p>Marie houdt van iedereen.</p>
            <p>Zij heeft een diepe interesse voor verschillende culturen, mensen en karakters.</p>
            <p>Zij studeerde psychologie in Leiden en deze combinatie inspireert haar verhalen.</p>
          </div>

          <div className="over-block">
            <p>Marie heeft een hond.</p>
            <p>Paco is een van de hoofdpersonen in haar verhalen.</p>
          </div>

          <div className="over-block">
            <p>Marie heeft ook nog een man.</p>
            <p>Haar liefde doet zijn best om haar chaos samen te leven.</p>
            <p>Zij hebben namelijk ook nog 3 kinderen, die het leven nog interessanter maken.</p>
          </div>

          <div className="over-block">
            <p>Zij woont in een Huis met een verhaal.</p>
            <p>Tot interessante overdenkingen.</p>
          </div>

          <div className="over-block">
            <p>Marie houdt van het geluid van de melkopschuimer.</p>
            <p>Zij krijgt hiervan een glimlach op haar dag.</p>
          </div>

          <blockquote className="over-poetic">
            Marie heeft een berg van dichtbij te bekijken,<br />
            en geprobeerd de piste te koppen.<br />
            Nu loopt ze al maanden rond als Jack Sparrow op de kade —<br />
            maar er is geen schip te commanderen,<br />
            geen schatten te vinden,<br />
            hopelijk alleen weer haarzelf.
          </blockquote>

          <p className="over-slogan">Gelukkig kan ze nog wel schrijven.</p>

          {/* Services */}
          <div className="over-services-section">
            <p className="over-services-label">Wat schrijft Marie?</p>
            <div className="over-service-tags">
              {services.map(s => (
                <span
                  key={s.label}
                  className="over-service-tag"
                  style={{ backgroundColor: s.color }}
                >
                  {s.label}
                </span>
              ))}
            </div>
            <p className="over-aanvraag">Op verzoek en aanvraag.</p>

            <a href="#" target="_blank" rel="noopener noreferrer" className="btn btn-dark over-newsletter-btn">
              Abonneer op de nieuwsbrief →
            </a>
          </div>

          {/* Socials */}
          <div className="over-socials">
            <p className="over-socials-label">Volg Marie</p>
            <div className="over-socials-links">
              {socials.map(({ label, href, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="over-social-pill" aria-label={label}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
