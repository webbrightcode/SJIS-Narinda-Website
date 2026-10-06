import type { Metadata } from 'next';

/**
 * Central SEO configuration for St. Joseph International School, Narinda.
 *
 * DISAMBIGUATION: Another "St. Joseph International School" exists (Uttara / other
 * campuses). Every title, description, structured-data entity and keyword here
 * deliberately includes "Narinda" / "Old Dhaka" / "Holy Cross" so search engines
 * attribute this site to the Narinda campus only.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://narinda.sjis.edu.bd').replace(/\/$/, '');

export const SCHOOL = {
  name: 'St. Joseph International School, Narinda',
  shortName: 'SJIS Narinda',
  alternateNames: ['SJIS Narinda', 'St. Joseph School Narinda', 'St Joseph International School Narinda Dhaka'],
  legalDescriptor: 'A school run by the Brothers of Holy Cross (CSC) at 32 Shah Shaheb Lane, Narinda, Old Dhaka',
  description:
    'Official website of St. Joseph International School, Narinda (SJIS Narinda), 32 Shah Shaheb Lane, Dhaka-1100 — run by the Brothers of Holy Cross in Old Dhaka. Admissions, notices, faculty and campus life.',
  street: '32 Shah Shaheb Lane',
  locality: 'Narinda, Dhaka',
  region: 'Dhaka',
  postalCode: '1100',
  country: 'BD',
  phone: '+880 1746-866393',
  email: 'sjisnarinda2021@gmail.com',
  logo: `${SITE_URL}/icon-512.png`,
  ogImage: `${SITE_URL}/sjis-crest-logo.png`,
};

export const BASE_KEYWORDS = [
  'St. Joseph International School Narinda',
  'SJIS Narinda',
  'St Joseph School Narinda Dhaka',
  'St. Joseph International School Old Dhaka',
  'Holy Cross school Narinda',
  'English medium school Narinda',
  'Cambridge school Old Dhaka',
  'Narinda Dhaka-1100 school',
  'Admission 2026-2027 Narinda',
];

export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

/** Builds consistent per-page metadata (canonical, OG, Twitter, robots). */
export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  image,
  noIndex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const img = image || SCHOOL.ogImage;
  const fullTitle = `${title} | ${SCHOOL.name}`;

  return {
    title,
    description,
    keywords: [...keywords, ...BASE_KEYWORDS],
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SCHOOL.name,
      locale: 'en_BD',
      type,
      images: [{ url: img, alt: `${SCHOOL.name} crest` }],
      ...(type === 'article' && { publishedTime, modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [img],
    },
  };
}

/** Schema.org JSON-LD for the school (EducationalOrganization + School). */
export function schoolJsonLd(extra?: { sameAs?: string[]; address?: string }) {
  const sameAsList = Array.from(
    new Set([
      'https://www.facebook.com/sjis.narinda',
      ...(extra?.sameAs || []),
    ])
  );

  return {
    '@context': 'https://schema.org',
    '@type': ['EducationalOrganization', 'School'],
    '@id': `${SITE_URL}/#school`,
    name: SCHOOL.name,
    alternateName: SCHOOL.alternateNames,
    description: SCHOOL.description,
    disambiguatingDescription: SCHOOL.legalDescriptor,
    url: SITE_URL,
    logo: SCHOOL.logo,
    image: SCHOOL.ogImage,
    telephone: SCHOOL.phone,
    email: SCHOOL.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SCHOOL.street,
      addressLocality: SCHOOL.locality,
      addressRegion: SCHOOL.region,
      postalCode: SCHOOL.postalCode,
      addressCountry: SCHOOL.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 23.7145,
      longitude: 90.4184,
    },
    areaServed: ['Narinda', 'Old Dhaka', 'Dhaka'],
    parentOrganization: {
      '@type': 'Organization',
      name: 'Brothers of Holy Cross (Congregation of Holy Cross, CSC), Bangladesh',
    },
    knowsAbout: ['Cambridge Assessment International Education', 'Holy Cross education', 'STEM education'],
    sameAs: sameAsList,
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SCHOOL.name,
    alternateName: SCHOOL.shortName,
    inLanguage: 'en',
    publisher: { '@id': `${SITE_URL}/#school` },
  };
}

/** Informs search engines of key navigational pages to prioritize as sitelinks. */
export function siteNavigationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SiteNavigationElement',
        name: 'Admissions & Fees',
        description: 'Admission requirements, eligibility, fee structure, and online inquiry form.',
        url: absoluteUrl('/admission'),
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'About Our Heritage',
        description: 'History, leadership, and Holy Cross educational philosophy in Old Dhaka.',
        url: absoluteUrl('/about'),
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Faculty & Administration',
        description: 'Meet our dedicated teachers, academic coordinators, and administrative leaders.',
        url: absoluteUrl('/faculty'),
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Notice Board',
        description: 'Official school circulars, exam schedules, and holiday announcements.',
        url: absoluteUrl('/notices'),
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Student Clubs & Activities',
        description: 'Debate, science, arts, robotics, and athletic clubs at Narinda campus.',
        url: absoluteUrl('/clubs'),
      },
      {
        '@type': 'SiteNavigationElement',
        name: 'Photo Gallery',
        description: 'Photographs of campus life, academic milestones, and student activities.',
        url: absoluteUrl('/gallery'),
      },
    ],
  };
}

/** Standard FAQ Schema for Google Rich Snippets on Admission. */
export function admissionFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What curriculum does St. Joseph International School, Narinda offer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SJIS Narinda offers the prestigious Cambridge Assessment International Education curriculum from Playgroup to O-Levels and A-Levels, supported by the timeless Holy Cross values of discipline and academic excellence.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is the SJIS Narinda campus located in Dhaka?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The campus is located at 32 Shah Shaheb Lane, Narinda, Dhaka-1100 in Old Dhaka, easily accessible to students from Old Dhaka, Wari, Gandaria, Sutrapur, and surrounding areas.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can parents submit an admission inquiry?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Parents can fill out the online admission inquiry form at https://narinda.sjis.edu.bd/admission or visit the admissions office at the campus from Sunday to Thursday during working hours.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which classes are open for admission at SJIS Narinda?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Admissions are open for Playgroup, Nursery, Kindergarten, Primary Grades (1-5), Junior Section (Grades 6-8), and Cambridge Secondary (IGCSE / O Levels and A Levels).',
        },
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}
