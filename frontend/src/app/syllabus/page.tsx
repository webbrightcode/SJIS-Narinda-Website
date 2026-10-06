import React from 'react';
import { BookOpen, Sparkles, GraduationCap } from 'lucide-react';
import { getSyllabus } from '@/lib/api';
import SyllabusClientView from '@/components/syllabus/SyllabusClientView';

export const revalidate = 60;

export default async function SyllabusPage() {
  const syllabi = await getSyllabus('all', 'all', '', 'all', true);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-[#00183F] text-white">
        <div className="absolute -top-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-[#D4AF37]/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-[26rem] h-[26rem] rounded-full bg-[#C8102E]/20 blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" /> Cambridge Assessment International Education
          </span>
          <h1 className="mt-5 text-4xl sm:text-6xl font-black tracking-tight text-balance">
            Academic <span className="text-[#D4AF37]">Syllabus</span> &amp; Curriculum
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Download comprehensive term guidelines, curriculum maps, assessment rubrics, and recommended booklists for Playgroup through Cambridge International A Levels.
          </p>
        </div>
        
        <div className="h-1.5 bg-gradient-to-r from-[#00183F] via-[#D4AF37] to-[#C8102E]" />
      </section>

      {/* Main Syllabus Body */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SyllabusClientView initialItems={syllabi} />
        </div>
      </section>
    </div>
  );
}
