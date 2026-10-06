'use client';

import React, { useState } from 'react';
import { Camera, Expand } from 'lucide-react';
import { FadeImage as Image } from '@/components/ui/FadeImage';
import { Lightbox } from '@/components/ui/Lightbox';
import type { GalleryItem } from '@/lib/types';

interface NewsGalleryProps {
  photos: string[];
  title: string;
  category?: string;
  date?: string;
}

/** Editorial photo mosaic for an event story, with a full-screen lightbox. */
export function NewsGallery({ photos, title, category = 'Event', date }: NewsGalleryProps) {
  const [index, setIndex] = useState<number | null>(null);
  if (photos.length === 0) return null;

  const items: GalleryItem[] = photos.map((url, i) => ({
    id: i,
    title,
    category,
    category_display: category,
    media_type: 'image',
    image_url: url,
    caption: date || '',
    is_featured: false,
    order: i,
  }));

  const next = () => setIndex((i) => (i === null ? i : (i + 1) % items.length));
  const prev = () => setIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length));

  // Mosaic: every 5th tile (starting at 0) spans 2x2 for a magazine rhythm.
  const tileClass = (i: number) =>
    i % 5 === 0 ? 'col-span-2 row-span-2' : '';

  return (
    <section aria-label="Event photo gallery" className="mt-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="flex items-center gap-2.5 text-xl font-black text-[#00183F]">
          <span className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D4AF37]">
            <Camera className="w-4 h-4" />
          </span>
          Photo Gallery
        </h2>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          {photos.length} photo{photos.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 auto-rows-[140px] sm:auto-rows-[180px] gap-3 grid-flow-dense">
        {photos.map((url, i) => (
          <button
            key={`${url}-${i}`}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Open photo ${i + 1} of ${photos.length}`}
            className={`group relative overflow-hidden rounded-2xl bg-slate-100 cursor-zoom-in focus:outline-none focus-visible:ring-4 focus-visible:ring-[#D4AF37]/60 ${tileClass(i)}`}
          >
            <Image
              src={url}
              alt={`${title} — photo ${i + 1}`}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00183F]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 text-[#00183F] flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <Expand className="w-4 h-4" />
            </span>
          </button>
        ))}
      </div>

      <Lightbox
        items={items}
        currentIndex={index ?? 0}
        isOpen={index !== null}
        onClose={() => setIndex(null)}
        onPrev={prev}
        onNext={next}
      />
    </section>
  );
}
