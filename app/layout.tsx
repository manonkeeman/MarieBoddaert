import type { Metadata } from 'next'
import { Nunito, Playfair_Display, Pacifico } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const nunito   = Nunito({ subsets: ['latin'], variable: '--font-nunito' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const pacifico = Pacifico({ weight: '400', subsets: ['latin'], variable: '--font-pacifico' })

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://marieboddaert.nl'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default:  'Marie H. Boddaert',
    template: '%s — Marie H. Boddaert',
  },
  description:
    'Marie H. Boddaert schrijft blogs, gedichten, kattenbellen en gevatte teksten. Psychologe uit Leiden met een diepe interesse voor mensen, culturen en karakters.',
  keywords: ['blog', 'gedichten', 'schrijven', 'kattenbellen', 'psychologie', 'Marie H. Boddaert', 'Leiden', 'content'],
  authors:  [{ name: 'Marie H. Boddaert', url: 'mailto:mh.boddaert@gmail.com' }],
  creator:  'Marie H. Boddaert',
  openGraph: {
    type:        'website',
    locale:      'nl_NL',
    siteName:    'Marie H. Boddaert',
    title:       'Marie H. Boddaert',
    description: 'Blogs, gedichten, kattenbellen en gevatte teksten. Op verzoek en aanvraag.',
    url:         BASE,
    images: [{
      url:    '/marie.png',
      width:  400,
      height: 400,
      alt:    'Marie H. Boddaert',
    }],
  },
  twitter: {
    card:        'summary',
    title:       'Marie H. Boddaert',
    description: 'Blogs, gedichten, kattenbellen en gevatte teksten.',
    images:      ['/marie.png'],
  },
  robots: {
    index:               true,
    follow:              true,
    googleBot: {
      index:             true,
      follow:            true,
      'max-image-preview': 'large',
      'max-snippet':     -1,
    },
  },
  alternates: {
    canonical: BASE,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type':    'Blog',
  name:        'Marie H. Boddaert',
  description: 'Marie H. Boddaert schrijft blogs, gedichten, kattenbellen en gevatte teksten. Op verzoek en aanvraag.',
  url:         BASE,
  author: {
    '@type':   'Person',
    name:      'Marie H. Boddaert',
    email:     'mh.boddaert@gmail.com',
    url:       `${BASE}/over`,
    sameAs: [
      'https://www.linkedin.com/in/marieboddaert/',
      'https://www.instagram.com/bodhimari/',
      'https://dewereldvanmarie.blogspot.com',
    ],
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Universiteit Leiden' },
    knowsAbout: ['Psychologie', 'Schrijven', 'Poëzie', 'Content'],
  },
  inLanguage: 'nl-NL',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${nunito.variable} ${playfair.variable} ${pacifico.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
