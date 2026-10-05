'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MapPin, Bell, Sparkles } from 'lucide-react';
import { useSiteSettings } from '@/components/layout/SiteSettingsContext';

export const MobileBottomDock: React.FC = () => {
  const pathname = usePathname();
  const site = useSiteSettings();

  // Primary contact phone
  const phoneNumber = site.phone_primary || '+8801711234567';
  const cleanPhone = phoneNumber.replace(/[^0-9+]/g, '');

  return (
    <nav
      aria-label="Quick mobile navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#00183F]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.3)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between gap-1">
        {/* 1. Direct Call Desk */}
        <a
          href={`tel:${cleanPhone}`}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-slate-300 hover:text-white active:bg-white/10 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
            <Phone className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold mt-1 tracking-tight">Call Desk</span>
        </a>

        {/* 2. Campus Directions */}
        <a
          href="https://maps.google.com/?q=St+Joseph+International+School+Narinda+Dhaka"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-slate-300 hover:text-white active:bg-white/10 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold mt-1 tracking-tight">Directions</span>
        </a>

        {/* 3. Latest Notices */}
        <Link
          href="/notices"
          className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-colors group ${
            pathname === '/notices'
              ? 'text-[#D4AF37]'
              : 'text-slate-300 hover:text-white active:bg-white/10'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
              pathname === '/notices'
                ? 'bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37]'
                : 'bg-white/5 border border-white/10 text-sky-400'
            }`}
          >
            <Bell className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold mt-1 tracking-tight">Notices</span>
        </Link>

        {/* 4. Apply Online Now CTA */}
        <div className="flex-1 pl-1">
          <Link
            href="/admission"
            className="flex flex-col items-center justify-center py-2 px-2.5 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#A00B22] text-white shadow-md shadow-[#C8102E]/30 active:scale-95 transition-all text-center"
          >
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[11px] font-extrabold tracking-tight whitespace-nowrap">Apply</span>
            </div>
            <span className="text-[8px] font-semibold text-amber-200/90 uppercase tracking-widest -mt-0.5">
              2026-27
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
