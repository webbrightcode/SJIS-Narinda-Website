import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
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
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers,
  Award,
  Users,
} from 'lucide-react';
import { getClubBySlug, getClubs } from '@/lib/api';
import { Club } from '@/lib/types';
import { buildMetadata, SCHOOL } from '@/lib/seo';
import { Badge } from '@/components/ui/Badge';
import { ClubGallery } from './ClubGallery';
import { OtherClubsSidebar } from './OtherClubsSidebar';

interface ClubDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: ClubDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const club = await getClubBySlug(slug);

  if (!club) {
    return {
      title: 'Guild Not Found',
      robots: { index: false, follow: false },
    };
  }

  const plain = club.description.replace(/\s+/g, ' ').trim();
  const description = plain.length > 155 ? `${plain.slice(0, 155).trim()}…` : plain;

  return buildMetadata({
    title: `${club.name} | Co-Curricular Guilds`,
    description: description || `Official co-curricular student guild at ${SCHOOL.name}.`,
    path: `/clubs/${club.slug}`,
    image: club.image_url,
    keywords: [
      club.name,
      'SJIS Narinda clubs',
      club.category_display || club.category,
      'St. Joseph student activities',
    ],
  });
}

export default async function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { slug } = await params;
  const [club, allClubs] = await Promise.all([
    getClubBySlug(slug),
    getClubs(),
  ]);

  if (!club) {
    notFound();
  }

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

  // Compile all images: cover photo + additional gallery photos
  const allImages = Array.from(
    new Set([club.image_url, ...(club.gallery_images || [])].filter(Boolean))
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Top Banner & Header */}
      <section className="relative bg-[#00183F] text-white pt-12 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00183F]/70 to-[#00183F] pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-300 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <Link href="/clubs" className="hover:text-white transition-colors">
              Co-Curricular Guilds
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#D4AF37] font-semibold truncate max-w-xs sm:max-w-md">
              {club.name}
            </span>
          </nav>

          {/* Header Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#C8102E] text-white shadow-xs">
                  {club.category_display || club.category}
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/10 text-white/90 backdrop-blur-md">
                  Active Student Society
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {club.name}
              </h1>

              {club.motto && (
                <p className="text-sm sm:text-base text-amber-300 font-medium italic">
                  &quot;{club.motto}&quot;
                </p>
              )}
            </div>

            {/* Back Button */}
            <div className="self-start md:self-auto shrink-0">
              <Link
                href="/clubs"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all shadow-md active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All Guilds</span>
              </Link>
            </div>
          </div>

          {/* Quick Meta Stats Row */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl pt-6 border-t border-white/10 text-xs">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10">
              <UserCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-300 block font-medium">Faculty Moderator</span>
                <span className="text-white font-bold truncate block">{club.moderator_name}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-300 block font-medium">Meeting Schedule</span>
                <span className="text-white font-bold truncate block">{club.schedule}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10">
              <Award className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-slate-300 block font-medium">Student Participation</span>
                <span className="text-white font-bold truncate block">Open to Grades VI – XII</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout with Sticky Right Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Featured Hero Banner Image */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md">
              <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-slate-900">
                <Image
                  src={club.image_url}
                  alt={club.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00183F] via-[#00183F]/30 to-transparent" />

                <div className="absolute top-5 left-5 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20">
                  {getClubIcon(club.icon_name)}
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-[#D4AF37] block mb-1">
                    Official Student Guild Photo
                  </span>
                  <p className="text-sm font-semibold text-white/95 leading-snug">
                    {club.name} • St. Joseph International School
                  </p>
                </div>
              </div>
            </div>

            {/* Guild Mission & Overview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-[#00183F]/5 border border-[#00183F]/10 flex items-center justify-center text-[#00183F]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#00183F] tracking-tight">Guild Mission & Scope</h2>
                  <p className="text-xs text-slate-500">Holistic development through hands-on practice</p>
                </div>
              </div>

              <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-3">
                <p>{club.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">
                    Leadership & Moderation
                  </span>
                  <span className="font-bold text-[#00183F] text-sm block mt-0.5">
                    {club.moderator_name}
                  </span>
                  <span className="text-slate-500 text-[11px] mt-0.5 block">
                    Oversees training modules, inter-school registrations & mentorship.
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block">
                    Regular Practice Hours
                  </span>
                  <span className="font-bold text-[#00183F] text-sm block mt-0.5">
                    {club.schedule}
                  </span>
                  <span className="text-slate-500 text-[11px] mt-0.5 block">
                    Held on Narinda campus grounds, designated laboratories or auditoriums.
                  </span>
                </div>
              </div>
            </div>

            {/* Core Activities & Training Modules */}
            {club.key_activities && club.key_activities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#00183F] tracking-tight">
                      Core Activities & Curriculum
                    </h3>
                    <p className="text-xs text-slate-500">Structured modules undertaken throughout the academic session</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {club.key_activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/70 flex items-start gap-3 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                        {activity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Honors, Awards & Distinctions */}
            {club.achievements && club.achievements.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#D4AF37] flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#00183F] tracking-tight">
                      Honors & Distinctions
                    </h3>
                    <p className="text-xs text-slate-500">National titles, olympiads, and inter-collegiate laurels</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {club.achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 to-amber-50/30 border border-amber-200/80 flex items-center gap-3.5"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-[#D4AF37] flex items-center justify-center shrink-0 shadow-2xs">
                        <Trophy className="w-4 h-4 text-amber-700" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-amber-950 leading-snug">
                        {ach}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo Gallery & Showcase (Option to display more images) */}
            <ClubGallery clubName={club.name} images={allImages} />
          </div>

          {/* Right Column / Sticky Sidebar (4 cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <OtherClubsSidebar
              currentClubId={club.id}
              currentCategory={club.category}
              clubs={allClubs}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
