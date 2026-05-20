/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  compress: true,
  poweredByHeader: false,
  trailingSlash: true,
}

module.exports = nextConfig
