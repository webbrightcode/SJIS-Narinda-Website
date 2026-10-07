'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Building2,
  Users,
  Award,
  FileSpreadsheet,
  BookOpen,
  Sparkles,
  Image as ImageIcon,
  Bell,
  Newspaper,
} from 'lucide-react';
import { useSiteSettings } from '@/components/layout/SiteSettingsContext';

interface SubMenuItem {
  name: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

interface NavGroupItem {
  name: string;
  href?: string;
  children?: SubMenuItem[];
}

export const Navbar: React.FC = () => {
  const site = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({
    'About SJIS': true,
    'Academics': false,
    'Campus Life': true,
    'News & Notices': false,
  });
  const pathname = usePathname();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    setLogoError(false);
  }, [site.logo_url]);

  const navItems: NavGroupItem[] = [
    { name: 'Home', href: '/' },
    {
      name: 'About SJIS',
      children: [
        {
          name: 'About & Heritage',
          href: '/about',
          description: 'Our 1979 legacy, vision & Cambridge accreditation',
          icon: Building2,
        },
        {
          name: 'Faculty & Leadership',
          href: '/faculty',
          description: 'Dedicated educators & academic council',
          icon: Users,
        },
        {
          name: 'Campus Facilities',
          href: '/about#facilities',
          description: 'Science labs, ICT center & sports facilities',
          icon: Award,
        },
      ],
    },
    {
      name: 'Academics',
      children: [
        {
          name: 'Academic Syllabus',
          href: '/syllabus',
          description: 'Grade-wise syllabi (Playgroup to A-Levels)',
          icon: FileSpreadsheet,
          badge: '2025–26',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        },
        {
          name: 'Cambridge Curriculum',
          href: '/about#academics',
          description: 'CIE international benchmarks & exam pathways',
          icon: BookOpen,
        },
      ],
    },
    {
      name: 'Campus Life',
      children: [
        {
          name: 'Magazine & Yearbooks',
          href: '/magazine',
          description: 'Interactive 3D DearFlip book reader with real sound',
          icon: BookOpen,
          badge: '3D Flip',
          badgeColor: 'bg-gradient-to-r from-amber-400/30 via-[#D4AF37]/35 to-amber-500/30 text-amber-300 border-[#D4AF37]/50',
        },
        {
          name: 'Clubs & Guilds',
          href: '/clubs',
          description: 'Robotics, Science, Debate, Sports & Cultural clubs',
          icon: Sparkles,
        },
        {
          name: 'Campus Gallery',
          href: '/gallery',
          description: 'High-res photos, festivals & memorable moments',
          icon: ImageIcon,
        },
      ],
    },
    {
      name: 'News & Notices',
      children: [
        {
          name: 'Notice Board Circulars',
          href: '/notices',
          description: 'Official academic circulars, routines & exams',
          icon: Bell,
          badge: 'Live',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        },
        {
          name: 'News & Events',
          href: '/news',
          description: 'Recent achievements, celebrations & campus stories',
          icon: Newspaper,
        },
      ],
    },
    { name: 'Admission', href: '/admission' },
  ];

  const handleMouseEnter = (itemName: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(itemName);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const toggleMobileGroup = (groupName: string) => {
    setMobileExpanded((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  // Helper to check if any child is currently active
  const isGroupActive = (item: NavGroupItem) => {
    if (item.href && pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child) => pathname === child.href || (child.href !== '/' && pathname.startsWith(child.href)));
    }
    return false;
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#00183F]/98 backdrop-blur-md shadow-xl shadow-black/25 py-2.5 border-b border-[#D4AF37]/20'
          : 'bg-[#00183F] py-3.5 border-b border-white/[0.08]'
      }`}
    >
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 xl:px-10 overflow-visible">
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

          {/* 2. Desktop Navigation with Grouped Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 2xl:gap-3 shrink-0">
            {navItems.map((item) => {
              const active = isGroupActive(item);
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isOpen = openDropdown === item.name;

              if (!hasChildren && item.href) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`whitespace-nowrap shrink-0 px-3 xl:px-3.5 py-2 text-xs xl:text-sm font-semibold transition-all duration-200 relative group cursor-pointer ${
                      active ? 'text-[#D4AF37]' : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {active ? (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full shadow-sm shadow-amber-400/50" />
                    ) : (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </Link>
                );
              }

              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Dropdown Button */}
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(isOpen ? null : item.name)}
                    className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 px-3 xl:px-3.5 py-2 text-xs xl:text-sm font-semibold transition-all duration-200 relative group cursor-pointer rounded-lg hover:bg-white/[0.06] ${
                      active || isOpen ? 'text-[#D4AF37]' : 'text-slate-200 hover:text-white'
                    }`}
                    aria-expanded={isOpen}
                  >
                    <span>{item.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#D4AF37]' : 'opacity-70 group-hover:opacity-100'
                      }`}
                    />
                    {active && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full shadow-sm shadow-amber-400/50" />
                    )}
                  </button>

                  {/* Dropdown Popover Card */}
                  {isOpen && item.children && (
                    <div
                      className="absolute top-full left-0 mt-1.5 w-80 bg-[#001433]/98 backdrop-blur-xl border border-[#D4AF37]/25 shadow-2xl shadow-black/80 rounded-2xl p-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150"
                      onMouseEnter={() => handleMouseEnter(item.name)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Top Accent Line */}
                      <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

                      <div className="space-y-1">
                        {item.children.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive = pathname === sub.href;

                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={() => setOpenDropdown(null)}
                              className={`group/item flex items-start gap-3 p-2.5 rounded-xl transition-all duration-150 cursor-pointer border ${
                                isSubActive
                                  ? 'bg-white/[0.08] border-[#D4AF37]/40 shadow-xs'
                                  : 'border-transparent hover:bg-white/[0.06] hover:border-white/10'
                              }`}
                            >
                              <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-150 ${
                                  isSubActive
                                    ? 'bg-[#D4AF37]/20 border-[#D4AF37]/60 text-[#D4AF37]'
                                    : 'bg-white/5 border-white/10 text-slate-300 group-hover/item:bg-[#D4AF37]/15 group-hover/item:border-[#D4AF37]/50 group-hover/item:text-[#D4AF37]'
                                }`}
                              >
                                <SubIcon className="w-4 h-4" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-xs xl:text-sm font-bold tracking-tight transition-colors ${
                                      isSubActive
                                        ? 'text-[#D4AF37]'
                                        : 'text-white group-hover/item:text-[#D4AF37]'
                                    }`}
                                  >
                                    {sub.name}
                                  </span>
                                  {sub.badge && (
                                    <span
                                      className={`px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md border ${
                                        sub.badgeColor || 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                                      }`}
                                    >
                                      {sub.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mt-0.5 group-hover/item:text-slate-300">
                                  {sub.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* 3. Mobile Menu Trigger */}
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
        <div className="lg:hidden bg-[#070F1E] border-b border-white/10 animate-in slide-in-from-top-4 duration-200 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) => {
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const active = isGroupActive(item);
              const isExpanded = mobileExpanded[item.name];

              if (!hasChildren && item.href) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                      active
                        ? 'bg-gradient-to-r from-[#C8102E] to-[#A00B22] text-white shadow-sm'
                        : 'text-slate-200 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  </Link>
                );
              }

              return (
                <div key={item.name} className="rounded-xl overflow-hidden border border-white/5 bg-white/[0.02]">
                  {/* Group header accordion button */}
                  <button
                    type="button"
                    onClick={() => toggleMobileGroup(item.name)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-base font-semibold transition-colors ${
                      active ? 'text-[#D4AF37]' : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.name}
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 text-slate-400 ${
                        isExpanded ? 'rotate-180 text-[#D4AF37]' : ''
                      }`}
                    />
                  </button>

                  {/* Group child links */}
                  {isExpanded && item.children && (
                    <div className="px-3 pb-3 pt-1 space-y-1 bg-black/20 border-t border-white/5">
                      {item.children.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = pathname === sub.href;

                        return (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                              isSubActive
                                ? 'bg-[#D4AF37]/20 text-[#D4AF37] font-bold border border-[#D4AF37]/40'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center shrink-0 text-slate-300">
                              <SubIcon className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate">{sub.name}</span>
                                {sub.badge && (
                                  <span
                                    className={`px-1.5 py-0.2 text-[8px] font-black uppercase tracking-wider rounded border ${
                                      sub.badgeColor || 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                                    }`}
                                  >
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Portal Link */}
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
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
