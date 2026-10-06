import type { Metadata } from 'next';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Faculty & Staff - Narinda Campus',
  description:
    'Meet the dedicated administrators, teachers and staff of St. Joseph International School, Narinda, Dhaka.',
  path: '/faculty',
  keywords: ['SJIS Narinda teachers', 'Narinda school faculty'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Faculty & Staff', path: '/faculty' },
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
