'use client';

import React from 'react';
import { Phone, Mail, Clock, ShieldCheck, ArrowUpRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { useSiteSettings, telHref } from '@/components/layout/SiteSettingsContext';

const itemClass =
  'inline-flex items-center gap-2 whitespace-nowrap text-[12px] leading-none tracking-wide';

export const TopHeader: React.FC = () => {
  const site = useSiteSettings();
  return (
    <div className="hidden md:block bg-gradient-to-r from-[#050B17] via-[#070F1E] to-[#050B17] text-slate-300 border-b border-white/10">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 h-10 flex items-center justify-between gap-6">
        {/* Left: Contact */}
        <div className="flex items-center divide-x divide-white/10">
          <a
            href={telHref(site.phone_primary)}
            className={`${itemClass} pr-5 hover:text-white transition-colors`}
          >
            <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{site.phone_primary}</span>
          </a>
          <a
            href={`mailto:${site.email}`}
            className={`${itemClass} px-5 hover:text-white transition-colors`}
          >
            <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{site.email}</span>
          </a>
          <span className={`${itemClass} pl-5 text-slate-400 hidden lg:inline-flex`}>
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{site.office_hours}</span>
          </span>
        </div>

        {/* Right: Accreditation & portals */}
        <div className="flex items-center gap-4">
          <span
            className={`${itemClass} hidden xl:inline-flex px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 font-semibold`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{site.accreditation_label}</span>
          </span>

          {site.admissions_open && (
          <Link
            href="/admission"
            className={`${itemClass} px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#C8102E] to-[#A00B22] text-white font-semibold shadow-sm shadow-[#C8102E]/30 hover:brightness-110 transition-all group`}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-300" />
            </span>
            <span>{site.admissions_label}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
          )}

          <span className="h-4 w-px bg-white/15" />

          <a
            href="https://portal.narinda.sjis.edu.bd/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${itemClass} text-[#D4AF37] hover:text-amber-300 font-semibold transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-md border border-[#D4AF37]/30`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Student Portal</span>
            <ArrowUpRight className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>
    </div>
  );
};
