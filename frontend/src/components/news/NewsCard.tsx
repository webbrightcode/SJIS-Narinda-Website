import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowUpRight, Camera, Newspaper, Clock } from 'lucide-react';
import { FadeImage as Image } from '@/components/ui/FadeImage';
import type { News } from '@/lib/types';
import { formatNewsDate, getTeaser, readingTime, newsHref } from '@/lib/news';

interface NewsCardProps {
  item: News;
  variant?: 'featured' | 'standard';
  priority?: boolean;
}

function Cover({ item, sizes, priority }: { item: News; sizes: string; priority?: boolean }) {
  if (!item.image_url) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#00183F] via-[#0a2a5e] to-[#C8102E]/80 flex items-center justify-center">
        <Newspaper className="w-14 h-14 text-white/25" />
      </div>
    );
  }
  return (
    <Image
      src={item.image_url}
      alt={item.title}
      fill
      sizes={sizes}
      priority={priority}
      fade={!priority}
      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
    />
  );
}

export function NewsCard({ item, variant = 'standard', priority }: NewsCardProps) {
  const photoCount = (item.gallery_images?.length || 0) + (item.image_url ? 1 : 0);
  const href = newsHref(item);

  if (variant === 'featured') {
    return (
      <Link
        href={href}
        className="group relative block overflow-hidden rounded-[2rem] min-h-[420px] sm:min-h-[520px] shadow-xl shadow-slate-900/10 isolate"
      >
        <Cover item={item} sizes="(min-width: 1280px) 1200px, 100vw" priority={priority} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00183F] via-[#00183F]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#00183F]/60 to-transparent" />

        <div className="absolute top-5 left-5 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#C8102E] text-white text-[11px] font-black uppercase tracking-widest shadow-lg">
            Featured Story
          </span>
          <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
            {item.category_display || item.category}
          </span>
        </div>

        {photoCount > 1 && (
          <span className="absolute top-5 right-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-bold">
            <Camera className="w-3.5 h-3.5" /> {photoCount} photos
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-12 max-w-4xl">
          <div className="flex items-center gap-4 text-xs text-amber-300 font-semibold mb-3">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {formatNewsDate(item.publish_date)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5" /> {readingTime(item.content)} min read
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight text-balance">
            {item.title}
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-200/90 leading-relaxed line-clamp-3 max-w-2xl">
            {getTeaser(item, 220)}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#00183F] text-sm font-bold group-hover:bg-[#D4AF37] transition-colors">
            Read the full story
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-2xl hover:shadow-[#00183F]/10 hover:-translate-y-1.5 transition-all duration-500"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <Cover item={item} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70" />
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[#00183F] text-[10px] font-black uppercase tracking-widest shadow">
          {item.category_display || item.category}
        </span>
        {photoCount > 1 && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur text-white text-[11px] font-bold">
            <Camera className="w-3 h-3" /> {photoCount}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-semibold">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C8102E]" /> {formatNewsDate(item.publish_date, 'short')}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span>{readingTime(item.content)} min read</span>
        </div>
        <h3 className="mt-3 text-lg font-extrabold text-[#00183F] leading-snug line-clamp-2 group-hover:text-[#C8102E] transition-colors">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">{getTeaser(item, 160)}</p>
        <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#00183F] group-hover:text-[#C8102E] transition-colors">
          Read story
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
