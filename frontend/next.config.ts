import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const backend = (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api')
      .replace(/\/api\/?$/, '');
    if (!/^https?:\/\//.test(backend)) return [];
    return [{ source: '/media/:path*', destination: `${backend}/media/:path*` }];
  },
  images: {
    unoptimized: true,
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'narinda.sjis.edu.bd',
      },
      {
        protocol: 'http',
        hostname: 'narinda.sjis.edu.bd',
      },
      {
        protocol: 'https',
        hostname: 'www.narinda.sjis.edu.bd',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
