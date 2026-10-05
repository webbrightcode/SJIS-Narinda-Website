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
    areaServed: ['Narinda', 'Old Dhaka', 'Dhaka'],
    parentOrganization: {
      '@type': 'Organization',
      name: 'Brothers of Holy Cross (Congregation of Holy Cross, CSC), Bangladesh',
    },
    knowsAbout: ['Cambridge Assessment International Education', 'Holy Cross education', 'STEM education'],
    ...(extra?.sameAs && extra.sameAs.length > 0 && { sameAs: extra.sameAs }),
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
