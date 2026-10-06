import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Cinzel, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';
import { SITE_URL, SCHOOL, BASE_KEYWORDS, schoolJsonLd, websiteJsonLd } from '@/lib/seo';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cinzel',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#00183F',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | St. Joseph International School, Narinda',
    default: 'St. Joseph International School, Narinda (SJIS Narinda) | Holy Cross School, Old Dhaka',
  },
  description: SCHOOL.description,
  applicationName: SCHOOL.name,
  keywords: BASE_KEYWORDS,
  authors: [{ name: SCHOOL.name, url: SITE_URL }],
  creator: SCHOOL.name,
  publisher: SCHOOL.name,
  category: 'education',
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: SCHOOL.name,
    description: SCHOOL.description,
    images: [SCHOOL.ogImage],
  },
  icons: {
    icon: [
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: SCHOOL.name,
    description: SCHOOL.description,
    url: SITE_URL,
    type: 'website',
    locale: 'en_BD',
    siteName: SCHOOL.name,
    images: [{ url: SCHOOL.ogImage, alt: `${SCHOOL.name} crest` }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${cinzel.variable} ${playfair.variable} font-sans`}>
      <body className="min-h-screen flex flex-col bg-[#00183F] text-slate-900 antialiased selection:bg-[#D4AF37] selection:text-[#00183F] w-full max-w-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([schoolJsonLd(), websiteJsonLd()]) }}
        />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
