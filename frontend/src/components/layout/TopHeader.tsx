'use client';

import React from 'react';
import { Phone, MapPin, Clock, ShieldCheck, GraduationCap, ExternalLink } from 'lucide-react';
import { useSiteSettings, telHref } from '@/components/layout/SiteSettingsContext';

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

  return (
    <div className="hidden md:block bg-gradient-to-r from-[#030712] via-[#050D1A] to-[#030712] text-slate-300 border-b border-white/[0.08] text-[12px]">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-10 flex items-center justify-between gap-6">
        {/* Left: Official Contact & Campus Coordinates */}
        <div className="flex items-center gap-6 divide-x divide-white/10">
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
            className="inline-flex items-center gap-1.5 pl-6 hover:text-white transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-medium text-slate-300">Narinda, Old Dhaka</span>
          </a>

          <span className="inline-flex items-center gap-1.5 pl-6 text-slate-400 hidden xl:inline-flex">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{site.office_hours || 'Sun – Thu · 7:30 AM – 4:30 PM'}</span>
          </span>
        </div>

        {/* Right: Cambridge Accreditation & Student Portal */}
        <div className="flex items-center gap-3.5">
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
