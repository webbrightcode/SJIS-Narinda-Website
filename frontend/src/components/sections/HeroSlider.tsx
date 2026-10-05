'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight, Play, Pause, Award } from 'lucide-react';
import { SliderSlide } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { BLUR_DATA_URL } from '@/lib/blur';
import { useSiteSettings } from '@/components/layout/SiteSettingsContext';
import { Heart, Trophy, BookOpen, Users, ShieldCheck, Star, Globe, Sparkles } from 'lucide-react';

const HIGHLIGHT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Award, Heart, Trophy, BookOpen, Users, ShieldCheck, Star, Globe, Sparkles, Play, ArrowRight,
};
const HIGHLIGHT_TONES = [
  'bg-amber-400/20 border-amber-400/30 text-amber-300',
  'bg-rose-500/20 border-rose-500/30 text-rose-300',
  'bg-blue-500/20 border-blue-500/30 text-blue-300',
];

interface HeroSliderProps {
  slides: SliderSlide[];
}

const FALLBACK_HERO_IMAGE =
  'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1920&auto=format&fit=crop';

export const HeroSlider: React.FC<HeroSliderProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const site = useSiteSettings();
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
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              onError={() => setImageErrors((prev) => ({ ...prev, [slide.id || index]: true }))}
              className={`object-cover object-center transform transition-transform duration-10000 ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              sizes="100vw"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#00183F]/95 via-[#00183F]/75 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00183F] via-transparent to-black/30" />
          </div>
        );
      })}

      {/* Slide Content */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8">
          <div className="lg:col-span-8 space-y-6">
            {/* Badge */}
            {currentSlide.badge && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/25 border border-[#D4AF37]/60 text-amber-200 text-xs sm:text-sm font-bold tracking-wider uppercase backdrop-blur-md animate-in fade-in duration-500 shadow-md">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <span>{currentSlide.badge}</span>
              </div>
            )}

            {/* Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight text-balance drop-shadow-sm">
              {currentSlide.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-100 font-normal leading-relaxed max-w-2xl drop-shadow-xs">
              {currentSlide.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                href={currentSlide.cta_link}
                variant="secondary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5 text-white" />}
              >
                {currentSlide.cta_text || 'Apply Now'}
              </Button>

              {currentSlide.secondary_cta_text && (
                <Button
                  href={currentSlide.secondary_cta_link || '/about'}
                  variant="outline"
                  size="lg"
                  className="border-white/50 text-white hover:bg-white/15 hover:border-white shadow-md backdrop-blur-xs"
                >
                  {currentSlide.secondary_cta_text}
                </Button>
              )}
            </div>
          </div>

          {/* Institutional Highlights Card (Desktop Overlay) */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-4 bg-slate-900/60 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-2xl text-white animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                  Campus Highlights
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-medium">Holy Cross Institution</span>
            </div>

            <div className="space-y-3.5 text-xs">
              {(site.highlights || []).map((item, idx) => {
                const Icon = HIGHLIGHT_ICONS[item.icon] || Award;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${HIGHLIGHT_TONES[idx % HIGHLIGHT_TONES.length]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">{item.title}</div>
                      <div className="text-slate-300 text-[11px]">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              href="/admission"
              className="mt-2 text-center py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00B22] text-white font-bold text-xs hover:shadow-lg hover:shadow-[#C8102E]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Admissions Open 2026-27 &rarr;
            </a>
          </div>
        </div>
      </div>

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
