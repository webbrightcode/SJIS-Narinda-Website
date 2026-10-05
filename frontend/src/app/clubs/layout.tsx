import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Clubs & Co-Curricular Activities - Narinda Campus',
  description:
    'Explore debating, science, robotics, arts and sports clubs at St. Joseph International School, Narinda, Old Dhaka.',
  path: '/clubs',
  keywords: ['Narinda school clubs'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
