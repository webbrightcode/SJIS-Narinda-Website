import type { Metadata } from 'next';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'School News & Events - Narinda Campus',
  description:
    'Stories, photos and highlights from events and celebrations at St. Joseph International School, Narinda, Dhaka-1100.',
  path: '/news',
  keywords: ['SJIS Narinda news', 'school events Narinda', 'St. Joseph Narinda celebrations'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'News & Events', path: '/news' },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
