import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Cinzel, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/AppShell';

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

export const metadata: Metadata = {
  title: {
    template: '%s | St. Joseph International School, Narinda',
    default: 'St. Joseph International School, Narinda | Excellence in Education',
  },
  description:
    'Official website of St. Joseph International School (SJIS), Narinda, Dhaka. A premier Holy Cross institution offering Cambridge Assessment International Education (CAIE) with rich co-curriculars, moral integrity, and modern STEM facilities.',
  keywords: [
    'St. Joseph International School',
    'SJIS Narinda',
    'St Joseph School Dhaka',
    'English Medium School Old Dhaka',
    'Cambridge School Narinda',
    'Holy Cross School Bangladesh',
    'Admission 2026-2027',
  ],
  authors: [{ name: 'St. Joseph International School, Narinda' }],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/sjis-crest-logo.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'St. Joseph International School, Narinda',
    description: 'Premier Holy Cross institution offering Cambridge curriculum with intellectual rigor and moral leadership in Old Dhaka.',
    type: 'website',
    locale: 'en_US',
    siteName: 'St. Joseph International School, Narinda',
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
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
