'use client';

import React, { useState } from 'react';
import { FadeImage as Image } from '@/components/ui/FadeImage';
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Testimonial } from '@/lib/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const TestimonialsSection: React.FC<{ items?: Testimonial[] }> = ({ items = [] }) => {
  const TESTIMONIALS = items;
  const [currentIndex, setCurrentIndex] = useState(0);

  if (TESTIMONIALS.length === 0) return null;

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-amber-100/40 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up" distance={24} duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <SectionHeading
              badge="Community Trust"
              title="Voices of the Josephite Family"
              subtitle="Hear firsthand from parents and alumni whose journeys are defined by Holy Cross excellence."
              centered={false}
            />

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={prev}
                className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-[#00183F] shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-[#00183F] shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((item, index) => {
            const isFeatured = index === currentIndex;
            return (
              <ScrollReveal
                key={item.id}
                direction="up"
                distance={20}
                delay={index * 80}
                duration={550}
                className="h-full"
              >
                <div
                  className={`h-full rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative border ${
                    isFeatured
                      ? 'bg-[#00183F] text-white border-[#00183F] shadow-2xl -translate-y-2'
                      : 'bg-slate-50/80 hover:bg-white text-slate-800 border-slate-200/80 hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                <div>
                  {/* Badge & Rating */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${
                        isFeatured
                          ? 'bg-[#D4AF37]/25 text-amber-300 border border-[#D4AF37]/40'
                          : 'bg-slate-200/80 text-slate-700'
                      }`}
                    >
                      {item.badge || 'Testimonial'}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, Math.max(1, item.rating || 5)))].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>
                  </div>

                  {/* Quote Icon */}
                  <Quote
                    className={`w-7 h-7 mb-3 ${
                      isFeatured ? 'text-[#D4AF37]/40' : 'text-slate-300'
                    }`}
                  />

                  {/* Quote Text */}
                  <p
                    className={`text-sm leading-relaxed mb-6 ${
                      isFeatured ? 'text-slate-200 font-light' : 'text-slate-600'
                    }`}
                  >
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div
                  className={`pt-5 border-t flex items-center gap-3.5 ${
                    isFeatured ? 'border-white/15' : 'border-slate-200'
                  }`}
                >
                  <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-[#D4AF37]">
                    <Image
                      src={item.avatar_url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=200&auto=format&fit=crop'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-bold flex items-center gap-1.5 ${
                        isFeatured ? 'text-white' : 'text-[#00183F]'
                      }`}
                    >
                      <span>{item.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline" />
                    </h4>
                    <p
                      className={`text-[11px] leading-tight mt-0.5 ${
                        isFeatured ? 'text-amber-200/80' : 'text-slate-500 font-medium'
                      }`}
                    >
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
