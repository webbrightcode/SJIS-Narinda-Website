'use client';

import React, { useMemo, useState } from 'react';
import { Search, Newspaper } from 'lucide-react';
import type { News } from '@/lib/types';
import { NewsCard } from './NewsCard';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function NewsFeed({ items }: { items: News[] }) {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((n) => map.set(n.category, n.category_display || n.category));
    return Array.from(map, ([id, label]) => ({ id, label }));
  }, [items]);

  const filtered = items.filter((n) => {
    const q = query.trim().toLowerCase();
    return (
      (category === 'all' || n.category === category) &&
      (!q || n.title.toLowerCase().includes(q) || (n.summary + ' ' + n.content).toLowerCase().includes(q))
    );
  });

  const [featured, ...rest] = filtered;

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[{ id: 'all', label: 'All Stories' }, ...categories].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                category === c.id
                  ? 'bg-[#00183F] text-white shadow-lg shadow-[#00183F]/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#00183F] hover:text-[#00183F]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories…"
            aria-label="Search news stories"
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00183F]"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No stories found</h3>
          <p className="text-sm text-slate-500 mt-1">Try a different keyword or category.</p>
        </div>
      ) : (
        <>
          <ScrollReveal direction="up" key={`f-${featured.id}`}>
            <NewsCard item={featured} variant="featured" priority />
          </ScrollReveal>

          {rest.length > 0 && (
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rest.map((n, i) => (
                <ScrollReveal key={n.id} direction="up" delay={(i % 3) * 80} className="h-full">
                  <NewsCard item={n} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
