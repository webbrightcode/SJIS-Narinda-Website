import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Faculty & Staff - Narinda Campus',
  description:
    'Meet the dedicated administrators, teachers and staff of St. Joseph International School, Narinda, Dhaka.',
  path: '/faculty',
  keywords: ['SJIS Narinda teachers', 'Narinda school faculty'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
