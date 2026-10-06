import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ArrowLeft, ChevronRight, Calendar, Clock, Newspaper } from 'lucide-react';
import { getNews, getNewsBySlug } from '@/lib/api';
import { formatNewsDate, readingTime } from '@/lib/news';
import { buildMetadata, SCHOOL, absoluteUrl, breadcrumbJsonLd } from '@/lib/seo';
import { FadeImage as Image } from '@/components/ui/FadeImage';
import { NewsGallery } from '@/components/news/NewsGallery';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsViews } from '@/components/news/NewsViews';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getNewsBySlug(slug);
  if (!story) return { title: 'Story Not Found', robots: { index: false, follow: false } };

  const plain = (story.summary || story.content).replace(/\s+/g, ' ').trim();
  return buildMetadata({
    title: story.title,
    description: plain.length > 155 ? `${plain.slice(0, 155).trim()}…` : plain,
    path: `/news/${story.slug}`,
    type: 'article',
    publishedTime: story.publish_date,
    keywords: ['SJIS Narinda news', story.category_display || story.category],
    image: story.image_url && !story.image_url.startsWith('data:') ? story.image_url : undefined,
  });
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [story, all] = await Promise.all([getNewsBySlug(slug), getNews('all', '', true)]);
  if (!story) notFound();

  const related = all.filter((n) => n.id !== story.id).slice(0, 3);
  const paragraphs = story.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const photos = (story.gallery_images || []).filter(Boolean);
  const abs = (u: string) => (u.startsWith('http') ? u : absoluteUrl(u));
  const images = [story.image_url, ...photos].filter((u): u is string => !!u && !u.startsWith('data:')).map(abs);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: story.title,
      datePublished: story.publish_date,
      dateModified: story.publish_date,
      mainEntityOfPage: absoluteUrl(`/news/${story.slug}`),
      author: { '@type': 'Organization', name: SCHOOL.name },
      publisher: { '@type': 'Organization', name: SCHOOL.name, logo: { '@type': 'ImageObject', url: SCHOOL.logo } },
      image: images.length ? images : [SCHOOL.ogImage],
    },
    breadcrumbJsonLd([
      { name: 'Home', path: '/' },
      { name: 'News & Events', path: '/news' },
      { name: story.title, path: `/news/${story.slug}` },
    ]),
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-none">
            <Link href="/" className="hover:text-[#00183F] font-semibold">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <Link href="/news" className="hover:text-[#00183F] font-semibold">News &amp; Events</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-slate-800 font-bold truncate max-w-xs sm:max-w-md">{story.title}</span>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#00183F] hover:text-white text-slate-700 font-bold transition-all shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All News
          </Link>
        </div>
      </div>

      <article>
        {/* Cinematic header */}
        <header className="relative bg-[#00183F] overflow-hidden">
          {story.image_url && (
            <>
              <Image
                src={story.image_url}
                alt={story.title}
                fill
                priority
                fade={false}
                sizes="100vw"
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00183F] via-[#00183F]/70 to-[#00183F]/20" />
            </>
          )}
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-36 sm:pb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-[#C8102E] text-white text-[11px] font-black uppercase tracking-widest shadow-lg">
              {story.category_display || story.category}
            </span>
            <h1 className="mt-5 text-3xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight text-balance">
              {story.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-slate-200 font-medium">
              <span className="inline-flex items-center gap-1.5 text-amber-300">
                <Calendar className="w-4 h-4" /> {formatNewsDate(story.publish_date)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> {readingTime(story.content)} min read
              </span>
              <NewsViews id={story.id} initial={story.views_count || 0} />
            </div>
          </div>
          <div className="h-1.5 bg-gradient-to-r from-[#00183F] via-[#D4AF37] to-[#C8102E]" />
        </header>

        {/* Story body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          {story.summary && (
            <p className="text-xl sm:text-2xl text-[#00183F] font-semibold leading-relaxed border-l-4 border-[#D4AF37] pl-5">
              {story.summary}
            </p>
          )}
          <div className="mt-8 space-y-6 text-base sm:text-lg text-slate-700 leading-[1.85]">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'first-letter:float-left first-letter:text-6xl first-letter:font-black first-letter:text-[#C8102E] first-letter:mr-3 first-letter:leading-[0.9] whitespace-pre-line'
                    : 'whitespace-pre-line'
                }
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Photos */}
        {photos.length > 0 && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <NewsGallery
              photos={photos}
              title={story.title}
              category={story.category_display || 'News'}
              date={formatNewsDate(story.publish_date)}
            />
          </div>
        )}
      </article>

      {/* Related news (News only — never notices) */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="flex items-center gap-3 text-2xl sm:text-3xl font-black text-[#00183F]">
              <span className="w-10 h-10 rounded-xl bg-[#00183F] text-[#D4AF37] flex items-center justify-center">
                <Newspaper className="w-5 h-5" />
              </span>
              More Stories
            </h2>
            <Link href="/news" className="text-sm font-bold text-[#C8102E] hover:underline">
              View all news
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {related.map((n) => (
              <NewsCard key={n.id} item={n} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
