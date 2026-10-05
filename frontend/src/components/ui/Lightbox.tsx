'use client';

import React, { useEffect } from 'react';
import { FadeImage as Image } from '@/components/ui/FadeImage';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '@/lib/types';

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !items[currentIndex]) return null;

  const currentItem = items[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Buttons */}
      <button
        onClick={onPrev}
        className="absolute left-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={onNext}
        className="absolute right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Center Media Container */}
      <div className="relative max-w-5xl max-h-[85vh] w-full p-4 flex flex-col items-center justify-center">
        <div className="relative w-full h-[65vh] rounded-xl overflow-hidden shadow-2xl bg-black/40">
          <Image
            src={currentItem.image_url}
            alt={currentItem.title}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Caption bar */}
        <div className="mt-4 text-center max-w-2xl px-4">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
            {currentItem.category_display || currentItem.category} • {currentIndex + 1} of {items.length}
          </span>
          <h4 className="text-white text-lg font-bold mt-1">{currentItem.title}</h4>
          {currentItem.caption && (
            <p className="text-slate-300 text-sm mt-1">{currentItem.caption}</p>
          )}
        </div>
      </div>
    </div>
  );
};
