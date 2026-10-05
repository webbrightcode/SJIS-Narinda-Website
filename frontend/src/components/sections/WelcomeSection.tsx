import React from 'react';
import { FadeImage as Image } from '@/components/ui/FadeImage';
import Link from 'next/link';
import { Quote, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AboutInfo } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

interface WelcomeSectionProps {
  about?: AboutInfo | null;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ about }) => {
  const defaultPillars = [
    'Cambridge Assessment International Education (CAIE)',
    'Dedicated Congregation of Holy Cross Mentorship',
    'Comprehensive STEM & Robotics Laboratories',
    'Champion Debating & Co-Curricular Guilds',
  ];

  const pillars = about?.pillars && Array.isArray(about.pillars) && about.pillars.length > 0
    ? about.pillars
    : defaultPillars;

  const headName = about?.principal_name || 'Brother Roktim Chiran, CSC';
  const headTitle = about?.principal_title || 'Administrator';
  const roleBadge = about?.head_role_badge || 'Head of Institution';
  const welcomeTag = about?.welcome_tag || 'Welcome to St. Joseph Narinda';
  const welcomeTitle = about?.welcome_title || 'Educating Hearts & Minds for Generations.';
  const heritageYears = about?.heritage_years || '70+';
  const heritageLabel = about?.heritage_label || 'Years of Heritage';
  const primaryBtnText = about?.primary_button_text || 'Read Full School History';
  const primaryBtnUrl = about?.primary_button_url || '/about';
  const secondaryBtnText = about?.secondary_button_text || 'Admission Information';
  const secondaryBtnUrl = about?.secondary_button_url || '/admission';

  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual & Head of Institution Card */}
          <div className="lg:col-span-5 relative">
            <ScrollReveal direction="right" distance={30} duration={700}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-slate-100">
                <Image
                  src={
                    about?.principal_image_url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
                  }
                  alt={headName}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00183F] via-transparent to-transparent opacity-90" />
                
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37] text-[#00183F] text-xs font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {roleBadge}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black">
                    {headName}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm font-medium">
                    {headTitle}
                  </p>
                </div>
              </div>

              {/* Floating Experience Badge */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 bg-[#00183F] text-white p-5 rounded-2xl shadow-xl border-2 border-[#D4AF37] hidden sm:block">
                <span className="block text-3xl font-black text-[#D4AF37]">
                  <AnimatedCounter value={heritageYears} duration={1800} />
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-300">
                  {heritageLabel}
                </span>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Head's Welcome & Institution Ethos */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="left" distance={30} delay={150} duration={700} className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#C8102E] uppercase">
                <span className="w-6 h-0.5 bg-[#C8102E]" />
                {welcomeTag}
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#00183F] leading-tight tracking-tight">
                {welcomeTitle}
              </h2>

              <div className="relative pl-6 sm:pl-7 border-l-4 border-[#D4AF37] py-3.5 pr-6 bg-gradient-to-r from-amber-50/50 via-amber-50/20 to-transparent rounded-r-2xl shadow-2xs">
                <Quote className="w-6 h-6 text-[#D4AF37] fill-[#D4AF37]/20 mb-2" />
                <p className="italic text-slate-700 text-base sm:text-lg leading-relaxed">
                  &ldquo;{about?.principal_message || 'Welcome to St. Joseph International School, Narinda. Our sacred mission has been to awaken intellectual curiosity and sculpt human character. True education prepares students for life through moral integrity, critical inquiry, and compassionate leadership.'}&rdquo;
                </p>
              </div>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                {about?.history ||
                  'Founded by the Congregation of Holy Cross, SJIS Narinda has remained steadfast in nurturing young minds through academic brilliance, moral fortitude, and compassionate service.'}
              </p>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {pillars.map((point, index) => (
                  <div key={index} className="flex items-center gap-2.5 text-sm font-semibold text-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-[#C8102E] shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                {primaryBtnText && (
                  <Button href={primaryBtnUrl} variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
                    {primaryBtnText}
                  </Button>
                )}
                {secondaryBtnText && (
                  <Button href={secondaryBtnUrl} variant="outline" size="md">
                    {secondaryBtnText}
                  </Button>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
