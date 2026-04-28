/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  ...(process.env.NEXT_OUTPUT === 'export' ? { output: 'export' } : {}),
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'react-icons'],
  },
  images: {
    unoptimized: true,
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
      {
        source: '/admin/admin',
        destination: '/admin/index.html',
      },
      {
        source: '/admin/admin/',
        destination: '/admin/index.html',
      },
    ];
  },
};

module.exports = nextConfig;
