import type { Metadata } from 'next'
import { FaInstagram, FaLinkedin, FaBlogger } from 'react-icons/fa'
import { SiSubstack } from 'react-icons/si'
import { createSupabaseAdminClient } from '@/lib/supabase-server'
import ProfilePhoto from '@/components/ProfilePhoto'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Over mij',
  description: 'Marie H. Boddaert schrijft blogs, gedichten, kattenbellen en gevatte teksten. Geïnspireerd door mensen, culturen en karakters. Op verzoek en aanvraag.',
}

const DEFAULTS = {
  tagline:   'Marie H. Boddaert schrijft.',
  services:  ['Blogs', 'Gedichten', 'Kattenbellen', 'Gevatte teksten', 'Bevredigende content'],
  slogan:    'Gelukkig kan ze nog wel schrijven.',
  instagram: 'https://www.instagram.com/bodhimari/',
  linkedin:  'https://www.linkedin.com/in/marieboddaert/',
  blogger:   'https://dewereldvanmarie.blogspot.com',
  substack:  'https://substack.com/@marieboddaert',
}

export default async function Over() {
  let cms: any = null
  try {
    const supabase = createSupabaseAdminClient()
    const { data } = await supabase
      .from('about')
      .select('*')
      .eq('id', 'about-page')
      .single()
    cms = data
  } catch {}

  const photoUrl  = cms?.photo_url ?? null
  const services  = cms?.services?.length ? cms.services : DEFAULTS.services
  const slogan    = cms?.slogan    ?? DEFAULTS.slogan
  const socials   = {
    instagram: cms?.instagram || DEFAULTS.instagram,
    linkedin:  cms?.linkedin  || DEFAULTS.linkedin,
    blogger:   cms?.blogger   || DEFAULTS.blogger,
    substack:  cms?.substack  || DEFAULTS.substack,
  }

  const socialLinks = [
    { label: 'Substack',  href: socials.substack,  icon: SiSubstack  },
    { label: 'Instagram', href: socials.instagram, icon: FaInstagram },
    { label: 'Blogger',   href: socials.blogger,   icon: FaBlogger   },
    { label: 'LinkedIn',  href: socials.linkedin,  icon: FaLinkedin  },
  ]

  const hasBio = Boolean(cms?.bio?.trim())

  return (
    <>
      <div className="post-banner" style={{ backgroundColor: '#FAD5DA' }}>
        <div className="post-banner-inner">
          <p className="post-category">Over mij</p>
          <h1 className="post-title">{cms?.tagline ?? DEFAULTS.tagline}</h1>
        </div>
      </div>

      <div className="over-page">
        <ProfilePhoto photoUrl={photoUrl} />

        <div className="over-content">
          {hasBio ? (
            <div className="over-block" dangerouslySetInnerHTML={{ __html: cms.bio }} />
          ) : (
            <>
              <div className="over-block">
                <p>Marie houdt van iedereen.</p>
                <p>Zij heeft een diepe interesse voor verschillende culturen, mensen en karakters.</p>
                <p>Zij woont in Sliedrecht en deze omgeving inspireert haar verhalen.</p>
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
            </>
          )}

          <p className="over-slogan">{slogan}</p>

          <div className="over-services-section">
            <p className="over-services-label">Wat schrijft Marie?</p>
            <div className="over-service-tags">
              {services.map((s: string, i: number) => {
                const colors = ['#FAD5DA','#BEE9E9','#E2D4F0','#FAE5CE','#C8EAD8']
                return (
                  <span key={s} className="over-service-tag" style={{ backgroundColor: colors[i % colors.length] }}>
                    {s}
                  </span>
                )
              })}
            </div>
            <p className="over-aanvraag">Op verzoek en aanvraag.</p>
            <a href={socials.substack} target="_blank" rel="noopener noreferrer" className="btn btn-dark over-newsletter-btn">
              Lees op Substack →
            </a>
          </div>

          <div className="over-socials">
            <p className="over-socials-label">Volg Marie</p>
            <div className="over-socials-links">
              {socialLinks.map(({ label, href, icon: Icon }) => (
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
