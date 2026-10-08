'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, MapPin, Clock, ShieldCheck, GraduationCap, ExternalLink, Bell, ChevronRight } from 'lucide-react';
import { useSiteSettings, telHref } from '@/components/layout/SiteSettingsContext';
import { getNotices } from '@/lib/api';
import { Notice } from '@/lib/types';

const formatPhone = (phone?: string) => {
  if (!phone) return '+880 1746-866393';
  const clean = phone.trim();
  if (clean.startsWith('+880') && clean.length === 14 && !clean.includes(' ')) {
    return `${clean.slice(0, 4)} ${clean.slice(4, 8)}-${clean.slice(8)}`;
  }
  return clean;
};

export const TopHeader: React.FC = () => {
  const site = useSiteSettings();
  const displayPhone = formatPhone(site.phone_primary);

  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let mounted = true;
    getNotices('all', '', true).then((data) => {
      if (mounted && Array.isArray(data)) {
        setNotices(data.slice(0, 5));
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Auto cycle ticker every 4.5 seconds unless paused on mouse hover
  useEffect(() => {
    if (notices.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notices.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [notices.length, isPaused]);

  return (
    <div className="hidden md:block bg-gradient-to-r from-[#030712] via-[#050D1A] to-[#030712] text-slate-300 border-b border-white/[0.08] text-[12px]">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-10 flex items-center justify-between gap-4">
        {/* Left: Official Contact & Campus Coordinates */}
        <div className="flex items-center gap-4 xl:gap-6 divide-x divide-white/10 shrink-0">
          <a
            href={telHref(site.phone_primary)}
            className="inline-flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-semibold tracking-wide text-slate-200">{displayPhone}</span>
          </a>

          <a
            href={site.map_link || 'https://maps.google.com/?q=St+Joseph+International+School+Narinda+Dhaka'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 pl-4 xl:pl-6 hover:text-white transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-medium text-slate-300">Narinda, Old Dhaka</span>
          </a>

          <span className="inline-flex items-center gap-1.5 pl-4 xl:pl-6 text-slate-400 hidden 2xl:inline-flex">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{site.office_hours || 'Sun – Thu · 7:30 AM – 4:30 PM'}</span>
          </span>
        </div>

        {/* Center: Dynamic Circulars & Notice Ticker */}
        {notices.length > 0 && (
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="hidden lg:flex items-center gap-2.5 flex-1 max-w-md xl:max-w-xl mx-2 px-3 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-[#D4AF37]/30 transition-all group min-w-0"
          >
            <div className="shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#C8102E] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping inline-block" />
              <span>Notice</span>
            </div>

            <div className="relative overflow-hidden h-4 flex-1 min-w-0">
              {notices.map((n, i) => (
                <Link
                  key={n.id}
                  href={`/notices/${n.slug || n.id}`}
                  className={`absolute inset-0 flex items-center gap-1.5 transition-all duration-500 truncate text-slate-200 hover:text-amber-300 font-medium text-[11px] ${
                    i === currentIndex
                      ? 'opacity-100 translate-y-0 pointer-events-auto'
                      : i === (currentIndex - 1 + notices.length) % notices.length
                      ? 'opacity-0 -translate-y-3 pointer-events-none'
                      : 'opacity-0 translate-y-3 pointer-events-none'
                  }`}
                  title={n.title}
                >
                  <span className="truncate">{n.title}</span>
                  <ChevronRight className="w-3 h-3 text-[#D4AF37] opacity-60 group-hover:opacity-100 shrink-0 transition-opacity" />
                </Link>
              ))}
            </div>

            {notices.length > 1 && (
              <span className="shrink-0 text-[10px] font-mono text-slate-500 group-hover:text-amber-300/80 transition-colors">
                {currentIndex + 1}/{notices.length}
              </span>
            )}
          </div>
        )}

        {/* Right: Cambridge Accreditation & Student Portal */}
        <div className="flex items-center gap-3.5 shrink-0">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 font-semibold text-[11px] tracking-wide shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{site.accreditation_label || 'Cambridge International Curriculum'}</span>
          </span>

          <span className="h-3.5 w-px bg-white/15" />

          <a
            href="https://portal.narinda.sjis.edu.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-amber-300 hover:text-white bg-white/5 hover:bg-white/10 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 font-semibold text-[11px] transition-all cursor-pointer shadow-xs group"
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span>Student Portal</span>
            <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>
    </div>
  );
};
