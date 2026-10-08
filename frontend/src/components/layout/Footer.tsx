'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { useSiteSettings, telHref } from '@/components/layout/SiteSettingsContext';

export const Footer: React.FC = () => {
  const site = useSiteSettings();
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [site.logo_url]);

  const footerBgImage = site.footer_bg_url?.trim() || '/images/footer-parallax-bg.jpg';

  return (
    <footer className="relative bg-[#050C1A] text-slate-300 border-t border-white/10 pt-16 pb-10 overflow-hidden">
      {/* Parallax Campus Background Image */}
      <div
        className="footer-parallax-bg absolute inset-0 bg-cover bg-center bg-no-repeat bg-scroll md:bg-fixed transform-gpu"
        style={{
          backgroundImage: `url('${footerBgImage}')`,
        }}
        aria-hidden="true"
      />

      {/* Dark Translucent Gradient Overlay for Depth & High-Contrast Legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050C1A]/94 via-[#070F1E]/88 to-[#020612]/96 pointer-events-none" />

      {/* Top Gold / Crimson Academic Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00183F] via-[#D4AF37] to-[#C8102E] z-10" />

      <div className="relative z-10 w-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Identity & Crest */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-4 pr-2">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 sm:h-20 sm:w-20 max-w-[260px] flex items-center justify-center shrink-0">
                <img
                  src={logoError || !site.logo_url ? '/sjis-crest-logo.png' : site.logo_url}
                  alt={site.school_name || 'St. Joseph International School'}
                  onError={() => setLogoError(true)}
                  className="max-h-16 sm:max-h-20 w-auto object-contain drop-shadow-md rounded-full bg-white/5 p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-cinzel text-white font-extrabold text-base sm:text-lg lg:text-xl leading-tight break-words">
                  {site.school_name || 'St. Joseph International School'}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-widest uppercase bg-gradient-to-r from-amber-400/20 via-[#D4AF37]/30 to-amber-500/20 text-[#D4AF37] border border-[#D4AF37]/40 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    Narinda
                  </span>
                  <span className="text-slate-300 text-xs font-semibold tracking-wider uppercase">
                    • Dhaka, Bangladesh
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-300/90 leading-relaxed">
              A distinguished Holy Cross institution dedicated to sculpting intellect, integrity, and visionary leadership in Bangladesh.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300/95 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>{site.accreditation_label ? site.accreditation_label.replace(/·\s*BD\d+/gi, '').replace(/BD\d+/gi, '').trim() : 'Cambridge International Curriculum'}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 xl:col-span-3 lg:pl-10 xl:pl-14">
            <h4 className="text-white text-base font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C8102E]" />
              Our Sitemap
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'About Our Heritage', href: '/about' },
                { name: 'Administrator’s Message', href: '/about#principal' },
                { name: 'Curriculum & Syllabus', href: '/syllabus' },
                { name: 'Faculty & Administration', href: '/faculty' },
                { name: 'News & Events', href: '/news' },
                { name: 'Notice Board & Circulars', href: '/notices' },
                { name: 'Student Clubs & Guilds', href: '/clubs' },
                { name: 'Admission Procedure', href: '/admission' },
                { name: 'Photo & Video Gallery', href: '/gallery' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
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
              Academics
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
                    className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
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
            <div className="flex items-start gap-3 text-sm text-slate-300">
              <MapPin className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5" />
              <span className="whitespace-pre-line">{site.address}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
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
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            </div>
            <div className="pt-2">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 flex items-center justify-between">
                <span className="text-xs text-slate-300">Office Working Hours:</span>
                <span className="text-xs font-semibold text-amber-300">{site.office_hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Share Strip & Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <p className="order-2 md:order-1 text-center md:text-left">
            © {new Date().getFullYear()} St. Joseph International School, Narinda. All Rights Reserved.
          </p>

          {/* Circular Social Buttons (NDC Style) */}
          <div className="order-1 md:order-2 flex items-center gap-3">
            <a
              href={site.facebook_url || 'https://www.facebook.com/sjis.narinda'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Official Facebook Page"
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm border border-white/15"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {site.youtube_url && (
              <a
                href={site.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                title="Official YouTube Channel"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF0000] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm border border-white/15"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            )}

            {site.instagram_url && (
              <a
                href={site.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Official Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#E4405F] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm border border-white/15"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            )}

            {site.whatsapp_number && (
              <a
                href={`https://wa.me/${site.whatsapp_number.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                title="Chat on WhatsApp"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#25D366] text-white flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-sm border border-white/15"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Policy Links */}
          <div className="order-3 flex items-center gap-6">
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
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors flex items-center gap-1"
            >
              <span>Portal</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

