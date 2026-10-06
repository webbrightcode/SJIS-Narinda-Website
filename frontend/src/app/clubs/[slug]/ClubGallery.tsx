'use client';

import React, { useState } from 'react';
import { FadeImage as Image } from '@/components/ui/FadeImage';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ClubGalleryProps {
  clubName: string;
  images: string[];
}

export function ClubGallery({ clubName, images }: ClubGalleryProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <Camera className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-800 text-sm">Guild Photo Gallery</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Activity photos from upcoming guild workshops, inter-school tournaments, and exhibitions will be published here.
        </p>
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx((activeIdx - 1 + images.length) % images.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx((activeIdx + 1) % images.length);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00183F]/5 border border-[#00183F]/10 flex items-center justify-center text-[#00183F]">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-[#00183F] tracking-tight">Guild Photo Gallery</h3>
            <p className="text-xs text-slate-500">
              Workshops, competitive events, and collaborative student sessions
            </p>
          </div>
        </div>
        <span className="self-start sm:self-auto text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60">
          {images.length} {images.length === 1 ? 'Photograph' : 'Photographs'}
        </span>
      </div>

      {/* Grid of gallery images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/80 focus:outline-hidden focus:ring-2 focus:ring-[#00183F] cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            aria-label={`View photo ${idx + 1} of ${clubName}`}
          >
            <Image
              src={img}
              alt={`${clubName} photo ${idx + 1}`}
              fill
              fallbackSrc="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop"
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover group-hover:scale-108 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
              <span className="text-[11px] font-bold text-white tracking-wide">
                Photo {idx + 1}
              </span>
              <div className="w-7 h-7 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setActiveIdx(null)}
          role="dialog"
          aria-modal="true"
        >
          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-20">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-amber-400">
                {clubName}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-xs text-slate-300">
                {activeIdx + 1} of {images.length}
              </span>
            </div>
            <button
              onClick={() => setActiveIdx(null)}
              className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close photo viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Previous Button */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-20 border border-white/10 hover:scale-105 active:scale-95"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Image Container */}
          <div
            className="relative max-w-5xl w-full h-[75vh] max-h-[800px] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIdx]}
              alt={`${clubName} photo ${activeIdx + 1}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer z-20 border border-white/10 hover:scale-105 active:scale-95"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
