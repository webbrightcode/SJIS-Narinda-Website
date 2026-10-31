'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FadeImage as Image } from '@/components/ui/FadeImage';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Grid,
  Calendar,
  Layers,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import { GalleryItem } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';

interface AlbumModalProps {
  album: GalleryItem | null;
  isOpen: boolean;
  onClose: () => void;
  initialPhotoIndex?: number | null;
}

export function AlbumModal({
  album,
  isOpen,
  onClose,
  initialPhotoIndex = null,
}: AlbumModalProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(initialPhotoIndex);

  // Sync initial index if provided
  useEffect(() => {
    setActiveIdx(initialPhotoIndex);
  }, [initialPhotoIndex, album]);

  // Extract all photos in this album (cover image + extra gallery images)
  const allPhotos = useMemo(() => {
    if (!album) return [];
    const list = [album.image_url, ...(album.gallery_images || [])];
    return Array.from(new Set(list.map((u) => (u || '').trim()).filter(Boolean)));
  }, [album]);

  const handlePrev = useCallback(() => {
    if (activeIdx !== null && allPhotos.length > 0) {
      setActiveIdx((prev) => ((prev ?? 0) - 1 + allPhotos.length) % allPhotos.length);
    }
  }, [activeIdx, allPhotos.length]);

  const handleNext = useCallback(() => {
    if (activeIdx !== null && allPhotos.length > 0) {
      setActiveIdx((prev) => ((prev ?? 0) + 1) % allPhotos.length);
    }
  }, [activeIdx, allPhotos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeIdx !== null) {
          // If in lightbox, return to album grid overview
          setActiveIdx(null);
        } else {
          onClose();
        }
      } else if (activeIdx !== null) {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeIdx, onClose, handlePrev, handleNext]);

  if (!isOpen || !album) return null;

  const currentPhotoUrl = activeIdx !== null ? allPhotos[activeIdx] : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dark backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* LIGHTBOX FULLSCREEN OVERLAY (when a photo is actively selected) */}
      {activeIdx !== null && currentPhotoUrl && (
        <div
          className="fixed inset-0 z-60 flex flex-col justify-between bg-black/95 text-white animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-b from-black/80 to-transparent z-20">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveIdx(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors cursor-pointer"
                title="Back to album grid"
              >
                <Grid className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Album Grid</span>
              </button>

              <div className="border-l border-white/20 pl-3">
                <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                  {album.category_display || album.category || 'School Chronicle'}
                </span>
                <h4 className="text-sm sm:text-base font-black text-white truncate max-w-[200px] sm:max-w-md">
                  {album.title}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-slate-300">
                {activeIdx + 1} / {allPhotos.length}
              </span>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Photo Center Container */}
          <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8">
            {/* Prev button */}
            {allPhotos.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-6 z-20 p-3 sm:p-3.5 rounded-full bg-black/50 hover:bg-[#00183F] border border-white/10 text-white transition-all transform hover:scale-105 cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Photo View */}
            <div className="relative w-full max-w-5xl h-[60vh] sm:h-[70vh] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
              <Image
                src={currentPhotoUrl}
                alt={`${album.title} photo ${activeIdx + 1}`}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-contain"
                fallbackSrc="https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1200&auto=format&fit=crop"
              />
            </div>

            {/* Next button */}
            {allPhotos.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-6 z-20 p-3 sm:p-3.5 rounded-full bg-black/50 hover:bg-[#00183F] border border-white/10 text-white transition-all transform hover:scale-105 cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Filmstrip Carousel */}
          <div className="bg-black/80 border-t border-white/10 px-4 py-3 sm:py-4 z-20">
            {album.caption && (
              <p className="text-center text-xs text-slate-300 max-w-2xl mx-auto mb-3 line-clamp-2">
                {album.caption}
              </p>
            )}

            {allPhotos.length > 1 && (
              <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-3xl mx-auto pb-1 scrollbar-thin scrollbar-thumb-white/20">
                {allPhotos.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveIdx(idx)}
                    className={`relative w-14 h-11 sm:w-16 sm:h-12 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      activeIdx === idx
                        ? 'border-[#D4AF37] scale-105 shadow-md shadow-[#D4AF37]/30 opacity-100 ring-2 ring-[#D4AF37]/50'
                        : 'border-transparent opacity-50 hover:opacity-85'
                    }`}
                  >
                    <Image
                      src={url}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN ALBUM MODAL (Overview Grid of All Photos in this Event) */}
      <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-6 lg:p-8">
        <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 z-10 animate-in zoom-in-95 duration-200">
          {/* Header Banner */}
          <div className="relative bg-[#00183F] text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="gold">
                    {album.category_display || album.category || 'Campus Album'}
                  </Badge>
                  <span className="text-xs font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {allPhotos.length} {allPhotos.length === 1 ? 'Photograph' : 'Photographs'}
                  </span>
                  {album.event_date && (
                    <span className="text-xs text-slate-300 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#D4AF37]" />
                      {album.event_date}
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {album.title}
                </h2>

                {album.caption && (
                  <p className="text-sm text-slate-300 leading-relaxed pt-1">
                    {album.caption}
                  </p>
                )}
              </div>

              {/* Action Buttons: Slideshow & Close */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {allPhotos.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveIdx(0)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#b8952b] text-[#00183F] font-bold text-xs shadow-md transition-all cursor-pointer transform hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-[#00183F]" />
                    <span>View Slideshow</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>All Event Photographs in this Collection</span>
              </div>
              <span className="text-xs text-slate-400">
                Click any photo to view in high-resolution
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {allPhotos.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#00183F] cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-left"
                >
                  <Image
                    src={imgUrl}
                    alt={`${album.title} photo ${idx + 1}`}
                    fill
                    fallbackSrc="https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1200&auto=format&fit=crop"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-500"
                  />

                  {/* Gradient & Overlay Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                    <span className="text-[11px] font-bold text-white tracking-wide">
                      Photo {idx + 1}
                    </span>
                    <div className="w-7 h-7 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Cover badge on first image */}
                  {idx === 0 && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20">
                        Cover
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {allPhotos.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <p>No photos available for this album.</p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>St. Joseph International School, Narinda • Heritage & Excellence</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-[#00183F] hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

