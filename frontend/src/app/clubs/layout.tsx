import type { Metadata } from 'next';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Clubs & Co-Curricular Activities - Narinda Campus',
  description:
    'Explore debating, science, robotics, arts and sports clubs at St. Joseph International School, Narinda, Old Dhaka.',
  path: '/clubs',
  keywords: ['Narinda school clubs'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Student Clubs & Activities', path: '/clubs' },
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
