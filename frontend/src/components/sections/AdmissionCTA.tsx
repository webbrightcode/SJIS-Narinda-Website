import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export const AdmissionCTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#00183F] via-[#071936] to-[#0A2540] text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8102E]/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal direction="up" distance={30} duration={700}>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16 backdrop-blur-xl shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Admissions Open 2026-2027
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                Empower Your Child with a World-Class Josephite Education
              </h2>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                Applications are now accepted for Playgroup, Nursery, Grade I, and Grade VI through Grade XI.
                Limited seats available for the upcoming academic session.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Cambridge CAIE Curriculum</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Holistic Moral Formation</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  <span>Modern STEM & Sports Hub</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <Button
                href="/admission"
                variant="secondary"
                size="lg"
                className="w-full text-center py-4"
                icon={<ArrowRight className="w-5 h-5 text-white" />}
              >
                Apply Online Now
              </Button>

              <Button
                href="/admission#fees"
                variant="outline"
                size="md"
                className="w-full text-center border-white/30 text-white hover:bg-white/10"
                icon={<FileText className="w-4 h-4 text-[#D4AF37]" />}
              >
                View Tuition & Fee Schedule
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>Deadline: November 20, 2026</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
    </section>
  );
};
