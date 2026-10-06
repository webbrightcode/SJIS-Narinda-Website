'use client';

import React, { useState, useEffect } from 'react';
import { FadeImage as Image } from '@/components/ui/FadeImage';
import { Eye, Camera, Filter, Sparkles, Calendar } from 'lucide-react';
import { GalleryItem } from '@/lib/types';
import { getGallery } from '@/lib/api';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Lightbox } from '@/components/ui/Lightbox';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getGallery();
      setItems(data);
    }
    loadData();
  }, []);

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
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <section className="relative py-20 bg-[#00183F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="gold">Visual Chronicles</Badge>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-white">
            Photo & Media Gallery
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Capturing the spirit of St. Joseph Narinda: our historic grounds, dynamic labs, championship triumphs, and vibrant festivities.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-slate-900 border border-slate-200/80"
              >
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  fallbackSrc="https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1200&auto=format&fit=crop"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-75 group-hover:opacity-95 transition-opacity" />

                {/* Top Category Badge */}
                {item.category ? (
                  <div className="absolute top-4 left-4">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md">
                      {item.category_display || item.category}
                    </span>
                  </div>
                ) : null}

                {/* Hover Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="p-3.5 rounded-full bg-[#D4AF37] text-[#00183F] shadow-xl transform group-hover:scale-110 transition-transform">
                    <Eye className="w-6 h-6" />
                  </div>
                </div>

                {/* Bottom Title & Caption */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-base font-bold group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-xs text-slate-300 line-clamp-1 mt-1">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700">No media found in the gallery</h3>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Viewer */}
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
    </div>
  );
}
