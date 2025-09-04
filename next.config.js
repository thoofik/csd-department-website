/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    unoptimized: false,
  },
  // Ensure static assets are properly served
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  // Enable image optimization
  // experimental: {
  //   optimizeCss: true,
  // },
}

module.exports = nextConfig
