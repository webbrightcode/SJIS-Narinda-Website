'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FadeImage as Image } from '@/components/ui/FadeImage';
import {
  Cpu,
  Mic,
  Music,
  Terminal,
  Trophy,
  HeartHandshake,
  Clock,
  UserCheck,
  CheckCircle,
  Filter,
  Sparkles,
  ArrowRight,
  Camera,
} from 'lucide-react';
import { Club } from '@/lib/types';
import { getClubs } from '@/lib/api';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function loadData() {
      const data = await getClubs();
      setClubs(data);
    }
    loadData();
  }, []);

  const categories = [
    { id: 'all', label: 'All Guilds' },
    { id: 'stem', label: 'STEM & Robotics' },
    { id: 'debate', label: 'Debate & Oratory' },
    { id: 'arts', label: 'Cultural & Arts' },
    { id: 'sports', label: 'Sports & Athletics' },
    { id: 'service', label: 'Social & Stewardship' },
  ];

  const filteredClubs = clubs.filter((c) => {
    if (selectedCategory === 'all') return true;
    return c.category === selectedCategory;
  });

  const getClubIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'cpu':
        return <Cpu className="w-5 h-5 text-amber-400" />;
      case 'mic':
        return <Mic className="w-5 h-5 text-rose-400" />;
      case 'music':
        return <Music className="w-5 h-5 text-purple-400" />;
      case 'terminal':
        return <Terminal className="w-5 h-5 text-sky-400" />;
      case 'trophy':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'hearthandshake':
        return <HeartHandshake className="w-5 h-5 text-emerald-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <section className="relative py-20 bg-[#00183F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="gold">Holistic Character Formation</Badge>
          <h1 className="mt-4 text-4xl sm:text-5xl font-black tracking-tight text-white">
            Student Clubs & Societies
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Over 24 student-run guilds empowering scientific innovation, oratory supremacy, cultural celebration, and selfless service.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#00183F] text-white shadow-md shadow-[#00183F]/20'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Clubs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClubs.map((club) => {
              const detailUrl = `/clubs/${club.slug || club.id}`;
              const photosCount = (club.gallery_images?.length || 0) + (club.image_url ? 1 : 0);

              return (
                <Link
                  key={club.id}
                  href={detailUrl}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    {/* Banner Image */}
                    <div className="relative h-52 w-full overflow-hidden bg-slate-900">
                      <Image
                        src={club.image_url}
                        alt={club.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#00183F] via-[#00183F]/30 to-transparent" />

                      <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20">
                        {getClubIcon(club.icon_name)}
                      </div>

                      <div className="absolute top-4 right-4 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#C8102E] text-white">
                          {club.category_display || club.category}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-xl font-bold leading-tight group-hover:text-amber-300 transition-colors">
                          {club.name}
                        </h3>
                        {club.motto && (
                          <p className="text-xs text-amber-200/90 font-medium italic mt-1">
                            &quot;{club.motto}&quot;
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-6 space-y-4">
                      <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                        {club.description}
                      </p>

                      {/* Schedule & Moderator */}
                      <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-3.5 h-3.5 text-[#C8102E]" />
                          <span className="font-semibold text-slate-700">Moderator:</span>
                          <span className="truncate">{club.moderator_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span className="font-semibold text-slate-700">Meets:</span>
                          <span className="truncate">{club.schedule}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Link */}
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#00183F] group-hover:text-[#C8102E] flex items-center gap-1.5 transition-colors">
                      View Guild Details & Gallery
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                    {photosCount > 1 && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        <Camera className="w-3 h-3 text-[#D4AF37]" />
                        {photosCount} photos
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
