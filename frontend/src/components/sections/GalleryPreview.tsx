'use client';

import React, { useState } from 'react';
import { FadeImage as Image } from '@/components/ui/FadeImage';
import { Eye, ArrowRight, Camera, Sparkles } from 'lucide-react';
import { GalleryItem } from '@/lib/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Lightbox } from '@/components/ui/Lightbox';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface GalleryPreviewProps {
  items: GalleryItem[];
}

export const GalleryPreview: React.FC<GalleryPreviewProps> = ({ items }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextItem = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => ((prev ?? 0) + 1) % items.length);
    }
  };
  const prevItem = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => ((prev ?? 0) - 1 + items.length) % items.length);
    }
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up" distance={24} duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="mb-2">
                <Badge variant="gold">Life at SJIS</Badge>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#00183F] tracking-tight">
                Campus Life & Moments
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                A visual glimpse into our vibrant classrooms, labs, historic quadrangle, and sports fields.
              </p>
            </div>

            <Button
              href="/gallery"
              variant="outline"
              size="sm"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Visit Full Gallery
            </Button>
          </div>
        </ScrollReveal>

        {/* Gallery Masonry-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map((item, index) => (
            <ScrollReveal
              key={item.id}
              direction="zoom"
              distance={15}
              delay={index * 60}
              duration={500}
            >
              <div
                onClick={() => openLightbox(index)}
                className="relative h-72 rounded-2xl overflow-hidden shadow-sm group cursor-pointer border border-slate-100 bg-slate-100"
              >
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Top tag */}
                <div className="absolute top-4 left-4">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md">
                    {item.category_display || item.category}
                  </span>
                </div>

                {/* Hover center icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="p-3.5 rounded-full bg-[#D4AF37] text-[#00183F] shadow-lg transform group-hover:scale-110 transition-transform">
                    <Eye className="w-6 h-6" />
                  </div>
                </div>

                {/* Bottom Caption */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-base font-bold line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={closeLightbox}
          onPrev={prevItem}
          onNext={nextItem}
        />
      )}
    </section>
  );
};
