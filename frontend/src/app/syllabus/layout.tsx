import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Academic Syllabus & Curriculum Framework | St. Joseph International School Narinda',
  description:
    'Download official Cambridge International syllabuses, subject curriculum guides, term planning, and assessment outlines for Playgroup to A-Levels at St. Joseph International School Narinda.',
  keywords: [
    'SJIS Syllabus',
    'Cambridge Syllabus Dhaka',
    'Narinda Campus Curriculum',
    'Cambridge Primary Syllabus',
    'IGCSE Syllabus Dhaka',
    'A Level Syllabus Bangladesh',
    'St Joseph International School Academic Guide',
  ],
  openGraph: {
    title: 'Academic Syllabus & Curriculum Framework | SJIS Narinda',
    description:
      'Official Cambridge International syllabi and subject guidelines for St. Joseph International School, Narinda.',
    url: 'https://sjis-narinda.edu.bd/syllabus',
    siteName: 'St. Joseph International School',
    locale: 'en_US',
    type: 'website',
  },
};

export default function SyllabusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
