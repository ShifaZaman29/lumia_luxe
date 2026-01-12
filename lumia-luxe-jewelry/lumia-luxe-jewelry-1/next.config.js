/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Your Railway backend
      {
        protocol: 'https',
        hostname: 'lumialuxe-production-19d4.up.railway.app',
        pathname: '/**',
      },
      // Existing domains
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/**',
      },
      // NEW: Add ALL domains from your image URLs
      {
        protocol: 'https',
        hostname: 'img.drz.lazcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.franklymydearstore.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'timelesssparkling.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.kwcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'robinsonsjewelers.com',
        pathname: '/**',
      },
      // Wildcard for any other domains
      {
        protocol: 'https',
        hostname: '**', // This allows ALL HTTPS domains (use cautiously)
        pathname: '/**',
      }
    ],
    // If you're still having issues, add this:
    unoptimized: true, // Disables Next.js image optimization (images load faster)
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig