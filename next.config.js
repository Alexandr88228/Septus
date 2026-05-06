/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_OUTPUT === 'export';

const nextConfig = {
  trailingSlash: true,
  ...(isStaticExport ? { output: 'export' } : {}),
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'react-icons'],
  },
  images: {
    unoptimized: isStaticExport,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [360, 640, 768, 1024, 1280, 1536],
    imageSizes: [96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/catalog-images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/for-site/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/logo.webp',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/Logo.jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
      },
      {
        source: '/admin/',
        destination: '/admin/index.html',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/admin/admin',
        destination: '/admin',
        permanent: false,
      },
      {
        source: '/admin/admin/',
        destination: '/admin',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
