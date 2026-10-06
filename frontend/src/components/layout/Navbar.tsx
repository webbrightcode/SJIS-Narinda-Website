'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, GraduationCap, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSiteSettings } from '@/components/layout/SiteSettingsContext';

export const Navbar: React.FC = () => {
  const site = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Faculty & Staff', href: '/faculty' },
    { name: 'News & Events', href: '/news' },
    { name: 'Notice Board', href: '/notices' },
    { name: 'Clubs', href: '/clubs' },
    { name: 'Admission', href: '/admission' },
    { name: 'Gallery', href: '/gallery' },
  ];

  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [site.logo_url]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#00183F]/98 backdrop-blur-md shadow-xl shadow-black/25 py-2.5 border-b border-[#D4AF37]/20'
          : 'bg-[#00183F] py-3.5 border-b border-white/[0.08]'
      }`}
    >
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 overflow-hidden">
        <div className="flex items-center justify-between gap-3 sm:gap-6 xl:gap-8">
          {/* 1. Logo & School Branding */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0 shrink-0 select-none cursor-pointer"
          >
            <div className="h-11 w-11 sm:h-14 sm:w-14 lg:h-15 lg:w-15 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shrink-0">
              <img
                src={logoError || !site.logo_url ? '/sjis-crest-logo.png' : site.logo_url}
                alt={site.school_name || 'St. Joseph International School'}
                onError={() => setLogoError(true)}
                className="max-h-11 sm:max-h-14 lg:max-h-15 w-auto object-contain drop-shadow-md rounded-full"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <span className="font-cinzel text-white font-extrabold text-[13px] xs:text-[15px] sm:text-base md:text-lg lg:text-xl 2xl:text-[22px] tracking-tight sm:tracking-wide truncate group-hover:text-[#D4AF37] transition-colors drop-shadow-sm leading-tight block">
                {site.school_name || 'St. Joseph International School'}
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 min-w-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase bg-gradient-to-r from-amber-400/20 via-[#D4AF37]/30 to-amber-500/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  Narinda
                </span>
                <span className="text-slate-300/80 text-[10px] sm:text-xs font-semibold tracking-wider uppercase truncate hidden xs:inline">
                  • Dhaka, Bangladesh
                </span>
              </div>
            </div>
          </Link>

          {/* 2. Desktop Navigation Links - Elegant typography & luminous active indicator */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 2xl:gap-3 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`whitespace-nowrap shrink-0 px-3 xl:px-3.5 py-2 text-xs xl:text-sm font-semibold transition-all duration-200 relative group cursor-pointer ${
                    isActive
                      ? 'text-[#D4AF37]'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {isActive ? (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full shadow-sm shadow-amber-400/50" />
                  ) : (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Desktop Standout Call-To-Action (Single high-conversion premier button) */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Button
              href="/admission"
              variant="secondary"
              size="sm"
              className="whitespace-nowrap shrink-0 font-bold shadow-md shadow-rose-950/30 hover:shadow-lg transition-all"
              icon={<Sparkles className="w-4 h-4 text-amber-300" />}
            >
              Apply For Admission
            </Button>
          </div>

          {/* 4. Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden shrink-0 p-2 sm:p-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070F1E] border-b border-white/10 animate-in slide-in-from-top-4 duration-200 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C8102E] to-[#A00B22] text-white shadow-sm'
                      : 'text-slate-200 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Link>
              );
            })}
            <div className="pt-3 space-y-2.5 border-t border-white/10 mt-3">
              <a
                href="https://portal.narinda.sjis.edu.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-amber-400/30 text-amber-300 hover:bg-white/10 text-sm font-bold transition-colors cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
                <span>Student & Parent Portal</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
              <Button
                href="/admission"
                variant="secondary"
                size="md"
                className="w-full justify-center shadow-md font-bold"
                icon={<Sparkles className="w-4 h-4 text-amber-300" />}
              >
                Apply for Admission 2026–27
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
