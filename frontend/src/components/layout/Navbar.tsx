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
          ? 'bg-[#00183F]/98 backdrop-blur-md shadow-xl shadow-black/20 py-3 border-b border-white/10'
          : 'bg-[#00183F] py-4 border-b border-white/10'
      }`}
    >
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 overflow-hidden">
        <div className="flex items-center justify-between gap-2 sm:gap-4 xl:gap-8">
          {/* Logo & School Branding */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3.5 group min-w-0 flex-1 sm:flex-initial overflow-hidden">
            <div className="h-10 w-10 sm:h-14 sm:w-14 lg:h-16 lg:w-16 max-w-[280px] flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shrink-0">
              <img
                src={logoError || !site.logo_url ? '/sjis-crest-logo.png' : site.logo_url}
                alt={site.school_name || 'St. Joseph International School'}
                onError={() => setLogoError(true)}
                className="max-h-10 sm:max-h-14 lg:max-h-16 w-auto object-contain drop-shadow-md rounded-full"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0 overflow-hidden">
              <span className="font-cinzel text-white font-extrabold text-[12px] xs:text-sm sm:text-base md:text-lg lg:text-xl 2xl:text-[22px] tracking-tight sm:tracking-wide truncate group-hover:text-[#D4AF37] transition-colors drop-shadow-sm leading-tight block">
                {site.school_name || 'St. Joseph International School'}
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 min-w-0 overflow-hidden">
                <span className="inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[11px] font-bold tracking-widest uppercase bg-gradient-to-r from-amber-400/20 via-[#D4AF37]/30 to-amber-500/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-xs shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  Narinda
                </span>
                <span className="text-slate-300/80 text-[10px] sm:text-xs font-semibold tracking-wider uppercase truncate hidden xs:inline">
                  • Dhaka, Bangladesh
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links - Guaranteed single line */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 2xl:gap-1.5 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`whitespace-nowrap shrink-0 px-2.5 xl:px-3 2xl:px-3.5 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-all duration-200 relative ${
                    isActive
                      ? 'text-[#D4AF37] bg-white/10'
                      : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#D4AF37] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            <a
              href="https://portal.narinda.sjis.edu.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-300 bg-white/5 border border-amber-400/30 hover:bg-white/10 hover:border-amber-400/60 transition-all cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Portal</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <Button
              href="/admission"
              variant="secondary"
              size="sm"
              className="whitespace-nowrap shrink-0"
              icon={<Sparkles className="w-4 h-4 text-amber-300" />}
            >
              Apply Online
            </Button>
          </div>

          {/* Mobile Menu Trigger - Properly aligned with right padding */}
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
        <div className="lg:hidden bg-[#070F1E] border-b border-white/10 animate-in slide-in-from-top-4 duration-200">
          <div className="max-w-7xl mx-auto px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#C8102E] text-white'
                      : 'text-slate-200 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </Link>
              );
            })}
            <div className="pt-3 space-y-2">
              <a
                href="https://portal.narinda.sjis.edu.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-amber-400/30 text-amber-300 hover:bg-white/10 text-sm font-bold transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
                <span>Student & Parent Portal</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
              <Button
                href="/admission"
                variant="gold"
                size="md"
                className="w-full justify-center"
              >
                Apply for Admission 2026-27
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
