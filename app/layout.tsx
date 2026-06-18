import type { Metadata } from 'next'
import { Nunito, Playfair_Display, Pacifico } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const nunito   = Nunito({ subsets: ['latin'], variable: '--font-nunito' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const pacifico = Pacifico({ weight: '400', subsets: ['latin'], variable: '--font-pacifico' })

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://marieboddaert.nl'
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

const OG_TITLE       = 'Marie H. Boddaert — Verhalen, gedichten & kattenbellen'
const OG_DESCRIPTION = 'Marie H. Boddaert schrijft verhalen, gedichten en gevatte teksten vanuit Sliedrecht. Op verzoek en aanvraag.'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default:  OG_TITLE,
    template: '%s — Marie H. Boddaert',
  },
  description: OG_DESCRIPTION,
  keywords: ['blog', 'gedichten', 'schrijven', 'kattenbellen', 'verhalen', 'Marie H. Boddaert', 'Sliedrecht', 'content'],
  authors:  [{ name: 'Marie H. Boddaert', url: 'mailto:mh.boddaert@gmail.com' }],
  creator:  'Marie H. Boddaert',
  openGraph: {
    type:        'website',
    locale:      'nl_NL',
    siteName:    'Marie H. Boddaert',
    title:       OG_TITLE,
    description: OG_DESCRIPTION,
    url:         BASE,
  },
  twitter: {
    card:        'summary_large_image',
    title:       OG_TITLE,
    description: OG_DESCRIPTION,
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
      'https://substack.com/@marieboddaert',
    ],
    address: { '@type': 'PostalAddress', addressLocality: 'Sliedrecht', addressCountry: 'NL' },
    knowsAbout: ['Schrijven', 'Poëzie', 'Verhalen', 'Content'],
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
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}</Script>
          </>
        )}
      </body>
    </html>
  )
}
