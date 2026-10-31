'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FadeImage as Image } from '@/components/ui/FadeImage';
import {
  Eye,
  Camera,
  Layers,
  Calendar,
  Sparkles,
  ArrowRight,
  Images,
} from 'lucide-react';
import { GalleryItem } from '@/lib/types';
import { getGallery } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { AlbumModal } from '@/components/gallery/AlbumModal';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getGallery();
      setItems(data);
    }
    loadData();
  }, []);

  // Dynamically extract whatever custom categories currently exist in the gallery
  const dynamicCategories = useMemo(() => {
    return Array.from(
      new Set(
        items
          .map((i) => (i.category_display || i.category || '').trim())
          .filter(Boolean)
      )
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return items;
    return items.filter(
      (i) =>
        (i.category_display || i.category || '').trim().toLowerCase() ===
        selectedCategory.toLowerCase()
    );
  }, [items, selectedCategory]);

  const totalPhotosCount = useMemo(() => {
    return items.reduce((acc, curr) => {
      const extra = curr.gallery_images?.length || 0;
      const primary = curr.image_url ? 1 : 0;
      return acc + extra + primary;
    }, 0);
  }, [items]);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <section className="relative py-20 bg-[#00183F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="gold">Visual Chronicles</Badge>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-white">
            Photo Albums & Media Gallery
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Capturing the spirit of St. Joseph Narinda: click on any event album to explore its full high-resolution photographic collection.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-amber-300/90 font-medium">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/15 backdrop-blur-xs">
              <Layers className="w-3.5 h-3.5" /> {items.length} Event Albums
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/15 backdrop-blur-xs">
              <Images className="w-3.5 h-3.5" /> {totalPhotosCount} Total Photographs
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dynamic Category Filter Tabs (rendered only when categories exist) */}
          {dynamicCategories.length > 0 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#00183F] text-white shadow-md shadow-[#00183F]/20'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                All Albums ({items.length})
              </button>
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-[#00183F] text-white shadow-md shadow-[#00183F]/20'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Gallery Albums Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => {
              const extraCount = item.gallery_images?.length || 0;
              const photoCount = (item.image_url ? 1 : 0) + extraCount;
              const isMultiPhoto = photoCount > 1;

              return (
                <div
                  key={item.id}
                  className="relative group cursor-pointer focus:outline-hidden"
                  onClick={() => setSelectedAlbum(item)}
                >
                  {/* Subtle stacked layers behind the card if it has multiple photos */}
                  {isMultiPhoto && (
                    <>
                      <div className="absolute inset-0 translate-y-2 translate-x-2 bg-slate-300/80 rounded-2xl -z-10 group-hover:translate-y-3 group-hover:translate-x-3 transition-transform duration-300" />
                      <div className="absolute inset-0 translate-y-4 translate-x-4 bg-slate-200/60 rounded-2xl -z-20 group-hover:translate-y-5 group-hover:translate-x-5 transition-transform duration-300" />
                    </>
                  )}

                  <div className="relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 bg-slate-900 border border-slate-200/80">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      fallbackSrc="https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1200&auto=format&fit=crop"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-106 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 opacity-80 group-hover:opacity-95 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                      {item.category ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-xs">
                          {item.category_display || item.category}
                        </span>
                      ) : <span />}

                      {/* Photo Count Badge */}
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#D4AF37] text-[#00183F] shadow-md flex items-center gap-1.5 backdrop-blur-md">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
                      </span>
                    </div>

                    {/* Hover Center Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                      <div className="px-4 py-2 rounded-xl bg-white/95 text-[#00183F] font-bold text-xs shadow-xl flex items-center gap-2 transform group-hover:scale-105 transition-transform backdrop-blur-xs">
                        <Eye className="w-4 h-4 text-[#D4AF37]" />
                        <span>Explore Album</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Bottom Title, Date & Caption */}
                    <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                      {item.event_date && (
                        <div className="flex items-center gap-1 text-[11px] text-amber-300 font-medium mb-1">
                          <Calendar className="w-3 h-3" />
                          <span>{item.event_date}</span>
                        </div>
                      )}

                      <h3 className="text-base sm:text-lg font-bold group-hover:text-[#D4AF37] transition-colors leading-snug">
                        {item.title}
                      </h3>

                      {item.caption && (
                        <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                          {item.caption}
                        </p>
                      )}

                      <div className="mt-2 text-[10px] uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
                        <span>Click to view {photoCount} photos</span>
                        <span>&rarr;</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {items.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700">No media found in the gallery</h3>
              <p className="text-xs text-slate-400 mt-1">Check back soon for new school chronicles.</p>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Album Showcase Modal (Opens when an album thumbnail is clicked) */}
      {selectedAlbum && (
        <AlbumModal
          album={selectedAlbum}
          isOpen={!!selectedAlbum}
          onClose={() => setSelectedAlbum(null)}
        />
      )}
    </div>
  );
}
