'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  Search,
  Calendar,
  Download,
  Filter,
  ArrowRight,
  FileText,
  Clock,
  Pin,
  Eye,
} from 'lucide-react';
import { Notice } from '@/lib/types';
import { getNotices } from '@/lib/api';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { NoticeDetailModal } from '@/components/sections/NoticeDetailModal';
import { useSiteSettings } from '@/components/layout/SiteSettingsContext';

export default function NoticesPage() {
  const site = useSiteSettings();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNotice, setActiveNotice] = useState<Notice | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getNotices();
      setNotices(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const categories = [
    { id: 'all', label: 'All Notices' },
    { id: 'admission', label: 'Admission' },
    { id: 'academic', label: 'Academic' },
    { id: 'exams', label: 'Examinations' },
    { id: 'events', label: 'Events & Celebrations' },
    { id: 'holidays', label: 'Holidays & Closures' },
  ];

  const filteredNotices = notices.filter((notice) => {
    const matchesCategory =
      selectedCategory === 'all' || notice.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'admission':
        return 'gold';
      case 'exams':
        return 'crimson';
      case 'events':
        return 'navy';
      case 'holidays':
        return 'emerald';
      default:
        return 'slate';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <section className="relative py-20 bg-[#00183F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="crimson">Administrative Portal</Badge>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-white">
            Official Notice Board & Circulars
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            All official notices, term exam timetables, academic calendars, and circulars for parents and students.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Controls: Search & Category Tabs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-10 space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative w-full md:max-w-md">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search notices by keyword or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00183F] text-sm text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* Notice Counter */}
              <div className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                Showing {filteredNotices.length} of {notices.length} Circulars
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#00183F] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notices Grid */}
          <div className="space-y-4">
            {filteredNotices.map((notice) => (
              <Link
                key={notice.id}
                href={`/notices/${notice.slug || notice.id}`}
                className={`block bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:-translate-y-0.5 ${
                  notice.is_pinned
                    ? 'border-amber-300/80 bg-gradient-to-r from-amber-50/30 to-white'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    {notice.is_pinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#C8102E] text-white uppercase tracking-wider">
                        <Pin className="w-3 h-3 fill-current" />
                        Pinned Notice
                      </span>
                    )}
                    <Badge variant={getCategoryBadgeVariant(notice.category)}>
                      {notice.category_display || notice.category}
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {notice.publish_date}
                    </span>
                    {site.show_notice_views !== false && typeof notice.views_count === 'number' && (
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{notice.views_count.toLocaleString()} reads</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[#00183F] group-hover:text-[#C8102E] transition-colors leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                    {notice.content}
                  </p>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                  {notice.attachment_url && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                      <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                      PDF
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 group-hover:bg-[#00183F] group-hover:text-white transition-colors text-xs font-bold text-slate-700">
                    Read Circular
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}

            {filteredNotices.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">No circulars match your search</h3>
                <p className="text-sm text-slate-500 mt-1">Try refining your keyword or category filter.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Notice Detail Modal */}
      <NoticeDetailModal
        notice={activeNotice}
        isOpen={!!activeNotice}
        onClose={() => setActiveNotice(null)}
      />
    </div>
  );
}
