'use client';

import React, { useState } from 'react';
import { FadeImage as Image } from '@/components/ui/FadeImage';
import Link from 'next/link';
import {
  Cpu,
  Mic,
  Music,
  Terminal,
  Trophy,
  HeartHandshake,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { Club } from '@/lib/types';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface ClubsShowcaseProps {
  clubs: Club[];
}

export const ClubsShowcase: React.FC<ClubsShowcaseProps> = ({ clubs }) => {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

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
    <section className="py-24 bg-[#00183F] text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#C8102E]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up" distance={24} duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="mb-2">
                <Badge variant="gold">Vibrant Student Life</Badge>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Clubs & Co-Curricular Guilds
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
                Fostering passions in robotics, debating, performing arts, competitive coding, and social stewardship.
              </p>
            </div>

            <Button
              href="/clubs"
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Explore All Clubs
            </Button>
          </div>
        </ScrollReveal>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.slice(0, 6).map((club, idx) => (
            <ScrollReveal
              key={club.id}
              direction="up"
              distance={20}
              delay={idx * 70}
              duration={550}
              className="h-full"
            >
              <div
                onClick={() => setSelectedClub(club)}
                className="h-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Image Banner */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#070F1E]">
                    <Image
                      src={club.image_url}
                      alt={club.name}
                      fill
                      fallbackSrc="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#00183F] via-[#00183F]/40 to-transparent" />

                    {/* Icon badge */}
                    <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/20">
                      {getClubIcon(club.icon_name)}
                    </div>

                    {/* Category */}
                    <div className="absolute top-4 right-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#C8102E] text-white">
                        {club.category_display || club.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                      {club.name}
                    </h3>

                    {club.motto && (
                      <p className="text-xs text-amber-300/90 font-medium italic mt-1">
                        &quot;{club.motto}&quot;
                      </p>
                    )}

                    <p className="text-slate-300 text-sm mt-3 line-clamp-2 leading-relaxed">
                      {club.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6 pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {club.schedule ? club.schedule.split(',')[0] : 'Weekly Meets'}
                  </span>
                  <span className="text-[#D4AF37] font-semibold group-hover:underline flex items-center gap-1">
                    View Club
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

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
            <div className="relative h-56 rounded-xl overflow-hidden bg-slate-900">
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

            <div className="space-y-3">
              <h4 className="text-base font-bold text-[#00183F]">About the Guild</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{selectedClub.description}</p>
            </div>

            {/* Moderator & Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Faculty Moderator</span>
                <span className="text-slate-800 font-bold text-sm">{selectedClub.moderator_name || 'Faculty Advisor'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Session Schedule</span>
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
                <h4 className="text-sm font-bold text-[#00183F]">Recent Accolades</h4>
                <div className="space-y-1.5">
                  {selectedClub.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-amber-900 bg-amber-50/80 p-2 rounded-lg border border-amber-200/60 font-medium">
                      <Trophy className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </section>
  );
};
