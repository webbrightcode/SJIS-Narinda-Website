'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ShieldCheck,
  Award,
  ChevronRight,
} from 'lucide-react';
import { useSiteSettings, telHref } from '@/components/layout/SiteSettingsContext';

export const Footer: React.FC = () => {
  const site = useSiteSettings();
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [site.logo_url]);

  return (
    <footer className="bg-[#070F1E] text-slate-300 border-t border-white/10 pt-16 pb-10">
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Identity & Crest */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-4 pr-2">
            <div className="flex items-center gap-4">
              {site.logo_url && !logoError ? (
                <div className="h-16 sm:h-20 max-w-[260px] flex items-center justify-center shrink-0">
                  <img
                    src={site.logo_url}
                    alt={site.school_name || 'St. Joseph International School'}
                    onError={() => setLogoError(true)}
                    className="max-h-16 sm:max-h-20 w-auto object-contain rounded-xl drop-shadow-md"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#C8102E] p-0.5 shadow-md flex items-center justify-center shrink-0">
                  <div className="w-full h-full bg-[#00183F] rounded-[14px] flex items-center justify-center">
                    <GraduationCap className="w-9 h-9 sm:w-11 sm:h-11 text-[#D4AF37]" />
                  </div>
                </div>
              )}
              <div className="min-w-0">
                <h3 className="font-cinzel text-white font-extrabold text-lg sm:text-xl leading-snug whitespace-nowrap">
                  {site.school_name || 'St. Joseph International School'}
                </h3>
                <div className="flex items-center gap-2 mt-1 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase bg-gradient-to-r from-amber-400/20 via-[#D4AF37]/30 to-amber-500/20 text-[#D4AF37] border border-[#D4AF37]/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    Narinda
                  </span>
                  <span className="text-slate-300 text-xs font-semibold tracking-wider uppercase">
                    • Dhaka, Bangladesh
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A distinguished Holy Cross institution dedicated to sculpting intellect, integrity, and visionary leadership in Bangladesh.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>{site.accreditation_label ? site.accreditation_label.replace(/·\s*BD\d+/gi, '').replace(/BD\d+/gi, '').trim() : 'Cambridge International Curriculum'}</span>
            </div>
          </div>

          {/* Col 2: Quick Links - Moved slightly to the right */}
          <div className="lg:col-span-3 xl:col-span-3 lg:pl-10 xl:pl-14">
            <h4 className="text-white text-base font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8102E]" />
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'About Our Heritage', href: '/about' },
                { name: 'Principal’s Message', href: '/about#principal' },
                { name: 'Faculty & Administration', href: '/faculty' },
                { name: 'Notice Board & Circulars', href: '/notices' },
                { name: 'Student Clubs & Guilds', href: '/clubs' },
                { name: 'Admission Procedure', href: '/admission' },
                { name: 'Photo & Video Gallery', href: '/gallery' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://portal.narinda.sjis.edu.bd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1.5 pt-1"
                >
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>Student & Parent Portal</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Admissions & Academics */}
          <div className="lg:col-span-2 xl:col-span-2">
            <h4 className="text-white text-base font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              Admissions & Academics
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Playgroup to Grade 5 (Primary)', href: '/admission#curriculum' },
                { name: 'Junior Section (Grade 6-8)', href: '/admission#curriculum' },
                { name: 'Cambridge IGCSE & O-Levels', href: '/admission#curriculum' },
                { name: 'Cambridge GCE A-Levels', href: '/admission#curriculum' },
                { name: 'Fee Schedule 2026-2027', href: '/admission#fees' },
                { name: 'Download Prospectus', href: '/admission' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Narinda Campus Location */}
          <div className="lg:col-span-3 xl:col-span-3 space-y-3.5">
            <h4 className="text-white text-base font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00183F]" />
              Narinda Campus Office
            </h4>
            <div className="flex items-start gap-3 text-sm text-slate-400">
              <MapPin className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5" />
              <span className="whitespace-pre-line">{site.address}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>
                <a href={telHref(site.phone_primary)} className="hover:text-white">{site.phone_primary}</a>
                {site.phone_secondary && (
                  <>
                    {' / '}
                    <a href={telHref(site.phone_secondary)} className="hover:text-white">{site.phone_secondary}</a>
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            </div>
            <div className="pt-2">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-300">Office Working Hours:</span>
                <span className="text-xs font-semibold text-amber-300">{site.office_hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} St. Joseph International School, Narinda. All Rights Reserved. Managed by Congregation of Holy Cross.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-slate-600">|</span>
            <a
              href="https://portal.narinda.sjis.edu.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400/90 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
            >
              <span>Campus Portal</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
            <span className="text-slate-600">|</span>
            <Link href="/admin" className="text-amber-400/90 hover:text-amber-300 font-semibold transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
