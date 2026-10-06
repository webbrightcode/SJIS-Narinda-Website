'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  History,
  Target,
  ShieldCheck,
  HeartHandshake,
  Users,
  Award,
  Save,
  Loader2,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Building2,
  CheckCircle2,
  ImageIcon,
  Quote,
} from 'lucide-react';
import { AboutInfo, CoreValue } from '@/lib/types';
import { getAboutInfo, updateAboutInfo } from '@/lib/api';
import { ImageHelper } from './ImageHelper';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface AboutPageManagerProps {
  token?: string;
  onToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onSwitchTab?: (tab: string) => void;
}

const VALUE_ICON_OPTIONS = [
  { id: 'ShieldCheck', label: 'Shield / Integrity', icon: ShieldCheck, color: 'text-[#D4AF37]' },
  { id: 'BookOpen', label: 'Book / Wisdom', icon: BookOpen, color: 'text-[#C8102E]' },
  { id: 'Users', label: 'Community / Unity', icon: Users, color: 'text-[#00183F]' },
  { id: 'HeartHandshake', label: 'Service / Empathy', icon: HeartHandshake, color: 'text-emerald-600' },
  { id: 'Sparkles', label: 'Excellence / Innovation', icon: Sparkles, color: 'text-amber-500' },
  { id: 'Target', label: 'Target / Mission', icon: Target, color: 'text-rose-500' },
  { id: 'Award', label: 'Award / Honor', icon: Award, color: 'text-indigo-600' },
];

