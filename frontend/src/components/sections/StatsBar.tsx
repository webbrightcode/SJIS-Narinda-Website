'use client';

import React from 'react';
import { Users, GraduationCap, Award, BookOpen, Trophy } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

interface StatsBarProps {
  stats?: Record<string, string>;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  const statItems = [
    {
      label: stats?.students_label || 'Enrolled Students',
      value: stats?.students || '500+',
      icon: Users,
      color: 'text-amber-400',
    },
    {
      label: stats?.faculty_label || 'Certified Faculty',
      value: stats?.faculty || '60+',
      icon: GraduationCap,
      color: 'text-rose-400',
    },
    {
      label: stats?.pass_rate_label || 'Cambridge Pass Rate',
      value: stats?.pass_rate || '100%',
      icon: Award,
      color: 'text-emerald-400',
    },
    {
      label: stats?.clubs_label || 'Co-Curricular Clubs',
      value: stats?.clubs || '15+',
      icon: BookOpen,
      color: 'text-sky-400',
    },
    {
      label: stats?.national_awards_label || stats?.awards_label || 'National Awards',
      value: stats?.national_awards || stats?.awards || '85+',
      icon: Trophy,
      color: 'text-amber-300',
    },
  ];

  return (
    <div className="hidden md:block relative -mt-10 sm:-mt-14 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal direction="up" distance={20} duration={700}>
        <div className="bg-[#00183F] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {statItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`flex flex-col items-center text-center ${
                    idx > 0 ? 'pt-4 lg:pt-0 lg:px-4' : 'lg:pr-4'
                  }`}
                >
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 mb-3 transform hover:scale-110 transition-transform duration-300">
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    <AnimatedCounter value={item.value} duration={1600 + idx * 100} />
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};
