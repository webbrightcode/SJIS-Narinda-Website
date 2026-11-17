'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Play, Pause, ArrowRight } from 'lucide-react';
import { SliderSlide } from '@/lib/types';
import { BLUR_DATA_URL } from '@/lib/blur';

interface HeroSliderProps {
  slides: SliderSlide[];
}

const FALLBACK_HERO_IMAGE =
  'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1920&auto=format&fit=crop';

export const HeroSlider: React.FC<HeroSliderProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string | number, boolean>>({});

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
    setIsPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const distance = touchStartX.current - touchEndX.current;
      const isLeftSwipe = distance > 45;
      const isRightSwipe = distance < -45;

      if (isLeftSwipe) {
        nextSlide();
      } else if (isRightSwipe) {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    setIsPlaying(true);
  };

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying || slides.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6500);

    return () => clearInterval(interval);
  }, [isPlaying, nextSlide, slides.length]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <section
      className="relative w-full h-[620px] sm:h-[680px] lg:h-[750px] overflow-hidden bg-[#00183F] select-none"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Image */}
            <Image
              src={
                imageErrors[slide.id || index]
                  ? FALLBACK_HERO_IMAGE
                  : slide.image_url || FALLBACK_HERO_IMAGE
              }
              alt={slide.title}
              fill
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
              unoptimized
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              onError={() => setImageErrors((prev) => ({ ...prev, [slide.id || index]: true }))}
              className={`object-cover object-center transform transition-transform duration-10000 ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              sizes="100vw"
            />
            {/* Subtle Gradient Overlay for visual clarity while keeping image prominent */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#00183F]/80 via-black/10 to-black/30" />
          </div>
        );
      })}

      {/* Slide Content: Badge, Title, Subtitle & Interactive CTA */}
      {(currentSlide?.title || currentSlide?.badge || currentSlide?.subtitle) && (
        <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-24 sm:pb-28 pointer-events-none">
          <div className="max-w-4xl space-y-3">
            {currentSlide.badge && currentSlide.badge.trim().length > 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-[#00183F] shadow-lg pointer-events-auto">
                  {currentSlide.badge}
                </span>
              </div>
            )}

            {currentSlide.title && currentSlide.title.trim().length > 0 && (
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-500">
                {currentSlide.title}
              </h1>
            )}

            {currentSlide.subtitle && currentSlide.subtitle.trim().length > 0 && (
              <p className="text-sm sm:text-base text-slate-100 line-clamp-2 max-w-2xl drop-shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500 font-medium">
                {currentSlide.subtitle}
              </p>
            )}

            {currentSlide.cta_link && currentSlide.cta_link.trim().length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-500">
                <Link
                  href={currentSlide.cta_link}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C8102E] hover:from-[#e5be3e] hover:to-[#d61937] text-white font-bold text-xs sm:text-sm shadow-xl transition-all active:scale-95 cursor-pointer pointer-events-auto"
                >
                  <span>{currentSlide.cta_text || 'Read Full Story'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {currentSlide.secondary_cta_link && currentSlide.secondary_cta_text && (
                  <Link
                    href={currentSlide.secondary_cta_link}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm backdrop-blur-md border border-white/20 transition-all cursor-pointer pointer-events-auto"
                  >
                    <span>{currentSlide.secondary_cta_text}</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Controls: Arrows */}
      <div className="absolute bottom-8 right-3 xs:right-6 sm:right-12 z-30 flex items-center gap-2 sm:gap-3">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-[#D4AF37] border border-white/20 backdrop-blur-md transition-all"
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Dots Indicator */}
      <div className="absolute bottom-8 left-4 sm:left-8 z-30 flex items-center gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full h-2.5 ${
              index === currentIndex
                ? 'w-10 sm:w-12 bg-gradient-to-r from-[#D4AF37] to-[#C8102E]'
                : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
