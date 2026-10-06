'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  ExternalLink,
  Settings,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Cpu,
  BookMarked,
  Music,
  Trophy,
  FlaskConical,
  Laptop,
  Dumbbell,
  Palette,
  Wifi,
  Compass,
  ShieldCheck,
  HeartHandshake,
  Award,
} from 'lucide-react';
import { Facility, AboutInfo } from '@/lib/types';
import { getAboutInfo, updateAboutInfo } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

// Curated facility icon options
export const FACILITY_ICON_OPTIONS = [
  { id: 'Cpu', label: 'Robotics & STEM', icon: Cpu, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
  { id: 'BookMarked', label: 'Library & Research', icon: BookMarked, color: 'text-rose-500', bg: 'bg-rose-50 border-rose-200' },
  { id: 'Music', label: 'Auditorium & Arts', icon: Music, color: 'text-purple-500', bg: 'bg-purple-50 border-purple-200' },
  { id: 'Trophy', label: 'Sports Complex', icon: Trophy, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-200' },
  { id: 'FlaskConical', label: 'Science Laboratories', icon: FlaskConical, color: 'text-cyan-500', bg: 'bg-cyan-50 border-cyan-200' },
  { id: 'Laptop', label: 'IT & Computer Labs', icon: Laptop, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200' },
  { id: 'Dumbbell', label: 'Gymnasium & Fitness', icon: Dumbbell, color: 'text-orange-500', bg: 'bg-orange-50 border-orange-200' },
  { id: 'Palette', label: 'Fine Arts Studio', icon: Palette, color: 'text-pink-500', bg: 'bg-pink-50 border-pink-200' },
  { id: 'Building2', label: 'Campus Architecture', icon: Building2, color: 'text-indigo-500', bg: 'bg-indigo-50 border-indigo-200' },
  { id: 'Wifi', label: 'Smart Campus Network', icon: Wifi, color: 'text-teal-500', bg: 'bg-teal-50 border-teal-200' },
  { id: 'Compass', label: 'Guidance & Leadership', icon: Compass, color: 'text-violet-500', bg: 'bg-violet-50 border-violet-200' },
  { id: 'ShieldCheck', label: 'Perimeter Security', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  { id: 'HeartHandshake', label: 'Student Wellness', icon: HeartHandshake, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  { id: 'Sparkles', label: 'Innovation Hub', icon: Sparkles, color: 'text-[#D4AF37]', bg: 'bg-amber-50 border-amber-300' },
];

export const renderFacilityIcon = (iconName: string, className = 'w-6 h-6') => {
  const match = FACILITY_ICON_OPTIONS.find((opt) => opt.id.toLowerCase() === (iconName || '').toLowerCase());
  if (match) {
    const IconComponent = match.icon;
    return <IconComponent className={`${className} ${match.color}`} />;
  }
  return <Award className={`${className} text-[#D4AF37]`} />;
};

interface FacilitiesManagerProps {
  token?: string;
  onToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const FacilitiesManager: React.FC<FacilitiesManagerProps> = ({ token, onToast }) => {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Facility Form Modal State (Add / Edit)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<Facility>({
    name: '',
    desc: '',
    icon: 'Cpu',
  });

  // Section Settings Modal State (Badge, Title, Subtitle, CTA)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [sectionSettings, setSectionSettings] = useState({
    facilities_badge: 'Modern Infrastructure',
    facilities_title: 'World-Class Campus Facilities',
    facilities_subtitle: 'Providing our students with inspiring physical and digital learning environments.',
    facilities_cta_text: 'Apply For Admission 2026-2027',
    facilities_cta_link: '/admission',
  });

  // Delete Confirmation State
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const notify = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    if (onToast) {
      onToast(message, type);
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAboutInfo();
      setAboutInfo(data);
      setSectionSettings({
        facilities_badge: data.facilities_badge || 'Modern Infrastructure',
        facilities_title: data.facilities_title || 'World-Class Campus Facilities',
        facilities_subtitle:
          data.facilities_subtitle ||
          'Providing our students with inspiring physical and digital learning environments.',
        facilities_cta_text: data.facilities_cta_text || 'Apply For Admission 2026-2027',
        facilities_cta_link: data.facilities_cta_link || '/admission',
      });
    } catch {
      notify('Could not load campus facilities from server.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const facilities: Facility[] = useMemo(() => {
    return aboutInfo?.facilities || [];
  }, [aboutInfo]);

  const filteredFacilities = useMemo(() => {
    if (!searchQuery.trim()) return facilities;
    const q = searchQuery.toLowerCase();
    return facilities.filter(
      (f) => f.name.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q)
    );
  }, [facilities, searchQuery]);

  // Open Add Facility
  const handleOpenAdd = () => {
    setEditingIndex(null);
    setFormData({
      name: '',
      desc: '',
      icon: 'Cpu',
    });
    setIsModalOpen(true);
  };

  // Open Edit Facility
  const handleOpenEdit = (index: number) => {
    const item = facilities[index];
    if (!item) return;
    setEditingIndex(index);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  // Save Facility Item
  const handleSaveFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutInfo) return;
    if (!formData.name.trim() || !formData.desc.trim()) {
      notify('Please provide both a facility name and description.', 'error');
      return;
    }

    setSaving(true);
    const updatedList = [...facilities];
    if (editingIndex !== null) {
      updatedList[editingIndex] = { ...formData };
    } else {
      updatedList.push({ ...formData });
    }

    const payload: Partial<AboutInfo> = {
      ...aboutInfo,
      facilities: updatedList,
    };

    try {
      const saved = await updateAboutInfo(payload, token);
      if (saved) {
        setAboutInfo(saved);
        setIsModalOpen(false);
        notify(
          editingIndex !== null
            ? `Updated "${formData.name}" successfully!`
            : `Added "${formData.name}" to campus facilities!`
        );
      } else {
        notify('Could not save facility. Check authentication or server logs.', 'error');
      }
    } catch {
      notify('Server connection error while saving facility.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Facility
  const handleConfirmDelete = async () => {
    if (deleteIndex === null || !aboutInfo) return;
    const targetName = facilities[deleteIndex]?.name || 'Facility';
    setSaving(true);

    const updatedList = facilities.filter((_, idx) => idx !== deleteIndex);
    const payload: Partial<AboutInfo> = {
      ...aboutInfo,
      facilities: updatedList,
    };

    try {
      const saved = await updateAboutInfo(payload, token);
      if (saved) {
        setAboutInfo(saved);
        setDeleteIndex(null);
        notify(`Removed "${targetName}" from campus facilities.`);
      } else {
        notify('Failed to delete facility.', 'error');
      }
    } catch {
      notify('Network error deleting facility.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Reorder Item (Move up or down)
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!aboutInfo) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= facilities.length) return;

    const updatedList = [...facilities];
    const [movedItem] = updatedList.splice(index, 1);
    updatedList.splice(targetIndex, 0, movedItem);

    // Optimistic state
    setAboutInfo({
      ...aboutInfo,
      facilities: updatedList,
    });

    try {
      const saved = await updateAboutInfo({ ...aboutInfo, facilities: updatedList }, token);
      if (saved) {
        setAboutInfo(saved);
        notify(`Reordered "${movedItem.name}".`);
      }
    } catch {
      notify('Could not persist new order.', 'error');
      loadData();
    }
  };

  // Save Section Heading & CTA Settings
  const handleSaveSectionSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aboutInfo) return;
    setSaving(true);

    const payload: Partial<AboutInfo> = {
      ...aboutInfo,
      ...sectionSettings,
    };

    try {
      const saved = await updateAboutInfo(payload, token);
      if (saved) {
        setAboutInfo(saved);
        setIsSettingsModalOpen(false);
        notify('Campus facilities section header & CTA updated successfully!');
      } else {
        notify('Failed to update section settings.', 'error');
      }
    } catch {
      notify('Error updating section settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !aboutInfo) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#00183F]" />
        <p className="text-sm font-bold text-slate-600">Loading campus infrastructure...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Toolbar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Modern Infrastructure Manager</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#00183F] tracking-tight">
            Campus Facilities & Labs
          </h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Curate and reorder the modern physical infrastructure, specialized labs, and learning
            environments featured on the public About page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Customize Section Header & CTA</span>
          </button>

          <a
            href="/about#facilities"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all shadow-xs"
          >
            <ExternalLink className="w-4 h-4 text-slate-500" />
            <span>View Live Page</span>
          </a>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00183F] to-[#0A2E66] hover:from-[#0A2E66] hover:to-[#00183F] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>Add New Facility</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Stats Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search facilities by name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:ring-2 focus:ring-[#00183F] outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{facilities.length} Facilities Configured</span>
        </div>
      </div>

      {/* 3. Facilities Grid Cards */}
      {filteredFacilities.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#D4AF37] flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-bold text-[#00183F]">
              {searchQuery ? 'No matching facilities found' : 'No facilities registered yet'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {searchQuery
                ? 'Try clearing your search query to see all facilities.'
                : 'Click "Add New Facility" to showcase your school’s science labs, library, or sports complexes.'}
            </p>
          </div>
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-[#00183F] underline cursor-pointer"
            >
              Clear Search
            </button>
          ) : (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-[#00183F] text-white text-xs font-bold cursor-pointer"
            >
              Add First Facility
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFacilities.map((facility, idx) => {
            const actualIndex = facilities.indexOf(facility);
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-amber-400/80 p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs group-hover:bg-amber-50/50 group-hover:border-amber-200 transition-colors">
                        {renderFacilityIcon(facility.icon, 'w-6 h-6')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            #{actualIndex + 1}
                          </span>
                          <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider">
                            {facility.icon || 'Facility'}
                          </span>
                        </div>
                        <h4 className="text-base sm:text-lg font-black text-[#00183F] mt-0.5 leading-snug">
                          {facility.name}
                        </h4>
                      </div>
                    </div>

                    {/* Order buttons */}
                    <div className="flex items-center gap-1 shrink-0 bg-slate-50 p-1 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => handleMove(actualIndex, 'up')}
                        disabled={actualIndex === 0}
                        title="Move Up"
                        className="p-1 rounded text-slate-400 hover:text-[#00183F] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(actualIndex, 'down')}
                        disabled={actualIndex === facilities.length - 1}
                        title="Move Down"
                        className="p-1 rounded text-slate-400 hover:text-[#00183F] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {facility.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Displayed on About Page
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(actualIndex)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-[#00183F] hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3 text-[#00183F]" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteIndex(actualIndex)}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Live Website Preview Card */}
      <div className="bg-gradient-to-br from-slate-900 to-[#00183F] p-8 rounded-3xl text-white space-y-6 shadow-xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
              Live Preview
            </span>
            <h3 className="text-xl font-black text-white mt-1">
              {sectionSettings.facilities_title || 'World-Class Campus Facilities'}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {sectionSettings.facilities_subtitle}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-white/15 self-start">
            Badge: {sectionSettings.facilities_badge}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {facilities.slice(0, 4).map((f, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5 backdrop-blur-xs"
            >
              <div className="p-2.5 rounded-xl bg-white/10 text-white shrink-0">
                {renderFacilityIcon(f.icon, 'w-5 h-5')}
              </div>
              <div>
                <h5 className="text-sm font-bold text-white">{f.name}</h5>
                <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-center">
          <span className="px-5 py-2 rounded-xl bg-[#C8102E] text-white text-xs font-bold shadow-md">
            {sectionSettings.facilities_cta_text} →
          </span>
        </div>
      </div>

      {/* ---------------- MODAL: ADD / EDIT FACILITY ---------------- */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingIndex !== null ? 'Edit Campus Facility' : 'Add New Campus Facility'}
          subtitle="Configure name, description, and visual icon for this facility."
          icon={<Building2 className="w-5 h-5 text-[#00183F]" />}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveFacility} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Facility Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Advanced STEM & Robotics Complex"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none font-semibold text-[#00183F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Description & Equipment *
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Equipped with 3D printers, IoT kits, and specialized physics, chemistry, and biology laboratories."
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Concise 1–2 sentence description of key facilities, capacities, or equipment.
              </span>
            </div>

            {/* Visual Icon Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Choose Facility Icon & Theme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1 border border-slate-200 rounded-2xl bg-slate-50/50">
                {FACILITY_ICON_OPTIONS.map((opt) => {
                  const IconComp = opt.icon;
                  const isSelected = formData.icon === opt.id;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setFormData({ ...formData, icon: opt.id })}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#00183F] text-white border-[#00183F] shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg shrink-0 ${
                          isSelected ? 'bg-white/10 text-amber-300' : opt.bg
                        }`}
                      >
                        <IconComp className={`w-4 h-4 ${isSelected ? 'text-amber-300' : opt.color}`} />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold truncate">{opt.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Live Card Preview
              </span>
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 flex items-start gap-4 shadow-2xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 shrink-0">
                  {renderFacilityIcon(formData.icon)}
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#00183F]">
                    {formData.name || 'Facility Name Preview'}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                    {formData.desc || 'Equipment and facilities description will render here.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={saving}
                icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-[#D4AF37]" />}
              >
                {saving ? 'Saving...' : editingIndex !== null ? 'Save Changes' : 'Create Facility'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ---------------- MODAL: CONFIGURE SECTION HEADER & CTA ---------------- */}
      {isSettingsModalOpen && (
        <Modal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          title="Section Heading & Admission CTA"
          subtitle="Customize the titles, badges, and call-to-action button of the Campus Facilities section."
          icon={<Settings className="w-5 h-5 text-[#00183F]" />}
          maxWidth="md"
        >
          <form onSubmit={handleSaveSectionSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Eyebrow Badge Text
              </label>
              <input
                type="text"
                value={sectionSettings.facilities_badge}
                onChange={(e) =>
                  setSectionSettings({ ...sectionSettings, facilities_badge: e.target.value })
                }
                placeholder="MODERN INFRASTRUCTURE"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Title
              </label>
              <input
                type="text"
                value={sectionSettings.facilities_title}
                onChange={(e) =>
                  setSectionSettings({ ...sectionSettings, facilities_title: e.target.value })
                }
                placeholder="World-Class Campus Facilities"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-[#00183F] focus:ring-2 focus:ring-[#00183F] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Section Subtitle
              </label>
              <textarea
                rows={2}
                value={sectionSettings.facilities_subtitle}
                onChange={(e) =>
                  setSectionSettings({ ...sectionSettings, facilities_subtitle: e.target.value })
                }
                placeholder="Providing our students with inspiring physical and digital learning environments."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={sectionSettings.facilities_cta_text}
                  onChange={(e) =>
                    setSectionSettings({ ...sectionSettings, facilities_cta_text: e.target.value })
                  }
                  placeholder="Apply For Admission 2026-2027"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  CTA Button Link
                </label>
                <input
                  type="text"
                  value={sectionSettings.facilities_cta_link}
                  onChange={(e) =>
                    setSectionSettings({ ...sectionSettings, facilities_cta_link: e.target.value })
                  }
                  placeholder="/admission"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-[#00183F] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={saving}
                icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-[#D4AF37]" />}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ---------------- MODAL: DELETE CONFIRMATION ---------------- */}
      {deleteIndex !== null && (
        <Modal
          isOpen={deleteIndex !== null}
          onClose={() => setDeleteIndex(null)}
          title="Delete Campus Facility?"
          subtitle="Are you sure you want to remove this facility from public display?"
          icon={<AlertCircle className="w-5 h-5 text-rose-600" />}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              You are about to delete{' '}
              <strong className="text-[#00183F] font-bold">
                &ldquo;{facilities[deleteIndex]?.name}&rdquo;
              </strong>
              . This will immediately remove it from the school&apos;s About page.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteIndex(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
