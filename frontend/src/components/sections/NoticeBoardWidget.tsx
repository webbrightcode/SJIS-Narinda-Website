'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Pin,
  Calendar,
  Eye,
  Download,
  ArrowRight,
  FileText,
  Filter,
} from 'lucide-react';
import { Notice } from '@/lib/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { NoticeDetailModal } from '@/components/sections/NoticeDetailModal';
import { useSiteSettings } from '@/components/layout/SiteSettingsContext';

interface NoticeBoardWidgetProps {
  notices: Notice[];
}

export const NoticeBoardWidget: React.FC<NoticeBoardWidgetProps> = ({ notices }) => {
  const site = useSiteSettings();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeNotice, setActiveNotice] = useState<Notice | null>(null);

  const categories = [
    { id: 'all', label: 'All Notices' },
    { id: 'admission', label: 'Admissions' },
    { id: 'academic', label: 'Academic' },
    { id: 'exams', label: 'Examinations' },
    { id: 'events', label: 'Events' },
    { id: 'holidays', label: 'Holidays' },
  ];

  const filteredNotices = notices.filter((n) => {
    if (selectedCategory === 'all') return true;
    return n.category === selectedCategory;
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
    <section className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal direction="up" distance={24} duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="mb-2">
                <Badge variant="crimson">Official Circulars</Badge>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00183F] tracking-tight">
                Notice Board & Announcements
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Stay informed with official circulars, exam dates, and administrative updates.
              </p>
            </div>

            <Button href="/notices" variant="outline" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              View All Circulars
            </Button>
          </div>
        </ScrollReveal>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#00183F] text-white shadow-md shadow-[#00183F]/20'
                  : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Notices List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.slice(0, 6).map((notice, idx) => (
            <ScrollReveal
              key={notice.id}
              direction="up"
              distance={20}
              delay={idx * 70}
              duration={550}
              className="h-full"
            >
              <div
                onClick={() => setActiveNotice(notice)}
                className="h-full bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                {notice.is_pinned && (
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                    <div className="bg-[#C8102E] text-white text-[10px] font-bold uppercase tracking-wider py-1 text-center transform rotate-45 translate-x-4 translate-y-2 shadow-sm">
                      Pin
                    </div>
                  </div>
                )}

                <div>
                  {/* Meta details */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant={getCategoryBadgeVariant(notice.category)}>
                      {notice.category_display || notice.category}
                    </Badge>

                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      {site.show_notice_views !== false && typeof notice.views_count === 'number' && (
                        <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span>{notice.views_count.toLocaleString()}</span>
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{notice.publish_date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-[#00183F] group-hover:text-[#C8102E] transition-colors line-clamp-2 leading-snug">
                    {notice.title}
                  </h3>

                  {/* Content preview */}
                  <p className="mt-3 text-slate-600 text-sm line-clamp-3 leading-relaxed">
                    {notice.content}
                  </p>
                </div>

                {/* Bottom Footer info */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#00183F] group-hover:text-[#C8102E] flex items-center gap-1 transition-colors">
                    Read Circular
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </span>

                  {notice.attachment_url && (
                    <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded-md font-medium">
                      <Download className="w-3 h-3" />
                      PDF
                    </span>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-semibold">No notices found in this category.</p>
          </div>
        )}
      </div>

      {/* Notice Detail Modal */}
      <NoticeDetailModal
        notice={activeNotice}
        isOpen={!!activeNotice}
        onClose={() => setActiveNotice(null)}
      />
    </section>
  );
};
