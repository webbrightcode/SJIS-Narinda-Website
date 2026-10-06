import React from 'react';
import { Newspaper, Sparkles } from 'lucide-react';
import { getNews } from '@/lib/api';
import { NewsFeed } from '@/components/news/NewsFeed';

export const revalidate = 60;

export default async function NewsPage() {
  const items = await getNews('all', '', true);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#00183F] text-white">
        <div className="absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-[#C8102E]/25 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-[26rem] h-[26rem] rounded-full bg-[#D4AF37]/15 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" /> Life at SJIS
          </span>
          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight text-balance">
            News <span className="text-[#D4AF37]">&amp;</span> Events
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Celebrations, competitions and milestones — the moments that make our Josephite community shine.
          </p>
        </div>
        <div className="h-1.5 bg-gradient-to-r from-[#00183F] via-[#D4AF37] to-[#C8102E]" />
      </section>

      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length > 0 ? (
            <NewsFeed items={items} />
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
              <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-slate-700">No stories published yet</h2>
              <p className="text-sm text-slate-500 mt-1">Check back soon for the latest school news.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
