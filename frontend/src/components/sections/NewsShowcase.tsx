import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { News } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { NewsCard } from '@/components/news/NewsCard';

/** Homepage teaser: latest event stories with photos. Renders nothing if there are none. */
export function NewsShowcase({ news }: { news: News[] }) {
  const items = news.slice(0, 3);
  if (items.length === 0) return null;
  const [lead, ...rest] = items;

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal direction="up" distance={24} duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="mb-2">
                <Badge variant="crimson">News &amp; Events</Badge>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#00183F] tracking-tight">
                Happening at SJIS
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl">
                Fresh stories and photos from our celebrations, competitions and campus life.
              </p>
            </div>
            <Button href="/news" variant="outline" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              All News
            </Button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <ScrollReveal direction="up" className="lg:col-span-3">
            <NewsCard item={lead} variant="featured" />
          </ScrollReveal>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
            {rest.map((n, i) => (
              <ScrollReveal key={n.id} direction="up" delay={(i + 1) * 100} className="h-full">
                <NewsCard item={n} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
