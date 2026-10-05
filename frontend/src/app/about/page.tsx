import React from 'react';
import { FadeImage as Image } from '@/components/ui/FadeImage';
import { Metadata } from 'next';
import {
  ShieldCheck,
  BookOpen,
  Users,
  HeartHandshake,
  Cpu,
  BookMarked,
  Music,
  Trophy,
  Award,
  History,
  Target,
  Sparkles,
} from 'lucide-react';
import { getAboutInfo } from '@/lib/api';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About Us - History, Mission & Leadership',
  description:
    'Discover the legacy, mission, leadership, and facilities of St. Joseph International School, Narinda, a Holy Cross institution in Old Dhaka.',
  path: '/about',
  keywords: ['SJIS Narinda history', 'Holy Cross Narinda', 'school administrator Narinda'],
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
  const about = await getAboutInfo();

  const getCoreValueIcon = (icon: string) => {
    switch (icon) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-7 h-7 text-[#D4AF37]" />;
      case 'BookOpen':
        return <BookOpen className="w-7 h-7 text-[#C8102E]" />;
      case 'Users':
        return <Users className="w-7 h-7 text-[#00183F]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-7 h-7 text-emerald-600" />;
      default:
        return <Sparkles className="w-7 h-7 text-[#D4AF37]" />;
    }
  };

  const getFacilityIcon = (icon: string) => {
    switch (icon) {
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-amber-500" />;
      case 'BookMarked':
        return <BookMarked className="w-6 h-6 text-rose-500" />;
      case 'Music':
        return <Music className="w-6 h-6 text-purple-500" />;
      case 'Trophy':
        return <Trophy className="w-6 h-6 text-emerald-500" />;
      default:
        return <Award className="w-6 h-6 text-[#D4AF37]" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header Banner */}
      <section className="relative py-24 bg-[#00183F] text-white overflow-hidden">
        <div className="absolute inset-0 bg-dots-pattern opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Badge variant="gold">Institutional Heritage</Badge>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            About St. Joseph Narinda
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {about.tagline || 'Fostering Academic Excellence & Moral Integrity'}
          </p>
        </div>
      </section>

      {/* Legacy & History Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <ScrollReveal direction="right" distance={30} duration={650} className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C8102E]">
                <History className="w-4 h-4" />
                Tradition of Distinction
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#00183F] tracking-tight">
                Our Illustrious Holy Cross Heritage
              </h2>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                {about.history}
              </p>

              <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-[#00183F] uppercase tracking-wider">
                  The Congregation of Holy Cross
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Founded by Blessed Father Basil Moreau, the Congregation of Holy Cross views education as the art of helping young people achieve their full potential. At St. Joseph Narinda, this vision is alive every day.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" distance={30} delay={150} duration={650} className="lg:col-span-6">
              <div className="relative h-96 sm:h-[480px] rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-100">
                <Image
                  src="https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1200&auto=format&fit=crop"
                  alt="St. Joseph Narinda Quadrangle"
                  fill
                  className="object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-20 bg-slate-100/70 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <ScrollReveal direction="up" distance={25} duration={600} className="h-full">
              <div className="h-full bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-[#C8102E]">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-[#00183F]">Our Sacred Mission</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  {about.mission}
                </p>
              </div>
            </ScrollReveal>

            {/* Vision */}
            <ScrollReveal direction="up" distance={25} delay={150} duration={600} className="h-full">
              <div className="h-full bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-200/80 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D4AF37]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-[#00183F]">Our Vision for Tomorrow</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  {about.vision}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Principal's Message Section */}
      <section id="principal" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" distance={30} duration={700}>
            <div className="bg-[#00183F] rounded-3xl p-8 sm:p-12 lg:p-16 text-white shadow-2xl relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-4 flex flex-col items-center text-center">
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-xl mb-4 bg-slate-800">
                    <Image
                      src={about.principal_image_url}
                      alt={about.principal_name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <h4 className="text-xl font-bold text-white">{about.principal_name}</h4>
                  <p className="text-xs sm:text-sm text-[#D4AF37] font-semibold mt-1">
                    {about.principal_title || 'Administrator'}
                  </p>
                </div>

                <div className="lg:col-span-8 space-y-4">
                  <Badge variant="gold">Message From {about.principal_title || 'Administrator'}</Badge>
                  <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                    &quot;Awakening Minds, Shaping Future Stewards&quot;
                  </h3>
                  <p className="text-slate-300 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                    {about.principal_message}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" distance={20} duration={600}>
            <SectionHeading
              badge="Guiding Principles"
              title="Our Four Pillars of Character"
              subtitle="The cornerstone virtues instilled into every Josephite from early childhood to graduation."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {about.core_values?.map((val, idx) => (
              <ScrollReveal
                key={idx}
                direction="up"
                distance={20}
                delay={idx * 80}
                duration={550}
                className="h-full"
              >
                <div
                  className="h-full bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 w-fit mb-5">
                      {getCoreValueIcon(val.icon)}
                    </div>
                    <h4 className="text-lg font-bold text-[#00183F] mb-2">{val.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Facilities Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" distance={20} duration={600}>
            <SectionHeading
              badge="Modern Infrastructure"
              title="World-Class Campus Facilities"
              subtitle="Providing our students with inspiring physical and digital learning environments."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {about.facilities?.map((fac, idx) => (
              <ScrollReveal
                key={idx}
                direction="up"
                distance={20}
                delay={idx * 80}
                duration={550}
                className="h-full"
              >
                <div
                  className="h-full p-8 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-5 hover:bg-slate-100/80 transition-colors"
                >
                  <div className="p-4 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-800 shrink-0">
                    {getFacilityIcon(fac.icon)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#00183F] mb-1">{fac.name}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{fac.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Button href="/admission" variant="secondary" size="lg">
              Apply For Admission 2026-2027
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
