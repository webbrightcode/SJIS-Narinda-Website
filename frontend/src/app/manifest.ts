import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'St. Joseph International School, Narinda',
    short_name: 'SJIS Narinda',
    description: 'Official website of St. Joseph International School, Narinda, Dhaka.',
    start_url: '/',
    display: 'standalone',
    background_color: '#00183F',
    theme_color: '#00183F',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
