'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Search,
  Mail,
  Phone,
  ShieldCheck,
  Building2,
  Award,
  BookOpen,
  Users,
  Briefcase,
  ChevronRight,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  ClipboardList,
} from 'lucide-react';
import { StaffMember } from '@/lib/types';
import { getFacultyAndStaff } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export default function FacultyPage() {
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'admin' | 'teacher' | 'office' | 'staff'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);

  const getMemberPhoto = (m: StaffMember) => {
    if (m.image_url && !m.image_url.includes('unsplash.com')) {
      return m.image_url;
    }
    if (m.role_type === 'admin' || (m.name && m.name.toLowerCase().includes('roktim'))) {
      return '/administrator-roktim.webp';
    }
    return m.image_url || '/sjis-crest-logo.png';
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getFacultyAndStaff(true);
      setMembers(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filter members by role tab and search query
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (activeTab !== 'all' && m.role_type !== activeTab) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(query);
        const matchesDesignation = m.designation.toLowerCase().includes(query);
        const matchesDept = m.department ? m.department.toLowerCase().includes(query) : false;
        const matchesQual = m.qualification?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesignation && !matchesDept && !matchesQual) return false;
      }
      return true;
    });
  }, [members, activeTab, searchQuery]);

  const adminMembers = useMemo(
    () => filteredMembers.filter((m) => m.role_type === 'admin'),
    [filteredMembers]
  );
  const teacherMembers = useMemo(
    () => filteredMembers.filter((m) => m.role_type === 'teacher'),
    [filteredMembers]
  );
  const officeMembers = useMemo(
    () => filteredMembers.filter((m) => m.role_type === 'office'),
    [filteredMembers]
  );
  const staffMembers = useMemo(
    () => filteredMembers.filter((m) => m.role_type === 'staff'),
    [filteredMembers]
  );

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Hero Header Section */}
      <section className="relative bg-[#00183F] text-white pt-14 pb-16 overflow-hidden border-b-4 border-[#D4AF37]">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#C8102E]/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>St. Joseph International School • Faculty & Leadership</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Our Educators & Leadership Body
            </h1>
          </div>
        </div>
      </section>

      {/* Main Filter & Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 space-y-12">
        {/* Controls Bar: Role Tabs & Search Input */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xl border border-slate-200/90">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Primary Role Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl overflow-x-auto scrollbar-none">
              {[
                { id: 'all', label: 'All Members', icon: Users, count: members.length },
                {
                  id: 'admin',
                  label: 'Administration Body',
                  icon: Building2,
                  count: members.filter((m) => m.role_type === 'admin').length,
                },
                {
                  id: 'teacher',
                  label: 'Teachers (Faculty)',
                  icon: GraduationCap,
                  count: members.filter((m) => m.role_type === 'teacher').length,
                },
                {
                  id: 'office',
                  label: 'Office Staff',
                  icon: ClipboardList,
                  count: members.filter((m) => m.role_type === 'office').length,
                },
                {
                  id: 'staff',
                  label: 'Support Staff',
                  icon: Briefcase,
                  count: members.filter((m) => m.role_type === 'staff').length,
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#00183F] text-white shadow-md shadow-[#00183F]/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Instant Search Bar */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, subject, or role..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00183F] text-sm text-slate-800 placeholder-slate-400 bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 1: ADMINISTRATION BODY */}
        {(activeTab === 'all' || activeTab === 'admin') && adminMembers.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-end justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#C8102E] uppercase">
                  <span className="w-6 h-0.5 bg-[#C8102E]" />
                  Executive Leadership
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00183F] tracking-tight mt-1">
                  Administration Body & Governing Council
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {adminMembers.length} {adminMembers.length === 1 ? 'Leader' : 'Leaders'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {adminMembers.map((member, idx) => (
                <ScrollReveal
                  key={member.id}
                  direction="up"
                  distance={20}
                  delay={idx * 60}
                  duration={500}
                >
                  <div
                    onClick={() => setSelectedMember(member)}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Top gold accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00183F] via-[#D4AF37] to-[#C8102E]" />

                    <div>
                      {/* Big Portrait Photo */}
                      <div className="relative aspect-[4/4.5] w-full rounded-2xl overflow-hidden shadow-md mb-4 bg-slate-100 border border-slate-100">
                        <img
                          src={getMemberPhoto(member)}
                          alt={member.name}
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const fallback = member.role_type === 'admin' || member.name.toLowerCase().includes('roktim')
                              ? '/administrator-roktim.webp'
                              : '/sjis-crest-logo.png';
                            if (target.src !== fallback) {
                              target.src = fallback;
                            }
                          }}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#00183F]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3.5">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>View Executive Profile</span>
                            <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
                          </span>
                        </div>

                        {/* Top Leadership Badge */}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00183F]/90 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-300/40 shadow-sm">
                            <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                            Leadership
                          </span>
                        </div>
                      </div>

                      {/* Department / Council Tag */}
                      {member.department && (
                        <div className="mb-2">
                          <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/80 inline-block line-clamp-1">
                            {member.department.replace(/principal/gi, 'Administrator')}
                          </span>
                        </div>
                      )}

                      {/* Name & Title */}
                      <h3 className="text-base font-black text-[#00183F] group-hover:text-[#C8102E] transition-colors leading-snug">
                        {member.name}
                      </h3>
                      <p className="text-xs font-bold text-[#C8102E] mt-1 leading-snug">
                        {member.designation}
                      </p>

                      {/* Qualification */}
                      {member.qualification && (
                        <p className="text-xs text-slate-600 mt-2 flex items-start gap-1.5 leading-relaxed">
                          <GraduationCap className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{member.qualification}</span>
                        </p>
                      )}

                      {/* Executive Bio */}
                      {member.bio && (
                        <p className="mt-2.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {member.bio}
                        </p>
                      )}
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      {member.email ? (
                        <a
                          href={`mailto:${member.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[#00183F] hover:text-[#C8102E] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-500" />
                          <span>Official Contact</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Office of Administration</span>
                      )}

                      <span className="font-bold text-[11px] text-[#00183F] group-hover:text-[#C8102E] flex items-center gap-1 transition-colors">
                        View Profile
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: ACADEMIC FACULTY (TEACHERS) */}
        {(activeTab === 'all' || activeTab === 'teacher') && teacherMembers.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-end justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#00183F] uppercase">
                  <span className="w-6 h-0.5 bg-[#00183F]" />
                  Cambridge O & A Level Faculty
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00183F] tracking-tight mt-1">
                  Academic Teaching Faculty
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {teacherMembers.length} {teacherMembers.length === 1 ? 'Faculty Member' : 'Faculty Members'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teacherMembers.map((member, idx) => (
                <ScrollReveal
                  key={member.id}
                  direction="up"
                  distance={20}
                  delay={idx * 50}
                  duration={500}
                >
                  <div
                    onClick={() => setSelectedMember(member)}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div>
                      {/* Photo */}
                      <div className="relative aspect-[4/4.5] w-full rounded-2xl overflow-hidden shadow-md mb-4 bg-slate-100">
                        <img
                          src={getMemberPhoto(member)}
                          alt={member.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#00183F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-xs font-bold text-white flex items-center gap-1">
                            <span>Read Full Bio</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>

                        {member.is_featured && (
                          <div className="absolute top-2.5 left-2.5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00183F]/90 backdrop-blur-md text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-300/30 shadow-sm">
                              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                              Lead Faculty
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Department Tag */}
                      {member.department && (
                        <div className="mb-2">
                          <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80">
                            {member.department}
                          </span>
                        </div>
                      )}

                      {/* Name & Title */}
                      <h3 className="text-base font-black text-[#00183F] group-hover:text-[#C8102E] transition-colors leading-snug">
                        {member.name}
                      </h3>
                      <p className="text-xs font-bold text-slate-600 mt-1 leading-snug">
                        {member.designation}
                      </p>

                      {/* Qualification */}
                      {member.qualification && (
                        <p className="text-[11px] text-slate-500 mt-2 flex items-start gap-1 leading-relaxed">
                          <GraduationCap className="w-3.5 h-3.5 text-[#C8102E] shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{member.qualification}</span>
                        </p>
                      )}
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      {member.email ? (
                        <a
                          href={`mailto:${member.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-[#00183F] flex items-center gap-1 transition-colors text-slate-500"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-500" />
                          <span>Email</span>
                        </a>
                      ) : (
                        <span className="text-[11px]">Academic Staff</span>
                      )}

                      <span className="text-[11px] font-bold text-[#00183F] group-hover:text-[#C8102E] transition-colors">
                        Details →
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: OFFICE & ADMINISTRATIVE STAFF */}
        {(activeTab === 'all' || activeTab === 'office') && officeMembers.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-end justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#00183F] uppercase">
                  <span className="w-6 h-0.5 bg-[#00183F]" />
                  Institutional Coordination
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00183F] tracking-tight mt-1">
                  Office & Administrative Staff
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {officeMembers.length} {officeMembers.length === 1 ? 'Officer' : 'Officers'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {officeMembers.map((member, idx) => (
                <ScrollReveal
                  key={member.id}
                  direction="up"
                  distance={20}
                  delay={idx * 50}
                  duration={500}
                >
                  <div
                    onClick={() => setSelectedMember(member)}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div>
                      {/* Photo */}
                      <div className="relative aspect-[4/4] w-full rounded-2xl overflow-hidden shadow-md mb-4 bg-slate-100 border border-slate-200">
                        <img
                          src={getMemberPhoto(member)}
                          alt={member.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#00183F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                          <span className="text-xs font-bold text-white flex items-center gap-1">
                            <span>Read Full Bio</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>

                      {/* Department Tag */}
                      {member.department && (
                        <div className="mb-2">
                          <span className="text-[11px] font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/80">
                            {member.department}
                          </span>
                        </div>
                      )}

                      {/* Name & Title */}
                      <h3 className="text-base font-black text-[#00183F] group-hover:text-[#C8102E] transition-colors leading-snug">
                        {member.name}
                      </h3>
                      <p className="text-xs font-bold text-slate-600 mt-1 leading-snug">
                        {member.designation}
                      </p>

                      {/* Qualification */}
                      {member.qualification && (
                        <p className="text-[11px] text-slate-500 mt-2 flex items-start gap-1 leading-relaxed">
                          <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{member.qualification}</span>
                        </p>
                      )}
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      {member.email ? (
                        <a
                          href={`mailto:${member.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-[#00183F] flex items-center gap-1 transition-colors text-slate-500"
                        >
                          <Mail className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Email</span>
                        </a>
                      ) : (
                        <span className="text-[11px]">Office Staff</span>
                      )}

                      <span className="text-[11px] font-bold text-[#00183F] group-hover:text-[#C8102E] transition-colors">
                        Details →
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: SUPPORT & OPERATIONS STAFF */}
        {(activeTab === 'all' || activeTab === 'staff') && staffMembers.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-end justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-[#00183F] uppercase">
                  <span className="w-6 h-0.5 bg-[#00183F]" />
                  Operational Excellence
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#00183F] tracking-tight mt-1">
                  Support & Operations Staff
                </h2>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {staffMembers.length} {staffMembers.length === 1 ? 'Staff' : 'Staff Members'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffMembers.map((member, idx) => (
                <ScrollReveal
                  key={member.id}
                  direction="up"
                  distance={20}
                  delay={idx * 50}
                  duration={500}
                >
                  <div
                    onClick={() => setSelectedMember(member)}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex items-start gap-4 group"
                  >
                    <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-sm shrink-0 bg-slate-100 border border-slate-200">
                      <img
                        src={member.image_url || 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop'}
                        alt={member.name}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target.src !== 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop') {
                            target.src = 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop';
                          }
                        }}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      {member.department && (
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">
                          {member.department}
                        </span>
                      )}
                      <h3 className="text-base font-black text-[#00183F] group-hover:text-[#C8102E] transition-colors leading-snug truncate">
                        {member.name}
                      </h3>
                      <p className="text-xs font-bold text-[#C8102E] leading-snug">
                        {member.designation}
                      </p>

                      {member.qualification && (
                        <p className="text-[11px] text-slate-500 truncate pt-0.5">
                          {member.qualification}
                        </p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No faculty or staff found</h3>
            <p className="text-sm text-slate-500 mt-1">
              Try adjusting your search query or role filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#00183F] text-white text-xs font-bold hover:bg-[#082250] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Profile Detail Modal */}
      {selectedMember && (
        <Modal
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          title="Faculty & Staff Profile"
          subtitle="St. Joseph International School, Narinda"
          icon={<GraduationCap className="w-5 h-5 text-[#00183F]" />}
          badge={
            <Badge
              variant={
                selectedMember.role_type === 'admin'
                  ? 'gold'
                  : selectedMember.role_type === 'teacher'
                  ? 'navy'
                  : selectedMember.role_type === 'office'
                  ? 'crimson'
                  : 'slate'
              }
            >
              {selectedMember.role_type_display ||
                (selectedMember.role_type === 'admin'
                  ? 'Administration Body'
                  : selectedMember.role_type === 'teacher'
                  ? 'Teaching Faculty'
                  : selectedMember.role_type === 'office'
                  ? 'Office Staff'
                  : 'Support Staff')}
            </Badge>
          }
          maxWidth="2xl"
          footer={
            <div className="w-full flex items-center justify-end gap-2">
              {selectedMember.email && (
                <a
                  href={`mailto:${selectedMember.email}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00183F] hover:bg-[#092350] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Send Official Email</span>
                </a>
              )}
              <Button variant="outline" size="sm" onClick={() => setSelectedMember(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200/80">
              <div className="w-32 h-36 sm:w-36 sm:h-44 rounded-2xl overflow-hidden shadow-lg shrink-0 border-2 border-amber-300 bg-white">
                <img
                  src={getMemberPhoto(selectedMember)}
                  alt={selectedMember.name}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const fallback = selectedMember.role_type === 'admin' || selectedMember.name.toLowerCase().includes('roktim')
                      ? '/administrator-roktim.webp'
                      : '/sjis-crest-logo.png';
                    if (target.src !== fallback) {
                      target.src = fallback;
                    }
                  }}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                {selectedMember.department && (
                  <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                    {selectedMember.department}
                  </div>
                )}
                <h3 className="text-2xl font-black text-[#00183F] tracking-tight">
                  {selectedMember.name}
                </h3>
                <p className="text-sm font-bold text-[#C8102E]">
                  {selectedMember.designation}
                </p>

                {selectedMember.qualification && (
                  <div className="pt-2 flex items-start gap-2 text-xs font-semibold text-slate-700">
                    <GraduationCap className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{selectedMember.qualification}</span>
                  </div>
                )}

                {selectedMember.email && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <a href={`mailto:${selectedMember.email}`} className="text-[#00183F] font-bold hover:underline">
                      {selectedMember.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {selectedMember.bio && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Professional Biography & Pedagogical Focus
                </h4>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 text-sm text-slate-700 leading-relaxed space-y-2">
                  <p>{selectedMember.bio}</p>
                </div>
              </div>
            )}

          </div>
        </Modal>
      )}
    </div>
  );
}
