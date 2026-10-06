import type { Metadata } from 'next';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Photo Gallery - Narinda Campus',
  description:
    'Campus life, events, sports and celebrations at St. Joseph International School, Narinda, Dhaka.',
  path: '/gallery',
  keywords: ['SJIS Narinda gallery', 'Narinda campus photos'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Photo Gallery', path: '/gallery' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {children}
    </>
  );
}