export const AboutPageManager: React.FC<AboutPageManagerProps> = ({
  token,
  onToast,
  onSwitchTab,
}) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [about, setAbout] = useState<AboutInfo | null>(null);

  // Core Value modal state
  const [valueModalOpen, setValueModalOpen] = useState(false);
  const [editingValueIndex, setEditingValueIndex] = useState<number | null>(null);
  const [valueForm, setValueForm] = useState<CoreValue>({
    title: '',
    desc: '',
    icon: 'ShieldCheck',
  });

  const fetchAbout = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAboutInfo();
      setAbout(data);
    } catch {
      onToast('Failed to load About page information', 'error');
    } finally {
      setLoading(false);
    }
  }, [onToast]);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!about) return;

    try {
      setSaving(true);
      const res = await updateAboutInfo(about, token);
      if (res) {
        setAbout(res);
        onToast('About page settings updated successfully!', 'success');
      } else {
        onToast('Failed to save settings to server', 'error');
      }
    } catch {
      onToast('Error saving About page information', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Core Values Handlers
  const handleOpenAddValue = () => {
    setEditingValueIndex(null);
    setValueForm({
      title: '',
      desc: '',
      icon: 'ShieldCheck',
    });
    setValueModalOpen(true);
  };

  const handleOpenEditValue = (idx: number) => {
    if (!about?.core_values?.[idx]) return;
    setEditingValueIndex(idx);
    setValueForm({ ...about.core_values[idx] });
    setValueModalOpen(true);
  };

  const handleSaveValue = () => {
    if (!about) return;
    if (!valueForm.title.trim()) {
      onToast('Please enter a title for the core value', 'error');
      return;
    }

    const currentValues = about.core_values ? [...about.core_values] : [];
    if (editingValueIndex !== null) {
      currentValues[editingValueIndex] = valueForm;
    } else {
      currentValues.push(valueForm);
    }

    setAbout({ ...about, core_values: currentValues });
    setValueModalOpen(false);
    onToast(
      editingValueIndex !== null ? 'Core value updated!' : 'New core value added!',
      'info'
    );
  };

  const handleDeleteValue = (idx: number) => {
    if (!about?.core_values) return;
    const currentValues = [...about.core_values];
    currentValues.splice(idx, 1);
    setAbout({ ...about, core_values: currentValues });
    onToast('Core value removed', 'info');
  };

  const handleMoveValue = (idx: number, direction: 'up' | 'down') => {
    if (!about?.core_values) return;
    const currentValues = [...about.core_values];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentValues.length) return;

    const temp = currentValues[idx];
    currentValues[idx] = currentValues[targetIdx];
    currentValues[targetIdx] = temp;

    setAbout({ ...about, core_values: currentValues });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <Loader2 className="w-8 h-8 animate-spin text-[#00183F] mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-600">Loading About Us page configuration...</p>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
        <p className="text-sm text-rose-600">Failed to load About page configuration.</p>
        <button
          onClick={fetchAbout}
          className="mt-3 px-4 py-2 bg-[#00183F] text-white text-xs font-bold rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            Live Page Content Controller
          </div>
          <h2 className="text-2xl font-black text-[#00183F]">About Us Page Customizer</h2>
          <p className="text-xs text-slate-500 mt-1">
            Every section, text, photo, and pillar on{' '}
            <code className="text-xs font-mono bg-slate-100 px-1 py-0.5 rounded text-[#00183F]">
              /about
            </code>{' '}
            is fully dynamic and editable below.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/about"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <span>Preview Live /about</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <Button
            onClick={() => handleSave()}
            disabled={saving}
            variant="primary"
            size="md"
            icon={
              saving ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Save className="w-4 h-4 text-[#D4AF37]" />
              )
            }
          >
            {saving ? 'Saving Changes...' : 'Save All Changes'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: HERO BANNER */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00183F] text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#00183F] uppercase tracking-wider">
                  Page Header Hero Banner
                </h3>
                <p className="text-[11px] text-slate-500">
                  The primary blue banner showcased at the top of the About page.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Top Hero
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Hero Badge Text
              </label>
              <input
                type="text"
                value={about.about_badge || ''}
                placeholder="Institutional Heritage"
                onChange={(e) => setAbout({ ...about, about_badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#00183F] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Main Page Heading (H1)
              </label>
              <input
                type="text"
                value={about.about_title || about.title || ''}
                placeholder="About St. Joseph Narinda"
                onChange={(e) => setAbout({ ...about, about_title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-[#00183F] focus:ring-2 focus:ring-[#00183F] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={about.tagline || ''}
              placeholder="Fostering Academic Excellence & Moral Integrity"
              onChange={(e) => setAbout({ ...about, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00183F] outline-none"
            />
          </div>
        </div>

        {/* SECTION 2: LEGACY & HOLY CROSS HERITAGE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#C8102E] text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#00183F] uppercase tracking-wider flex items-center gap-2">
                  <History className="w-4 h-4 text-[#C8102E]" />
                  Tradition & Holy Cross Heritage
                </h3>
                <p className="text-[11px] text-slate-500">
                  The history story, spotlight card, and featured heritage photo on the right.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
              Heritage Section
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Eyebrow Badge Text
              </label>
              <input
                type="text"
                value={about.history_badge || ''}
                placeholder="Tradition of Distinction"
                onChange={(e) => setAbout({ ...about, history_badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-[#C8102E] focus:ring-2 focus:ring-[#00183F] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Section Heading (H2)
              </label>
              <input
                type="text"
                value={about.history_title || ''}
                placeholder="Our Illustrious Holy Cross Heritage"
                onChange={(e) => setAbout({ ...about, history_title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-[#00183F] focus:ring-2 focus:ring-[#00183F] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Narrative text & Spotlight card */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Historical Narrative / Main Paragraph
                </label>
                <textarea
                  rows={6}
                  value={about.history || ''}
                  placeholder="Decades of illustrious educational heritage in Old Dhaka..."
                  onChange={(e) => setAbout({ ...about, history: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs leading-relaxed focus:ring-2 focus:ring-[#00183F] outline-none"
                />
              </div>

              {/* Spotlight box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#00183F]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Heritage Spotlight Card</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={about.history_sub_title || ''}
                    placeholder="The Congregation of Holy Cross"
                    onChange={(e) => setAbout({ ...about, history_sub_title: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#00183F] focus:ring-2 focus:ring-[#00183F] outline-none bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Card Description
                  </label>
                  <textarea
                    rows={3}
                    value={about.history_sub_desc || ''}
                    placeholder="Founded by Blessed Father Basil Moreau, the Congregation of Holy Cross views education as the art of helping young people achieve their full potential..."
                    onChange={(e) => setAbout({ ...about, history_sub_desc: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-[#00183F] outline-none bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Right: Heritage Image uploader with live preview */}
            <div className="lg:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#00183F]" />
                <span className="text-xs font-bold uppercase text-slate-700">
                  Featured Heritage Photo
                </span>
              </div>

              <ImageHelper
                value={
                  about.history_image_url ||
                  'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1200&auto=format&fit=crop'
                }
                onChange={(url) => setAbout({ ...about, history_image_url: url })}
                label="Showcase Photo (JPG / PNG / WebP)"
              />
              <p className="text-[11px] text-slate-500">
                This image appears right next to the school heritage narrative on the About page.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: SACRED MISSION & VISION */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#00183F] uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#C8102E]" />
                  Mission & Vision Statements
                </h3>
                <p className="text-[11px] text-slate-500">
                  Side-by-side cards highlighting the foundational purpose of SJIS.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Dual Pillar Cards
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sacred Mission */}
            <div className="p-5 rounded-xl border border-rose-100 bg-rose-50/30 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
                <Target className="w-4 h-4" />
                <span>Mission Statement Card</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Card Heading
                </label>
                <input
                  type="text"
                  value={about.mission_title || ''}
                  placeholder="Our Sacred Mission"
                  onChange={(e) => setAbout({ ...about, mission_title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-bold text-[#00183F] focus:ring-2 focus:ring-[#00183F] outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Mission Statement
                </label>
                <textarea
                  rows={4}
                  value={about.mission || ''}
                  placeholder="To educate hearts and minds through rigorous intellectual training..."
                  onChange={(e) => setAbout({ ...about, mission: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs leading-relaxed focus:ring-2 focus:ring-[#00183F] outline-none bg-white"
                />
              </div>
            </div>

            {/* Vision for Tomorrow */}
            <div className="p-5 rounded-xl border border-amber-100 bg-amber-50/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Vision Statement Card</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Card Heading
                </label>
                <input
                  type="text"
                  value={about.vision_title || ''}
                  placeholder="Our Vision for Tomorrow"
                  onChange={(e) => setAbout({ ...about, vision_title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-bold text-[#00183F] focus:ring-2 focus:ring-[#00183F] outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                  Vision Statement
                </label>
                <textarea
                  rows={4}
                  value={about.vision || ''}
                  placeholder="To be the preeminent educational institution recognized globally..."
                  onChange={(e) => setAbout({ ...about, vision: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs leading-relaxed focus:ring-2 focus:ring-[#00183F] outline-none bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: ADMINISTRATOR'S MESSAGE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#00183F] text-white flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#00183F] uppercase tracking-wider flex items-center gap-2">
                  <Quote className="w-4 h-4 text-[#D4AF37]" />
                  Administrator&apos;s Message Section
                </h3>
                <p className="text-[11px] text-slate-500">
                  Featured message card with official portrait, title, and quotation.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
              Leadership Card
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Section Badge
              </label>
              <input
                type="text"
                value={about.message_badge || ''}
                placeholder="Message From the Administrator"
                onChange={(e) => setAbout({ ...about, message_badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#00183F] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Quotation Headline
              </label>
              <input
                type="text"
                value={about.message_headline || ''}
                placeholder='"Awakening Minds, Shaping Future Stewards"'
                onChange={(e) => setAbout({ ...about, message_headline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-[#00183F] focus:ring-2 focus:ring-[#00183F] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Administrator Welcome Statement
            </label>
            <textarea
              rows={5}
              value={about.principal_message || ''}
              placeholder="Welcome statement displayed in quotes..."
              onChange={(e) => setAbout({ ...about, principal_message: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs leading-relaxed focus:ring-2 focus:ring-[#00183F] outline-none"
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                {about.principal_image_url ? (
                  <img
                    src={about.principal_image_url}
                    alt={about.principal_name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-slate-400 m-2.5" />
                )}
              </div>
              <div>
                <span className="font-bold text-[#00183F] block">
                  {about.principal_name || 'Brother Roktim Chiran, CSC'}
                </span>
                <span className="text-slate-500 text-[11px]">
                  {about.principal_title || 'Administrator'} • Head of Institution
                </span>
              </div>
            </div>
            {onSwitchTab && (
              <button
                type="button"
                onClick={() => onSwitchTab('settings')}
                className="text-xs font-bold text-[#00183F] hover:text-[#C8102E] underline self-start sm:self-auto cursor-pointer"
              >
                Change Administrator Portrait or Title in Settings →
              </button>
            )}
          </div>
        </div>

        {/* SECTION 5: FOUR PILLARS / CORE VALUES */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                5
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#00183F] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Core Values & Pillars of Character
                </h3>
                <p className="text-[11px] text-slate-500">
                  Interactive values grid shown on the About page with custom badges, titles, and icons.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleOpenAddValue}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Core Value
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Section Badge
              </label>
              <input
                type="text"
                value={about.values_badge || ''}
                placeholder="Guiding Principles"
                onChange={(e) => setAbout({ ...about, values_badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#00183F] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Section Title
              </label>
              <input
                type="text"
                value={about.values_title || ''}
                placeholder="Our Four Pillars of Character"
                onChange={(e) => setAbout({ ...about, values_title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-[#00183F] focus:ring-2 focus:ring-[#00183F] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Section Subtitle
            </label>
            <input
              type="text"
              value={about.values_subtitle || ''}
              placeholder="The cornerstone virtues instilled into every Josephite from early childhood to graduation."
              onChange={(e) => setAbout({ ...about, values_subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#00183F] outline-none"
            />
          </div>

          {/* Core Values Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {about.core_values?.map((val, idx) => {
              const iconOption = VALUE_ICON_OPTIONS.find((opt) => opt.id === val.icon) || VALUE_ICON_OPTIONS[0];
              const IconComp = iconOption.icon;

              return (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between hover:border-slate-300 transition-colors space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                        <IconComp className={`w-5 h-5 ${iconOption.color}`} />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveValue(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                          title="Move left"
                        >
                          <ArrowUp className="w-3.5 h-3.5 rotate-[-90deg]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveValue(idx, 'down')}
                          disabled={idx === (about.core_values?.length || 0) - 1}
                          className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 cursor-pointer"
                          title="Move right"
                        >
                          <ArrowDown className="w-3.5 h-3.5 rotate-[-90deg]" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-[#00183F]">{val.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <button
                      type="button"
                      onClick={() => handleOpenEditValue(idx)}
                      className="text-[11px] font-bold text-[#00183F] hover:text-[#C8102E] flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteValue(idx)}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 6: CAMPUS FACILITIES SHORTCUT */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#00183F] shadow-2xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#00183F]">
                Campus Facilities Showcase ({about.facilities?.length || 0} configured)
              </h4>
              <p className="text-[11px] text-slate-500">
                Facilities also display at the bottom of the About page. Manage all facility cards, icons, and CTA links.
              </p>
            </div>
          </div>

          {onSwitchTab && (
            <button
              type="button"
              onClick={() => onSwitchTab('facilities')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00183F] text-white text-xs font-bold hover:bg-[#002866] transition-colors shadow-2xs shrink-0 cursor-pointer"
            >
              <span>Manage Campus Facilities Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Floating/Bottom Save Bar */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ready to apply changes to the live website.</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/about"
              target="_blank"
              className="text-xs font-bold text-slate-600 hover:text-[#00183F] hidden sm:block"
            >
              View /about
            </Link>

            <Button
              type="submit"
              disabled={saving}
              variant="primary"
              size="md"
              icon={
                saving ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Save className="w-4 h-4 text-[#D4AF37]" />
                )
              }
            >
              {saving ? 'Saving Changes...' : 'Save All Changes'}
            </Button>
          </div>
        </div>
      </form>

      {/* MODAL: ADD / EDIT CORE VALUE */}
      {valueModalOpen && (
        <Modal
          isOpen={valueModalOpen}
          onClose={() => setValueModalOpen(false)}
          title={editingValueIndex !== null ? 'Edit Core Value' : 'Add New Core Value'}
        >
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Core Value Title *
              </label>
              <input
                type="text"
                value={valueForm.title}
                onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })}
                placeholder="e.g. Faith & Moral Integrity"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-[#00183F] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Description / Instilled Virtue *
              </label>
              <textarea
                rows={3}
                value={valueForm.desc}
                onChange={(e) => setValueForm({ ...valueForm, desc: e.target.value })}
                placeholder="Cultivating honesty, spiritual grounding, and conscientious decision-making..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#00183F] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Card Icon
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {VALUE_ICON_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = valueForm.icon === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setValueForm({ ...valueForm, icon: opt.id })}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'border-[#00183F] bg-blue-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${opt.color}`} />
                      <span className="text-[10px] font-bold text-slate-700">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setValueModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveValue}
              >
                {editingValueIndex !== null ? 'Update Value' : 'Save Value'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
