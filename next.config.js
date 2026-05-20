/** @type {import('next').NextConfig} */

const publicHeaders = [
  { key: 'X-DNS-Prefetch-Control',  value: 'on' },
  { key: 'X-Frame-Options',         value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options',  value: 'nosniff' },
  { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://cdn.sanity.io",
      "connect-src 'self' https://*.sanity.io https://api.sanity.io",
      "frame-ancestors 'none'",
      "form-action 'self' mailto:",
      "base-uri 'self'",
    ].join('; '),
  },
]

const studioHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sanity.io",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.sanity.io",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io",
      "connect-src 'self' https://*.sanity.io https://api.sanity.io wss://*.sanity.io",
      "worker-src blob:",
      "frame-src 'self' https://*.sanity.io",
    ].join('; '),
  },
]

const nextConfig = {
  async headers() {
    return [
      { source: '/studio/:path*',       headers: studioHeaders },
      { source: '/((?!studio).*)',       headers: publicHeaders },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'cdn.sanity.io' }],
  },
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
