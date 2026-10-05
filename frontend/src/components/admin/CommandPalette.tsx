'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  LayoutDashboard,
  Sliders,
  Bell,
  Users,
  Image as ImageIcon,
  UserCheck,
  DollarSign,
  Settings,
  Plus,
  FileSpreadsheet,
  Database,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  X,
  Sparkles,
} from 'lucide-react';
import { Notice, Club, AdmissionInquiry, GalleryItem, SliderSlide } from '@/lib/types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: any) => void;
  onAction: (actionKey: string) => void;
  notices: Notice[];
  clubs: Club[];
  inquiries: AdmissionInquiry[];
  gallery: GalleryItem[];
  slides: SliderSlide[];
  onSelectInquiry: (inq: AdmissionInquiry) => void;
  onEditNotice: (notice: Notice) => void;
  onEditClub: (club: Club) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onAction,
  notices,
  clubs,
  inquiries,
  gallery,
  slides,
  onSelectInquiry,
  onEditNotice,
  onEditClub,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const navItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard, category: 'Navigation' },
    { id: 'slides', label: 'Hero Sliders', icon: Sliders, category: 'Navigation' },
    { id: 'notices', label: 'Notice Board Circulars', icon: Bell, category: 'Navigation' },
    { id: 'clubs', label: 'Clubs & Guilds', icon: Users, category: 'Navigation' },
    { id: 'gallery', label: 'Media Gallery', icon: ImageIcon, category: 'Navigation' },
    { id: 'inquiries', label: 'Admissions Pipeline & Applications', icon: UserCheck, category: 'Navigation' },
    { id: 'admission_guide', label: 'Fees & Criteria Matrix', icon: DollarSign, category: 'Navigation' },
    { id: 'settings', label: 'Institutional Settings & Diagnostics', icon: Settings, category: 'Navigation' },
  ].filter((item) => q === '' || item.label.toLowerCase().includes(q));

  const actionItems = [
    { id: 'new_notice', label: 'Create New Circular Notice', icon: Plus, sub: 'Publish announcement live' },
    { id: 'new_slide', label: 'Add New Hero Banner Slide', icon: Plus, sub: 'Update homepage showcase' },
    { id: 'new_club', label: 'Register New Student Club', icon: Plus, sub: 'Add co-curricular activity' },
    { id: 'new_gallery', label: 'Upload Media to Gallery', icon: Plus, sub: 'Add event or campus photo' },
    { id: 'export_csv', label: 'Export Admissions to CSV', icon: FileSpreadsheet, sub: 'Download spreadsheet' },
    { id: 'backup_json', label: 'Download Full Database Backup', icon: Database, sub: 'JSON snapshot' },
    { id: 'restore_json', label: 'Restore Database from JSON Backup', icon: Database, sub: 'Disaster recovery' },
    { id: 'emergency_alert', label: 'Configure Campus Flash Alert', icon: AlertTriangle, sub: 'Broadcast emergency banner' },
  ].filter((item) => q === '' || item.label.toLowerCase().includes(q) || item.sub.toLowerCase().includes(q));

  const matchingNotices = q
    ? notices.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)).slice(0, 4)
    : [];

  const matchingClubs = q
    ? clubs.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)).slice(0, 4)
    : [];

  const matchingInquiries = q
    ? inquiries
        .filter(
          (i) =>
            i.student_name.toLowerCase().includes(q) ||
            i.parent_name.toLowerCase().includes(q) ||
            i.phone.includes(q) ||
            i.grade_applying.toLowerCase().includes(q)
        )
        .slice(0, 4)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#00183F] border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-black/20">
          <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, page name, notice, applicant, or club..."
            className="flex-1 bg-transparent text-sm sm:text-base outline-none text-white placeholder-slate-400 font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] uppercase font-bold text-slate-400 border border-white/20 px-2 py-0.5 rounded-md">
            ESC to close
          </span>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4 scrollbar-thin">
          {/* Quick Actions */}
          {actionItems.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#D4AF37]">
                Quick Actions & Tools
              </div>
              <div className="space-y-1">
                {actionItems.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={() => {
                        onAction(action.id);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/10 text-left transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 rounded-lg bg-white/10 text-[#D4AF37] group-hover:scale-110 transition-transform">
                          <Icon className="w-4 h-4" />
                        </span>
                        <div>
                          <span className="block text-xs font-bold text-white">{action.label}</span>
                          <span className="block text-[10px] text-slate-400">{action.sub}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          {navItems.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Navigation & Tabs
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        onClose();
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-left transition-colors cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search Hits: Inquiries */}
          {matchingInquiries.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Applicants & Inquiries
              </div>
              <div className="space-y-1">
                {matchingInquiries.map((inq) => (
                  <button
                    key={inq.id}
                    onClick={() => {
                      onSelectInquiry(inq);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl hover:bg-white/10 text-left transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="block text-xs font-bold text-white">{inq.student_name}</span>
                      <span className="block text-[10px] text-slate-400">
                        {inq.grade_applying} • Parent: {inq.parent_name} • {inq.phone}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {inq.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Hits: Notices */}
          {matchingNotices.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-400">
                Notice Circulars
              </div>
              <div className="space-y-1">
                {matchingNotices.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      onEditNotice(n);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl hover:bg-white/10 text-left transition-colors cursor-pointer"
                  >
                    <div className="truncate mr-2">
                      <span className="block text-xs font-bold text-white truncate">{n.title}</span>
                      <span className="block text-[10px] text-slate-400">Published: {n.publish_date}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 shrink-0">
                      {n.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Hits: Clubs */}
          {matchingClubs.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-400">
                Student Clubs & Guilds
              </div>
              <div className="space-y-1">
                {matchingClubs.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onEditClub(c);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl hover:bg-white/10 text-left transition-colors cursor-pointer"
                  >
                    <div>
                      <span className="block text-xs font-bold text-white">{c.name}</span>
                      <span className="block text-[10px] text-slate-400">{c.moderator_name}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                      {c.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {q &&
            actionItems.length === 0 &&
            navItems.length === 0 &&
            matchingInquiries.length === 0 &&
            matchingNotices.length === 0 &&
            matchingClubs.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs">
                No commands or content matched &quot;{query}&quot;.
              </div>
            )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="p-3 border-t border-white/10 bg-black/40 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>St. Joseph International School Command Hub</span>
          </div>
          <span>Tip: Press ⌘K anywhere to open</span>
        </div>
      </div>
    </div>
  );
};
