import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Admission 2026-2027 - Narinda Campus',
  description:
    'Apply to St. Joseph International School, Narinda: admission process, eligibility, fees, deadlines and online inquiry for Playgroup to Grade XI at our Old Dhaka campus.',
  path: '/admission',
  keywords: ['SJIS Narinda admission', 'admission St Joseph Narinda', 'school fees Narinda'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
