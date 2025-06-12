/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Désactiver ESLint pendant le build pour le déploiement
    ignoreDuringBuilds: true,
  },
  images: {
    domains: (process.env.NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS || 'marketplace-greentech.onrender.com,localhost,127.0.0.1').split(','),
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'marketplace-greentech.onrender.com',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '*.onrender.com',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
  // Configuration pour le déploiement
  output: 'standalone',
  // Configuration des headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;