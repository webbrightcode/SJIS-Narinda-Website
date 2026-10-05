import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Notices & Circulars - Narinda Campus',
  description:
    'Official notices, circulars, exam schedules, holidays and announcements from St. Joseph International School, Narinda, Dhaka-1100.',
  path: '/notices',
  keywords: ['SJIS Narinda notices', 'school circular Narinda'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
