'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { Club } from '@/lib/types';
import { getClubs } from '@/lib/api';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

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
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                onClick={() => setSelectedClub(club)}
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

                    <div className="absolute top-4 right-4">
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
                        <span>{club.moderator_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="font-semibold text-slate-700">Meets:</span>
                        <span>{club.schedule}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#00183F] group-hover:text-[#C8102E] flex items-center gap-1.5 transition-colors">
                    Explore Activities & Achievements
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Club Modal */}
      {selectedClub && (
        <Modal
          isOpen={!!selectedClub}
          onClose={() => setSelectedClub(null)}
          title={selectedClub.name}
          subtitle={`Co-Curricular Guild • ${selectedClub.category_display || selectedClub.category}`}
          icon={getClubIcon(selectedClub.icon_name)}
          maxWidth="xl"
          footer={
            <div className="w-full flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Official Student Co-Curricular Guild • St. Joseph Narinda
              </span>
              <Button variant="primary" size="sm" onClick={() => setSelectedClub(null)}>
                Close Guild Profile
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="relative h-60 rounded-xl overflow-hidden bg-slate-900">
              <Image
                src={selectedClub.image_url}
                alt={selectedClub.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-amber-300 text-xs font-semibold italic">&quot;{selectedClub.motto}&quot;</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-bold text-[#00183F]">Guild Overview</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{selectedClub.description}</p>
            </div>

            {/* Moderator & Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Faculty Moderator</span>
                <span className="text-slate-800 font-bold text-sm">{selectedClub.moderator_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Schedule</span>
                <span className="text-slate-800 font-bold text-sm">{selectedClub.schedule}</span>
              </div>
            </div>

            {/* Key Activities */}
            {selectedClub.key_activities?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#00183F]">Core Activities & Training</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  {selectedClub.key_activities.map((act, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Achievements */}
            {selectedClub.achievements?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#00183F]">Honors & Distinctions</h4>
                <div className="space-y-1.5">
                  {selectedClub.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200/60 font-medium">
                      <Trophy className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
