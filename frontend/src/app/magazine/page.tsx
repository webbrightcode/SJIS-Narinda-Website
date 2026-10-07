'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Download,
  Eye,
  Calendar,
  Sparkles,
  Layers,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  FileText,
  Volume2,
  X,
  Share2,
} from 'lucide-react';
import { Publication } from '@/lib/types';
import { getPublications, incrementPublicationView, incrementPublicationDownload } from '@/lib/api';
import { FlipbookReader } from '@/components/magazine/FlipbookReader';

const TYPE_TABS = [
  { id: 'all', label: 'All Publications' },
  { id: 'magazine', label: 'Annual Magazines' },
  { id: 'yearbook', label: 'Annual Yearbooks' },
  { id: 'newsletter', label: 'Term Gazettes' },
  { id: 'prospectus', label: 'Prospectus & Guides' },
];

export default function MagazinePage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReaderItem, setActiveReaderItem] = useState<Publication | null>(null);

  useEffect(() => {
    let mounted = true;
    getPublications('all', '', 'all', true).then((data) => {
      if (mounted) {
        setPublications(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Filter publications
  const filtered = useMemo(() => {
    return publications.filter((p) => {
      if (selectedType !== 'all' && p.publication_type !== selectedType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          p.title.toLowerCase().includes(q) ||
          p.edition.toLowerCase().includes(q) ||
          p.academic_year.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [publications, selectedType, searchQuery]);

  const featured = useMemo(() => {
    return publications.find((p) => p.is_featured) || publications[0];
  }, [publications]);

  const handleOpenReader = (item: Publication) => {
    incrementPublicationView(item.id);
    setActiveReaderItem(item);
  };

  const handleDownload = (item: Publication) => {
    incrementPublicationDownload(item.id);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* 1. Premier Hero Header */}
      <section className="relative bg-[#00183F] text-white pt-16 pb-20 overflow-hidden">
        {/* Architectural backdrop layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.18),transparent)] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#C8102E]/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-bold tracking-wide">
              <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>OFFICIAL PUBLICATIONS &amp; YEARBOOK ARCHIVE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              School Magazine &amp;{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]">
                Annual Yearbooks
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Explore our digitized student publications, graduation yearbooks, and literary journals. Read with an authentic, realistic 3D page-turn flipbook experience powered by DearFlip.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Featured Spotlight Publication Banner */}
      {featured && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="bg-gradient-to-br from-[#070F1E] via-[#0A192F] to-[#050D1A] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Book Cover 3D Mockup */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative group cursor-pointer" onClick={() => handleOpenReader(featured)}>
                <div className="w-56 sm:w-64 aspect-[3/4] relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 transform group-hover:-translate-y-1 group-hover:shadow-amber-500/20 transition-all duration-300">
                  <Image
                    src={featured.cover_image_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop'}
                    alt={featured.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#C8102E] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                    Featured Edition
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-[11px] font-bold text-amber-300 block">{featured.edition}</span>
                    <span className="text-xs font-bold text-white line-clamp-1">{featured.title}</span>
                  </div>
                </div>
                {/* 3D Book spine illusion */}
                <div className="absolute -left-2 top-2 bottom-2 w-3 bg-gradient-to-r from-slate-900 to-slate-700 rounded-l-md opacity-80" />
              </div>
            </div>

            {/* Featured Details */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
                  {featured.academic_year} Edition
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-semibold">
                  {featured.pages_count > 0 ? `${featured.pages_count} Pages Booklet` : 'Full Color Publication'}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Realistic Sound &amp; 3D Page Turn
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {featured.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {featured.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleOpenReader(featured)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#E5A823] hover:from-[#E5A823] hover:to-[#D4AF37] text-[#00183F] font-black text-sm flex items-center gap-2.5 shadow-xl shadow-amber-500/20 cursor-pointer transition-all transform hover:scale-[1.02]"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read 3D Flipbook Now</span>
                </button>

                <a
                  href={featured.pdf_url}
                  download
                  onClick={() => handleDownload(featured)}
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Download PDF ({featured.file_size || 'PDF'})</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Filter Navigation & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {TYPE_TABS.map((tab) => {
              const active = selectedType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    active
                      ? 'bg-[#00183F] text-amber-300 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px] lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by publication title, edition, or year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00183F] outline-none"
            />
          </div>
        </div>
      </section>

      {/* 4. Publications Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="py-24 text-center">
            <BookOpen className="w-10 h-10 animate-pulse text-[#D4AF37] mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-700">Loading publications archive...</p>
            <p className="text-xs text-slate-400 mt-1">Fetching digital school magazines and yearbooks</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No publications matched your filter</h3>
            <p className="text-xs text-slate-400 mt-1">Try switching categories or clearing search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Book Cover Presentation */}
                <div
                  className="relative aspect-[3/4] bg-slate-900 cursor-pointer overflow-hidden"
                  onClick={() => handleOpenReader(item)}
                >
                  <Image
                    src={item.cover_image_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop'}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#00183F]/90 backdrop-blur-md text-amber-300 border border-amber-400/30 text-[10px] font-bold">
                      {item.academic_year}
                    </span>
                  </div>

                  {/* Center Hover Action */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                    <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5A823] text-[#00183F] font-black text-xs flex items-center gap-1.5 shadow-xl transform scale-95 group-hover:scale-100 transition-transform">
                      <BookOpen className="w-3.5 h-3.5" /> Read 3D Book
                    </span>
                  </div>

                  {/* Bottom Edition Pill */}
                  <div className="absolute bottom-3 left-3 right-3 text-left">
                    <span className="text-[11px] font-bold text-amber-300 line-clamp-1">{item.edition}</span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3
                      onClick={() => handleOpenReader(item)}
                      className="text-sm font-bold text-slate-800 line-clamp-2 hover:text-[#00183F] cursor-pointer transition-colors"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{item.pages_count > 0 ? `${item.pages_count} Pages` : 'Magazine'}</span>
                      <span className="font-mono">{item.file_size || 'PDF'}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenReader(item)}
                        className="w-full py-2 px-3 rounded-xl bg-[#00183F] hover:bg-[#070F1E] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                        <span>Flipbook</span>
                      </button>

                      <a
                        href={item.pdf_url}
                        download
                        onClick={() => handleDownload(item)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        title="Download PDF"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-600" />
                        <span>PDF</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Immersive Modal DearFlip 3D Book Reader */}
      {activeReaderItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-6xl max-h-[95vh] flex flex-col relative">
            <FlipbookReader
              pdfUrl={activeReaderItem.pdf_url}
              title={activeReaderItem.title}
              edition={activeReaderItem.edition}
              isModal={true}
              onClose={() => setActiveReaderItem(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
