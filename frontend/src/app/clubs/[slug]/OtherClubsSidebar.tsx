'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FadeImage as Image } from '@/components/ui/FadeImage';
import {
  Cpu,
  Mic,
  Music,
  Terminal,
  Trophy,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  Clock,
  Compass,
} from 'lucide-react';
import { Club } from '@/lib/types';

interface OtherClubsSidebarProps {
  currentClubId: number;
  currentCategory?: string;
  clubs: Club[];
}

export function OtherClubsSidebar({
  currentClubId,
  currentCategory,
  clubs,
}: OtherClubsSidebarProps) {
  const [search, setSearch] = useState('');

  const getClubIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'cpu':
        return <Cpu className="w-3.5 h-3.5 text-amber-500" />;
      case 'mic':
        return <Mic className="w-3.5 h-3.5 text-rose-500" />;
      case 'music':
        return <Music className="w-3.5 h-3.5 text-purple-500" />;
      case 'terminal':
        return <Terminal className="w-3.5 h-3.5 text-sky-500" />;
      case 'trophy':
        return <Trophy className="w-3.5 h-3.5 text-amber-500" />;
      case 'hearthandshake':
        return <HeartHandshake className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  const filteredClubs = clubs.filter((c) => {
    // Search match
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchDesc = c.description.toLowerCase().includes(q);
      const matchCat = (c.category_display || c.category || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Main Switcher Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00183F]/5 border border-[#00183F]/10 flex items-center justify-center text-[#00183F]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-[#00183F] text-sm tracking-tight">
                Switch Student Guild
              </h3>
              <p className="text-[11px] text-slate-500">Explore other co-curricular societies</p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {clubs.length} Total
          </span>
        </div>

        {/* Search input */}
        <div className="mt-4 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search other clubs..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-[#00183F] focus:border-[#00183F] outline-hidden placeholder:text-slate-400"
          />
        </div>



        {/* Club list items */}
        <div className="mt-4 space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
          {filteredClubs.map((club) => {
            const isCurrent = club.id === currentClubId;
            const href = `/clubs/${club.slug || club.id}`;

            if (isCurrent) {
              return (
                <div
                  key={club.id}
                  className="p-3 rounded-2xl bg-amber-50/70 border border-amber-300/80 flex items-center gap-3 relative overflow-hidden"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                    <Image
                      src={club.image_url}
                      alt={club.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider bg-amber-100 px-1.5 py-0.5 rounded-md">
                        Current Guild
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-[#00183F] truncate mt-1">
                      {club.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {club.schedule}
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                </div>
              );
            }

            return (
              <Link
                key={club.id}
                href={href}
                className="group p-2.5 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center gap-3 cursor-pointer"
              >
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                  <Image
                    src={club.image_url}
                    alt={club.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1 left-1 p-0.5 rounded-md bg-black/60 text-white">
                    {getClubIcon(club.icon_name)}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                      {club.category_display || club.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#00183F] group-hover:text-[#C8102E] truncate transition-colors">
                    {club.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    Moderator: {club.moderator_name}
                  </p>
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#00183F] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            );
          })}

          {filteredClubs.length === 0 && (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching clubs found for &quot;{search}&quot;.
            </div>
          )}
        </div>

        {/* View all directory footer link */}
        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <Link
            href="/clubs"
            className="text-xs font-bold text-[#00183F] hover:text-[#C8102E] transition-colors inline-flex items-center gap-1"
          >
            ← View All Clubs Directory
          </Link>
        </div>
      </div>

      {/* Inquiry & Joining CTA Card */}
      <div className="bg-gradient-to-br from-[#00183F] to-[#0a275e] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#D4AF37]">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="font-black text-white text-base leading-snug">
            Interested in Joining a Guild?
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            All registered Josephite students can join up to two co-curricular clubs at the start of each academic term through student affairs.
          </p>

          <div className="pt-2">
            <Link
              href="/admission"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#e5bc3b] text-[#00183F] font-bold text-xs shadow-md transition-colors"
            >
              Admissions & Student Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
