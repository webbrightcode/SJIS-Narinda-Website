'use client';

import React, { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { useSiteSettings } from '@/components/layout/SiteSettingsContext';

export const BrandSplash: React.FC = () => {
  const site = useSiteSettings();
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Only show once per browser session
    try {
      if (sessionStorage.getItem('sjis_intro_seen')) {
        return;
      }
    } catch {
      return;
    }

    setVisible(true);

    const timer1 = setTimeout(() => {
      setFading(true);
    }, 700);

    const timer2 = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem('sjis_intro_seen', '1');
      } catch {}
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      onClick={() => setVisible(false)}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#00183F] text-white transition-opacity duration-300 select-none cursor-pointer ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center space-y-4 px-6 animate-in fade-in zoom-in-95 duration-500">
        {/* Crest */}
        <div className="relative">
          <div className="h-28 max-w-[280px] flex items-center justify-center">
            <img
              src={site.logo_url || '/sjis-crest-logo.png'}
              alt={site.school_name || 'Logo'}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/sjis-crest-logo.png';
              }}
              className="max-h-28 w-auto object-contain rounded-2xl shadow-2xl drop-shadow-2xl"
            />
          </div>
          <span className="absolute -inset-1 rounded-2xl bg-[#D4AF37]/30 blur-md -z-10 animate-pulse" />
        </div>

        {/* Titles */}
        <div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-black tracking-tight text-white">
            {site.school_name || 'St. Joseph International School'}
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-[#D4AF37] uppercase tracking-widest mt-1">
            {site.school_subtitle || 'Narinda, Dhaka'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-40 sm:w-48 h-1 rounded-full bg-white/10 overflow-hidden mt-2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] via-[#C8102E] to-[#D4AF37] animate-[splash-bar_0.75s_ease-out_forwards]" />
        </div>
      </div>
    </div>
  );
};
