import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
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
