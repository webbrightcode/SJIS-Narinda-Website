'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Edit,
  Phone,
  MapPin,
  Share2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Quote,
  Star,
  HelpCircle,
  Loader2,
  ExternalLink,
  GraduationCap,
  Building2,
  Users,
  Briefcase,
  Mail,
  Search,
} from 'lucide-react';
import { FAQ, HighlightItem, SiteSettings, Testimonial, StaffMember } from '@/lib/types';
import {
  DEFAULT_SITE_SETTINGS,
  deleteFaq,
  deleteTestimonial,
  getFaqs,
  getSiteSettings,
  getTestimonials,
  saveFaq,
  saveTestimonial,
  updateSiteSettings,
  getFacultyAndStaff,
  saveStaffMember,
  deleteStaffMember,
} from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { ImageHelper } from '@/components/admin/ImageHelper';

/* ---------- shared UI helpers ---------- */

const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-[#00183F] focus:border-transparent outline-none bg-white';
const labelCls = 'block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5';

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode; className?: string }> = ({
  label,
  hint,
  children,
  className = '',
}) => (
  <div className={className}>
    <label className={labelCls}>{label}</label>
    {children}
    {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
  </div>
);

const Card: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string; children: React.ReactNode }> = ({
  icon,
  title,
  subtitle,
  children,
}) => (
  <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-[#00183F] text-[#D4AF37] flex items-center justify-center">{icon}</div>
      <div>
        <h3 className="text-sm font-extrabold text-[#00183F]">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </section>
);

type Flash = { ok: boolean; text: string } | null;

const FlashBanner: React.FC<{ flash: Flash }> = ({ flash }) =>
  flash ? (
    <div
      className={`px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 border ${
        flash.ok ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
      }`}
    >
      {flash.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {flash.text}
    </div>
  ) : null;

const PageHeader: React.FC<{ title: string; subtitle: string; action?: React.ReactNode }> = ({
  title,
  subtitle,
  action,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
    <div>
      <h2 className="text-2xl font-black text-[#00183F] tracking-tight">{title}</h2>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </div>
    {action}
  </div>
);

const DeleteConfirmModal: React.FC<{
  isOpen: boolean;
  title: string;
  itemName?: string;
  message?: string;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, title, itemName, message, loading, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-600/30">
          <Trash2 className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-rose-950">Confirm Permanent Removal</h4>
          <p className="text-xs text-rose-800/90 mt-1 leading-relaxed">
            {message ||
              (itemName
                ? `Are you sure you want to permanently delete "${itemName}"? This action cannot be undone.`
                : 'Are you sure you want to delete this record? This action cannot be undone.')}
          </p>
        </div>
      </div>
      <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={onConfirm}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C8102E] hover:bg-[#A00B22] text-white flex items-center gap-1.5 shadow-md shadow-[#C8102E]/25 transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          <span>{loading ? 'Deleting…' : 'Delete Permanently'}</span>
        </button>
      </div>
    </div>
  </Modal>
);

const ICON_OPTIONS = ['Award', 'Heart', 'Trophy', 'BookOpen', 'Users', 'ShieldCheck', 'Star', 'Globe', 'Sparkles'];

/* ---------- Site Settings ---------- */

export const SiteSettingsPanel: React.FC<{ token?: string }> = ({ token }) => {
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<Flash>(null);

  useEffect(() => {
    getSiteSettings().then((d) => {
      setForm({ ...DEFAULT_SITE_SETTINGS, ...d });
      setLoading(false);
    });
  }, []);

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setHighlight = (i: number, patch: Partial<HighlightItem>) =>
    set(
      'highlights',
      form.highlights.map((h, idx) => (idx === i ? { ...h, ...patch } : h))
    );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const saved = await updateSiteSettings(form, token);
    setSaving(false);
    if (saved) {
      setForm({ ...DEFAULT_SITE_SETTINGS, ...saved });
      setFlash({ ok: true, text: 'Site settings published. The live website will show the changes immediately.' });
    } else {
      setFlash({ ok: false, text: 'Could not save settings. Please check the fields (URLs must start with https://).' });
    }
    setTimeout(() => setFlash(null), 5000);
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center text-slate-400 gap-2 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading settings…
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl">
      <PageHeader
        title="Website & Contact Settings"
        subtitle="Controls the top bar, footer, location section, hero highlights and quick-inquiry form across the public site."
        action={
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#00183F] hover:bg-[#0D2852] text-white text-sm font-bold flex items-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-[#D4AF37]" />}
            {saving ? 'Publishing…' : 'Save & Publish'}
          </button>
        }
      />
      <FlashBanner flash={flash} />

      <Card
        icon={<GraduationCap className="w-4 h-4" />}
        title="Institutional Branding & School Logo"
        subtitle="Upload or customize the official crest/logo and titles shown in the navigation bar and footer."
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="School Brand Name *" hint="Main brand heading, e.g. St. Joseph">
              <input
                required
                className={inputCls}
                value={form.school_name}
                onChange={(e) => set('school_name', e.target.value)}
              />
            </Field>
            <Field label="School Subtitle *" hint="Sub-heading under logo, e.g. INTERNATIONAL SCHOOL • NARINDA">
              <input
                required
                className={inputCls}
                value={form.school_subtitle}
                onChange={(e) => set('school_subtitle', e.target.value)}
              />
            </Field>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <ImageHelper
              label="Header & Footer Logo"
              value={form.logo_url || ''}
              onChange={(url) => set('logo_url', url)}
              required={false}
            />
            <p className="text-xs text-slate-500 mt-2">
              Upload a transparent PNG, SVG, or high-res image. If left blank, the website uses the official St. Joseph golden crest emblem.
            </p>
          </div>

          {/* Live Preview of Header & Footer Branding */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Live Navigation Bar & Footer Appearance</span>
              {form.logo_url && (
                <button
                  type="button"
                  onClick={() => set('logo_url', '')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                >
                  Reset to Default Crest Emblem
                </button>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#00183F] border border-white/10 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3.5">
                {form.logo_url ? (
                  <div className="h-16 max-w-[220px] flex items-center justify-center">
                    <img
                      src={form.logo_url}
                      alt={form.school_name || 'Logo preview'}
                      className="max-h-16 w-auto object-contain rounded-xl drop-shadow-md"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#C8102E] p-0.5 shadow-md flex items-center justify-center">
                    <div className="w-full h-full bg-[#00183F] rounded-[14px] flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-white font-extrabold text-lg sm:text-xl tracking-tight leading-tight">
                    {form.school_name || 'St. Joseph'}
                  </span>
                  <span className="text-slate-300 text-xs font-semibold tracking-wider uppercase">
                    {form.school_subtitle || 'INTERNATIONAL SCHOOL • NARINDA'}
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                Navbar Preview
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5A823] hover:from-[#E5A823] hover:to-[#D4AF37] text-[#00183F] text-xs font-black flex items-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-60 transition-all"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? 'Publishing Brand…' : 'Save & Publish Brand Logo'}</span>
              </button>
            </div>
          </div>
        </div>
      </Card>

      <Card icon={<Phone className="w-4 h-4" />} title="Contact & Office Hours" subtitle="Shown in the top bar, footer and Campus Location section.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Primary Phone *">
            <input required className={inputCls} value={form.phone_primary} onChange={(e) => set('phone_primary', e.target.value)} />
          </Field>
          <Field label="Secondary Phone">
            <input className={inputCls} value={form.phone_secondary} onChange={(e) => set('phone_secondary', e.target.value)} />
          </Field>
          <Field label="Email *">
            <input required type="email" className={inputCls} value={form.email} onChange={(e) => set('email', e.target.value)} />
          </Field>
          <Field label="WhatsApp Number" hint="Digits only with country code, e.g. 8801711234567">
            <input className={inputCls} value={form.whatsapp_number} onChange={(e) => set('whatsapp_number', e.target.value)} />
          </Field>
          <Field label="Office Hours *" hint="e.g. Sun – Thu · 7:30 AM – 4:30 PM">
            <input required className={inputCls} value={form.office_hours} onChange={(e) => set('office_hours', e.target.value)} />
          </Field>
          <Field label="Weekend / Holiday Note">
            <input className={inputCls} value={form.weekend_note} onChange={(e) => set('weekend_note', e.target.value)} />
          </Field>
          <Field label="Accreditation Label" hint="Shown as a gold badge in the top bar and footer. Leave empty to hide.">
            <input className={inputCls} value={form.accreditation_label} onChange={(e) => set('accreditation_label', e.target.value)} />
          </Field>
          <Field label="Security / Visitor Note" hint="Shown in the Campus Location card. Leave empty to hide.">
            <input className={inputCls} value={form.security_note} onChange={(e) => set('security_note', e.target.value)} />
          </Field>
        </div>
      </Card>

      <Card icon={<Sparkles className="w-4 h-4" />} title="Admissions Status Badge" subtitle="The red pill in the top bar.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
          <Field label="Badge Text">
            <input className={inputCls} value={form.admissions_label} onChange={(e) => set('admissions_label', e.target.value)} />
          </Field>
          <label className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
            <input
              type="checkbox"
              checked={form.admissions_open}
              onChange={(e) => set('admissions_open', e.target.checked)}
              className="w-4 h-4 accent-[#00183F]"
            />
            <span className="text-sm font-semibold text-slate-700">Show admissions badge on website</span>
          </label>
        </div>
      </Card>

      <Card icon={<Eye className="w-4 h-4" />} title="Notice Board & Public Circular Settings" subtitle="Configure notice display preferences, preview attachments, and reader engagement.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
          <label className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              checked={form.show_notice_views ?? true}
              onChange={(e) => set('show_notice_views', e.target.checked)}
              className="w-4 h-4 accent-[#00183F] rounded"
            />
            <div>
              <span className="text-sm font-bold text-slate-800 block">Display Viewers Count on Public Circulars</span>
              <span className="text-xs text-slate-500">Show live readers/viewers count badges on notice cards and inside the circular modal dialog.</span>
            </div>
          </label>
        </div>
      </Card>

      <Card icon={<MapPin className="w-4 h-4" />} title="Campus Location" subtitle="Address and interactive map.">
        <div className="space-y-5">
          <Field label="Full Address *" hint="Line breaks are preserved on the website.">
            <textarea required rows={3} className={inputCls} value={form.address} onChange={(e) => set('address', e.target.value)} />
          </Field>
          <Field
            label="Google Maps Embed URL"
            hint="In Google Maps: Share → Embed a map → copy only the src=… URL (must start with https://www.google.com/maps/embed)."
          >
            <input className={inputCls} value={form.map_embed_url} onChange={(e) => set('map_embed_url', e.target.value)} />
          </Field>
          <Field label="'Open in Google Maps' Link">
            <input className={inputCls} value={form.map_link} onChange={(e) => set('map_link', e.target.value)} />
          </Field>
          {form.map_embed_url && (
            <div className="rounded-xl overflow-hidden border border-slate-200 h-52">
              <iframe title="Map preview" src={form.map_embed_url} className="w-full h-full" loading="lazy" />
            </div>
          )}
        </div>
      </Card>

      <Card icon={<Sparkles className="w-4 h-4" />} title="Hero Highlights Card" subtitle="The glass card on the right side of the homepage hero (desktop).">
        <div className="space-y-3">
          {form.highlights.map((h, i) => (
            <div key={i} className="grid grid-cols-12 gap-3 items-center p-3 rounded-xl bg-slate-50 border border-slate-200">
              <select
                className={`${inputCls} col-span-12 sm:col-span-2`}
                value={h.icon}
                onChange={(e) => setHighlight(i, { icon: e.target.value })}
              >
                {ICON_OPTIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <input
                className={`${inputCls} col-span-12 sm:col-span-4`}
                placeholder="Title"
                value={h.title}
                onChange={(e) => setHighlight(i, { title: e.target.value })}
              />
              <input
                className={`${inputCls} col-span-10 sm:col-span-5`}
                placeholder="Short description"
                value={h.desc}
                onChange={(e) => setHighlight(i, { desc: e.target.value })}
              />
              <button
                type="button"
                onClick={() => set('highlights', form.highlights.filter((_, idx) => idx !== i))}
                className="col-span-2 sm:col-span-1 p-2 rounded-lg text-rose-600 hover:bg-rose-50 justify-self-center cursor-pointer"
                aria-label="Remove highlight"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {form.highlights.length < 5 && (
            <button
              type="button"
              onClick={() => set('highlights', [...form.highlights, { title: '', desc: '', icon: 'Award' }])}
              className="text-xs font-bold text-[#00183F] hover:text-[#C8102E] flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add highlight
            </button>
          )}
        </div>
      </Card>

      <Card icon={<Share2 className="w-4 h-4" />} title="Social & Inquiry Form" subtitle="Social links and the grade list used in the Quick Admissions Inquiry form.">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="Facebook URL">
            <input className={inputCls} placeholder="https://facebook.com/…" value={form.facebook_url} onChange={(e) => set('facebook_url', e.target.value)} />
          </Field>
          <Field label="Instagram URL">
            <input className={inputCls} placeholder="https://instagram.com/…" value={form.instagram_url} onChange={(e) => set('instagram_url', e.target.value)} />
          </Field>
          <Field label="YouTube URL">
            <input className={inputCls} placeholder="https://youtube.com/…" value={form.youtube_url} onChange={(e) => set('youtube_url', e.target.value)} />
          </Field>
        </div>
        <Field label="Inquiry Form Grade Options" hint="One grade per line." className="mt-5">
          <textarea
            rows={6}
            className={inputCls}
            value={form.inquiry_grades.join('\n')}
            onChange={(e) =>
              set(
                'inquiry_grades',
                e.target.value.split('\n').map((l) => l.trim()).filter(Boolean)
              )
            }
          />
        </Field>
      </Card>

      {/* Sticky Bottom Publish Bar */}
      <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-[#00183F] border border-white/10 shadow-2xl flex items-center justify-between text-white flex-wrap gap-4">
        <div>
          <div className="text-sm font-bold">Unsaved changes?</div>
          <div className="text-xs text-slate-300">Click publish to update the live public site, header, and footer instantly.</div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5A823] hover:from-[#E5A823] hover:to-[#D4AF37] text-[#00183F] text-sm font-black flex items-center gap-2 shadow-lg shadow-amber-500/30 cursor-pointer disabled:opacity-60 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Publishing All Changes…' : 'Save & Publish All Settings'}</span>
        </button>
      </div>
    </form>
  );
};

/* ---------- Generic list manager shell ---------- */

const Toggle: React.FC<{ active: boolean; onClick: () => void }> = ({ active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border cursor-pointer ${
      active
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
        : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
    }`}
  >
    {active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
    {active ? 'Live' : 'Hidden'}
  </button>
);

/* ---------- Testimonials ---------- */

const emptyTestimonial: Partial<Testimonial> = {
  name: '',
  role: '',
  badge: 'Parent Voice',
  avatar_url: '',
  quote: '',
  rating: 5,
  order: 0,
  is_active: true,
};

export const TestimonialsManager: React.FC<{ token?: string }> = ({ token }) => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<Flash>(null);

  const load = useCallback(async () => setItems(await getTestimonials(false)), []);
  useEffect(() => {
    load();
  }, [load]);

  const notify = (ok: boolean, text: string) => {
    setFlash({ ok, text });
    setTimeout(() => setFlash(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const saved = await saveTestimonial(editing, token);
    setSaving(false);
    if (saved) {
      notify(true, editing.id ? 'Testimonial updated.' : 'Testimonial added.');
      setEditing(null);
      load();
    } else notify(false, 'Could not save testimonial. Avatar must be a https:// URL.');
  };

  const [deletingItem, setDeletingItem] = useState<Testimonial | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const confirmDelete = async () => {
    if (!deletingItem) return;
    const target = deletingItem;
    setDeleteLoading(true);
    // Optimistic UI removal
    setItems((prev) => prev.filter((i) => i.id !== target.id));
    setDeletingItem(null);

    const ok = await deleteTestimonial(target.id, token);
    setDeleteLoading(false);
    if (ok) {
      notify(true, `Testimonial from "${target.name}" removed successfully.`);
    } else {
      setItems((prev) => [target, ...prev]);
      notify(false, 'Could not delete testimonial. Please check server.');
    }
    load();
  };

  const toggleActive = async (t: Testimonial) => {
    await saveTestimonial({ ...t, is_active: !t.is_active }, token);
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        subtitle="Parent and alumni quotes shown in the “Voices of the Josephite Family” homepage section."
        action={
          <button
            onClick={() => setEditing({ ...emptyTestimonial, order: items.length })}
            className="px-5 py-2.5 rounded-xl bg-[#00183F] hover:bg-[#0D2852] text-white text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" /> Add Testimonial
          </button>
        }
      />
      <FlashBanner flash={flash} />

      {items.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
          No testimonials yet. The homepage section stays hidden until you add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((t) => (
            <div key={t.id} className={`bg-white rounded-2xl border p-5 flex flex-col gap-4 ${t.is_active ? 'border-slate-200' : 'border-slate-200 opacity-60'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.avatar_url || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=100&auto=format&fit=crop'}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#D4AF37] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-[#00183F] truncate">{t.name}</div>
                    <div className="text-xs text-slate-500 truncate">{t.role}</div>
                  </div>
                </div>
                <Toggle active={t.is_active} onClick={() => toggleActive(t)} />
              </div>
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-4 flex gap-2">
                <Quote className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                <span>{t.quote}</span>
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{t.badge}</span>
                  <span className="flex">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setEditing(t)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer" aria-label="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingItem(t)}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Testimonial Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingItem}
        title="Delete Testimonial"
        itemName={deletingItem?.name}
        loading={deleteLoading}
        onClose={() => setDeletingItem(null)}
        onConfirm={confirmDelete}
      />

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit Testimonial' : 'Add Testimonial'} maxWidth="lg">
        {editing && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Name *">
                <input required className={inputCls} value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </Field>
              <Field label="Role / Relation *" hint="e.g. Parent of Class IX Student">
                <input required className={inputCls} value={editing.role || ''} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
              </Field>
              <Field label="Badge Label">
                <input className={inputCls} value={editing.badge || ''} onChange={(e) => setEditing({ ...editing, badge: e.target.value })} />
              </Field>
              <Field label="Rating (1–5)">
                <input
                  type="number"
                  min={1}
                  max={5}
                  className={inputCls}
                  value={editing.rating ?? 5}
                  onChange={(e) => setEditing({ ...editing, rating: Math.min(5, Math.max(1, Number(e.target.value) || 5)) })}
                />
              </Field>
            </div>
            <Field label="Quote *">
              <textarea required rows={4} className={inputCls} value={editing.quote || ''} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} />
            </Field>
            <ImageHelper label="Avatar Photo" value={editing.avatar_url || ''} onChange={(url) => setEditing({ ...editing, avatar_url: url })} />
            <div className="flex items-center justify-between gap-4">
              <Field label="Display Order" className="w-32">
                <input type="number" className={inputCls} value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) || 0 })} />
              </Field>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer mt-5">
                <input type="checkbox" className="w-4 h-4 accent-[#00183F]" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
                Visible on website
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-[#00183F] text-white text-sm font-bold flex items-center gap-2 disabled:opacity-60 cursor-pointer">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save Testimonial
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

/* ---------- FAQs ---------- */

const emptyFaq: Partial<FAQ> = { question: '', answer: '', category: 'General', order: 0, is_active: true };

export const FaqManager: React.FC<{ token?: string }> = ({ token }) => {
  const [items, setItems] = useState<FAQ[]>([]);
  const [editing, setEditing] = useState<Partial<FAQ> | null>(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<Flash>(null);

  const load = useCallback(async () => setItems(await getFaqs(false)), []);
  useEffect(() => {
    load();
  }, [load]);

  const notify = (ok: boolean, text: string) => {
    setFlash({ ok, text });
    setTimeout(() => setFlash(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const saved = await saveFaq(editing, token);
    setSaving(false);
    if (saved) {
      notify(true, editing.id ? 'FAQ updated.' : 'FAQ added.');
      setEditing(null);
      load();
    } else notify(false, 'Could not save FAQ.');
  };

  const [deletingFaq, setDeletingFaq] = useState<FAQ | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const confirmDelete = async () => {
    if (!deletingFaq) return;
    const target = deletingFaq;
    setDeleteLoading(true);
    setItems((prev) => prev.filter((i) => i.id !== target.id));
    setDeletingFaq(null);

    const ok = await deleteFaq(target.id, token);
    setDeleteLoading(false);
    if (ok) {
      notify(true, 'FAQ deleted successfully.');
    } else {
      setItems((prev) => [target, ...prev]);
      notify(false, 'Delete failed.');
    }
    load();
  };

  const toggleActive = async (f: FAQ) => {
    await saveFaq({ ...f, is_active: !f.is_active }, token);
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admission FAQs"
        subtitle="Questions shown in the accordion at the bottom of the Admission page."
        action={
          <div className="flex items-center gap-3">
            <a href="/admission" target="_blank" className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-bold flex items-center gap-2 hover:bg-slate-50">
              <ExternalLink className="w-4 h-4" /> Preview
            </a>
            <button
              onClick={() => setEditing({ ...emptyFaq, order: items.length })}
              className="px-5 py-2.5 rounded-xl bg-[#00183F] hover:bg-[#0D2852] text-white text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" /> Add FAQ
            </button>
          </div>
        }
      />
      <FlashBanner flash={flash} />

      {items.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
          No FAQs yet. The accordion stays hidden until you add one.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {items.map((f) => (
            <div key={f.id} className={`p-5 flex items-start gap-4 ${f.is_active ? '' : 'opacity-60'}`}>
              <HelpCircle className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-[#00183F]">{f.question}</div>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{f.answer}</p>
                <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">{f.category}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Toggle active={f.is_active} onClick={() => toggleActive(f)} />
                <button onClick={() => setEditing(f)} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer" aria-label="Edit">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingFaq(f)}
                  className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete FAQ Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingFaq}
        title="Delete Admission FAQ"
        itemName={deletingFaq?.question}
        loading={deleteLoading}
        onClose={() => setDeletingFaq(null)}
        onConfirm={confirmDelete}
      />

      <Modal isOpen={!!editing} onClose={() => setEditing(null)} title={editing?.id ? 'Edit FAQ' : 'Add FAQ'} maxWidth="lg">
        {editing && (
          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Question *">
              <input required className={inputCls} value={editing.question || ''} onChange={(e) => setEditing({ ...editing, question: e.target.value })} />
            </Field>
            <Field label="Answer *">
              <textarea required rows={5} className={inputCls} value={editing.answer || ''} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <input className={inputCls} value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              </Field>
              <Field label="Display Order">
                <input type="number" className={inputCls} value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) || 0 })} />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-[#00183F]" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} />
              Visible on website
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-[#00183F] text-white text-sm font-bold flex items-center gap-2 disabled:opacity-60 cursor-pointer">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />} Save FAQ
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

/* ---------- Faculty & Staff Manager ---------- */

const emptyStaffMember: Partial<StaffMember> = {
  name: '',
  role_type: 'teacher',
  designation: '',
  department: '',
  image_url: '',
  qualification: '',
  email: '',
  phone: '',
  bio: '',
  order: 0,
  is_featured: false,
  is_active: true,
};

export const FacultyManager: React.FC<{ token?: string }> = ({ token }) => {
  const [items, setItems] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<StaffMember> | null>(null);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState<Flash>(null);
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'teacher' | 'office' | 'staff'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    getFacultyAndStaff(false).then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    const saved = await saveStaffMember(editing, token);
    setSaving(false);
    if (saved) {
      setFlash({ ok: true, text: `"${saved.name}" saved successfully.` });
      setEditing(null);
      load();
    } else {
      setFlash({ ok: false, text: 'Could not save member. Please verify required fields.' });
    }
    setTimeout(() => setFlash(null), 4000);
  };

  const [deletingMember, setDeletingMember] = useState<StaffMember | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const confirmDelete = async () => {
    if (!deletingMember) return;
    const target = deletingMember;
    setDeleteLoading(true);
    // Optimistic UI removal
    setItems((prev) => prev.filter((i) => i.id !== target.id));
    setDeletingMember(null);

    const ok = await deleteStaffMember(target.id, token);
    setDeleteLoading(false);
    if (ok) {
      setFlash({ ok: true, text: `"${target.name}" removed successfully.` });
    } else {
      setItems((prev) => [target, ...prev]);
      setFlash({ ok: false, text: 'Could not remove member. Please check server.' });
    }
    load();
    setTimeout(() => setFlash(null), 4000);
  };

  const toggleActive = async (m: StaffMember) => {
    await saveStaffMember({ id: m.id, is_active: !m.is_active }, token);
    load();
  };

  const filtered = items.filter((m) => {
    if (filterRole !== 'all' && m.role_type !== filterRole) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchDes = m.designation.toLowerCase().includes(q);
      const matchDept = m.department.toLowerCase().includes(q);
      if (!matchName && !matchDes && !matchDept) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Faculty & Staff Directory"
        subtitle="Manage leadership, academic teachers, and administrative support staff displayed on the public Faculty & Staff page."
        action={
          <div className="flex items-center gap-3">
            <a
              href="/faculty"
              target="_blank"
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-bold flex items-center gap-2 hover:bg-slate-50"
            >
              <ExternalLink className="w-4 h-4" /> View Public Page
            </a>
            <button
              onClick={() => setEditing({ ...emptyStaffMember, order: items.length })}
              className="px-5 py-2.5 rounded-xl bg-[#00183F] hover:bg-[#0D2852] text-white text-sm font-bold flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" /> Add Member
            </button>
          </div>
        }
      />
      <FlashBanner flash={flash} />

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All', count: items.length },
            { id: 'admin', label: 'Administration', count: items.filter((i) => i.role_type === 'admin').length },
            { id: 'teacher', label: 'Teachers', count: items.filter((i) => i.role_type === 'teacher').length },
            { id: 'office', label: 'Office Staff', count: items.filter((i) => i.role_type === 'office').length },
            { id: 'staff', label: 'Support Staff', count: items.filter((i) => i.role_type === 'staff').length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilterRole(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterRole === t.id
                  ? 'bg-white text-[#00183F] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search directory..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#00183F]"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex items-center justify-center text-slate-400 gap-2 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading directory…
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
          No members found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <div
              key={m.id}
              className={`p-4 bg-white rounded-2xl border transition-all flex items-start gap-3.5 relative group ${
                m.is_active ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50/60'
              }`}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img
                  src={m.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'}
                  alt={m.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      m.role_type === 'admin'
                        ? 'bg-amber-100 text-amber-900'
                        : m.role_type === 'teacher'
                        ? 'bg-sky-100 text-sky-900'
                        : m.role_type === 'office'
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {m.role_type === 'admin'
                      ? 'Admin'
                      : m.role_type === 'teacher'
                      ? 'Faculty'
                      : m.role_type === 'office'
                      ? 'Office'
                      : 'Staff'}
                  </span>
                  {m.is_featured && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Lead
                    </span>
                  )}
                </div>

                <div className="font-bold text-sm text-[#00183F] truncate mt-1">{m.name}</div>
                <div className="text-xs font-semibold text-[#C8102E] truncate">{m.designation}</div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{m.department}</div>

                <div className="flex items-center gap-1 pt-3 mt-2 border-t border-slate-100 justify-end">
                  <Toggle active={m.is_active} onClick={() => toggleActive(m)} />
                  <button
                    onClick={() => setEditing(m)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                    aria-label="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingMember(m)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Member Modal */}
      <Modal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? 'Edit Faculty / Staff Member' : 'Add New Member'}
        subtitle="Manage personal details, academic credentials, and official role"
        maxWidth="2xl"
      >
        {editing && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Category / Role Type *">
                <select
                  required
                  className={inputCls}
                  value={editing.role_type || 'teacher'}
                  onChange={(e) => setEditing({ ...editing, role_type: e.target.value as any })}
                >
                  <option value="admin">Administration Body & Leadership</option>
                  <option value="teacher">Academic Faculty & Teaching Staff</option>
                  <option value="office">Office & Administrative Staff</option>
                  <option value="staff">Support & Operations Staff</option>
                </select>
              </Field>

              <Field label="Full Name *">
                <input
                  required
                  className={inputCls}
                  value={editing.name || ''}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Dr. Syed Aminul Islam"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Official Designation *" hint="e.g. Senior Cambridge Physics Faculty">
                <input
                  required
                  className={inputCls}
                  value={editing.designation || ''}
                  onChange={(e) => setEditing({ ...editing, designation: e.target.value })}
                />
              </Field>

              <Field label="Department / Division *" hint="e.g. Department of Physics">
                <input
                  required
                  className={inputCls}
                  value={editing.department || ''}
                  onChange={(e) => setEditing({ ...editing, department: e.target.value })}
                />
              </Field>
            </div>

            {/* Profile Photo via ImageHelper */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
              <ImageHelper
                label="Profile Portrait Photo"
                value={editing.image_url || ''}
                onChange={(url) => setEditing({ ...editing, image_url: url })}
                required={false}
              />
            </div>

            <Field label="Academic Qualifications" hint="Degrees, universities, Cambridge assessor credentials">
              <input
                className={inputCls}
                value={editing.qualification || ''}
                onChange={(e) => setEditing({ ...editing, qualification: e.target.value })}
                placeholder="e.g. Ph.D. in Physics (DU), Cambridge Examiner"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Official Email Address">
                <input
                  type="email"
                  className={inputCls}
                  value={editing.email || ''}
                  onChange={(e) => setEditing({ ...editing, email: e.target.value })}
                  placeholder="faculty@sjis-narinda.edu.bd"
                />
              </Field>

              <Field label="Display Order (Ranking)">
                <input
                  type="number"
                  className={inputCls}
                  value={editing.order ?? 0}
                  onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) || 0 })}
                />
              </Field>
            </div>

            <Field label="Professional Biography & Experience">
              <textarea
                rows={3}
                className={inputCls}
                value={editing.bio || ''}
                onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
                placeholder="Specializations, Olympiad coaching, awards, philosophy..."
              />
            </Field>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#00183F]"
                  checked={editing.is_featured ?? false}
                  onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                />
                Lead / Featured Profile
              </label>

              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#00183F]"
                  checked={editing.is_active ?? true}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
                />
                Visible on public website
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-[#00183F] text-white text-sm font-bold flex items-center gap-2 disabled:opacity-60 cursor-pointer shadow-md"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing.id ? 'Save Changes' : 'Create Profile'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Faculty & Staff Member Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingMember}
        title="Remove Faculty & Staff Member"
        itemName={deletingMember?.name}
        loading={deleteLoading}
        onClose={() => setDeletingMember(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

