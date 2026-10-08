'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  Upload,
  Eye,
  Download,
  Calendar,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Volume2,
  Star,
  Layers,
  X,
} from 'lucide-react';
import { Publication } from '@/lib/types';
import {
  getPublications,
  savePublication,
  deletePublication,
  uploadMediaFile,
} from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { FlipbookReader } from '@/components/magazine/FlipbookReader';

interface PublicationManagerProps {
  token?: string;
}

const TYPE_OPTIONS = [
  { id: 'all', label: 'All Publications' },
  { id: 'magazine', label: 'Annual School Magazine' },
  { id: 'yearbook', label: 'Annual Yearbook & Milestones' },
  { id: 'newsletter', label: 'Term Newsletter & Gazette' },
  { id: 'prospectus', label: 'Academic Prospectus' },
  { id: 'handbook', label: 'Student & Parent Handbook' },
];

const emptyPublication: Partial<Publication> = {
  title: '',
  publication_type: 'magazine',
  edition: 'Annual Edition 2025–2026',
  academic_year: '2025-2026',
  cover_image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
  pdf_url: '/sample-magazines/sjis-annual-magazine-2025-2026.pdf',
  file_size: '14.8 MB PDF',
  pages_count: 64,
  description: '',
  editor_name: 'SJIS Editorial Board',
  publish_date: new Date().toISOString().split('T')[0],
  is_featured: false,
  order: 0,
  is_active: true,
};

export const PublicationManager: React.FC<PublicationManagerProps> = ({ token }) => {
  const [items, setItems] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Publication> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingItem, setDeletingItem] = useState<Publication | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [previewItem, setPreviewItem] = useState<Publication | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    getPublications('all', '', 'all', false, token).then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const notify = (ok: boolean, text: string) => {
    setFlash({ ok, text });
    setTimeout(() => setFlash(null), 4000);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    // Validate 200 MB maximum limit
    const maxSizeBytes = 200 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      notify(false, `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 200 MB. Please compress the PDF before uploading.`);
      e.target.value = '';
      return;
    }

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setUploadingPdf(true);
    notify(true, `Uploading "${file.name}" (${sizeMb} MB)... Please wait while it uploads.`);
    try {
      const res = await uploadMediaFile(file, token);
      if (res && res.url) {
        setEditing({
          ...editing,
          pdf_url: res.url,
          file_size: `${sizeMb} MB PDF`,
        });
        notify(true, `Publication PDF uploaded successfully (${file.name}, ${sizeMb} MB).`);
      } else {
        notify(false, res?.error || 'PDF upload failed. You can paste a direct URL.');
      }
    } catch {
      notify(false, 'Network error during PDF file upload.');
    } finally {
      setUploadingPdf(false);
      e.target.value = '';
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploadingCover(true);
    try {
      const res = await uploadMediaFile(file, token);
      if (res && res.url) {
        setEditing({
          ...editing,
          cover_image_url: res.url,
        });
        notify(true, 'Cover image uploaded.');
      } else {
        notify(false, 'Failed to upload cover image.');
      }
    } catch {
      notify(false, 'Network error during image upload.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.title || !editing.pdf_url) {
      notify(false, 'Please provide publication title and PDF URL.');
      return;
    }
    setSaving(true);
    try {
      const saved = await savePublication(editing, token);
      if (saved) {
        notify(true, `"${saved.title}" saved successfully.`);
        setEditing(null);
        load();
      } else {
        notify(false, 'Could not save publication. Please check fields.');
      }
    } catch {
      notify(false, 'Network error while saving publication.');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    const target = deletingItem;
    setDeleteLoading(true);
    setItems((prev) => prev.filter((i) => i.id !== target.id));
    setDeletingItem(null);

    const ok = await deletePublication(target.id, token);
    setDeleteLoading(false);
    if (ok) {
      notify(true, `"${target.title}" deleted.`);
    } else {
      setItems((prev) => [target, ...prev]);
      notify(false, `Failed to delete "${target.title}".`);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filterType !== 'all' && item.publication_type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        item.edition.toLowerCase().includes(q) ||
        item.academic_year.toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalViews = items.reduce((sum, i) => sum + (i.views_count || 0), 0);
  const totalDownloads = items.reduce((sum, i) => sum + (i.download_count || 0), 0);
  const magazineCount = items.filter((i) => i.publication_type === 'magazine').length;
  const yearbookCount = items.filter((i) => i.publication_type === 'yearbook').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-500" />
            School Magazines &amp; Annual Yearbooks
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage digitized school magazines, commemorative yearbooks, and literary journals with 3D DearFlip reader integration.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...emptyPublication })}
          className="px-4 py-2.5 rounded-xl bg-[#00183F] hover:bg-[#070F1E] text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>Upload New Publication</span>
        </button>
      </div>

      {flash && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
            flash.ok ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {flash.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          {flash.text}
        </div>
      )}

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Total Publications</div>
          <div className="text-2xl font-black text-[#00183F] mt-1">{items.length}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">School Magazines</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{magazineCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Annual Yearbooks</div>
          <div className="text-2xl font-black text-purple-600 mt-1">{yearbookCount}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500">Flipbook Reads</div>
          <div className="text-2xl font-black text-blue-600 mt-1 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-blue-500" />
            {totalViews}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
          <div className="text-[11px] font-semibold text-slate-500">PDF Downloads</div>
          <div className="text-2xl font-black text-emerald-600 mt-1 flex items-center gap-1.5">
            <Download className="w-4 h-4 text-emerald-500" />
            {totalDownloads}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by publication title, edition, or year..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#00183F] outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white outline-none cursor-pointer"
          >
            {TYPE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Publications Table */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37] mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading publications records...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No publication booklets found</p>
          <p className="text-xs text-slate-400 mt-1">Click &quot;Upload New Publication&quot; above to add your first magazine or yearbook.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Cover</th>
                  <th className="py-3 px-4">Publication Title &amp; Edition</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Session</th>
                  <th className="py-3 px-4">Pages / Size</th>
                  <th className="py-3 px-4">Reads / Views</th>
                  <th className="py-3 px-4">Downloads</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-10 h-14 relative rounded-lg overflow-hidden bg-slate-900 border border-slate-200 shadow-xs">
                        <Image
                          src={item.cover_image_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop'}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-800 line-clamp-1">{item.title}</div>
                      <div className="text-[11px] text-amber-700 font-semibold">{item.edition}</div>
                      {item.is_featured && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 mt-0.5">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured on Homepage
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.publication_type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{item.academic_year}</td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{item.pages_count > 0 ? `${item.pages_count} Pages` : 'PDF'}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.file_size || 'PDF Document'}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{item.views_count}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{item.download_count}</td>
                    <td className="py-3 px-4">
                      {item.is_active ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Active</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">Hidden</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="p-1.5 rounded-lg text-amber-600 hover:text-amber-800 hover:bg-amber-50 cursor-pointer"
                          title="Open in 3D DearFlip Reader"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditing(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#00183F] hover:bg-slate-100 cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {editing && (
        <Modal
          isOpen={!!editing}
          title={editing.id ? `Edit Publication (${editing.title})` : 'Upload New Magazine / Yearbook'}
          onClose={() => setEditing(null)}
          maxWidth="lg"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Publication Title *
                </label>
                <input
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                  placeholder="e.g. The Josephite Chronicle - Annual School Magazine"
                  value={editing.title || ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Publication Type *
                </label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none bg-white cursor-pointer"
                  value={editing.publication_type || 'magazine'}
                  onChange={(e) => setEditing({ ...editing, publication_type: e.target.value as Publication['publication_type'] })}
                >
                  <option value="magazine">Annual School Magazine</option>
                  <option value="yearbook">Annual Yearbook &amp; Milestones</option>
                  <option value="newsletter">Term Newsletter &amp; Gazette</option>
                  <option value="prospectus">Academic Prospectus</option>
                  <option value="handbook">Student &amp; Parent Handbook</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Edition / Volume Label *
                </label>
                <input
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                  placeholder="e.g. Annual Edition 2025–2026 (Vol. XV)"
                  value={editing.edition || ''}
                  onChange={(e) => setEditing({ ...editing, edition: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Academic Session *
                </label>
                <input
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                  placeholder="e.g. 2025-2026"
                  value={editing.academic_year || ''}
                  onChange={(e) => setEditing({ ...editing, academic_year: e.target.value })}
                />
              </div>
            </div>

            {/* PDF Uploader Field */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Magazine PDF File (For 3D Flipbook Reader) *
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports high-resolution yearbooks and magazines up to <strong>200 MB</strong> (PDF).
                  </p>
                </div>
                {uploadingPdf && (
                  <span className="text-xs text-amber-600 font-semibold flex items-center gap-1.5 animate-pulse">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading large document...
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  required
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-[#00183F] outline-none bg-white"
                  placeholder="https://... or upload local PDF booklet below"
                  value={editing.pdf_url || ''}
                  onChange={(e) => setEditing({ ...editing, pdf_url: e.target.value })}
                />
                <label className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5 text-[#00183F]" />
                  <span>Choose PDF</span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={handlePdfUpload}
                  />
                </label>
              </div>

              {editing.pdf_url && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="font-mono text-[11px] text-slate-700 truncate max-w-xs">{editing.pdf_url}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewItem(editing as Publication)}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#00183F] font-bold text-[11px] flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3 h-3 text-[#D4AF37]" />
                    <span>Test 3D Flipbook</span>
                  </button>
                </div>
              )}
            </div>

            {/* Cover Image Field */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Cover Photo Image URL
                </label>
                {uploadingCover && (
                  <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading Cover...
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#00183F] outline-none bg-white"
                  placeholder="https://... or upload cover image"
                  value={editing.cover_image_url || ''}
                  onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })}
                />
                <label className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5 text-[#00183F]" />
                  <span>Upload Cover</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Page Count
                </label>
                <input
                  type="number"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                  value={editing.pages_count ?? 0}
                  onChange={(e) => setEditing({ ...editing, pages_count: Number(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  File Size Label
                </label>
                <input
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                  placeholder="e.g. 14.8 MB PDF"
                  value={editing.file_size || ''}
                  onChange={(e) => setEditing({ ...editing, file_size: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Editor / Board Name
                </label>
                <input
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                  placeholder="e.g. Student Editorial Board"
                  value={editing.editor_name || ''}
                  onChange={(e) => setEditing({ ...editing, editor_name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Description &amp; Foreword Message
              </label>
              <textarea
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                placeholder="Foreword message, themes covered, student literary contributions..."
                value={editing.description || ''}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#00183F]"
                  checked={editing.is_featured ?? false}
                  onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                />
                Feature in Top Spotlight Banner
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
                disabled={saving || uploadingPdf}
                className="px-5 py-2 rounded-xl bg-[#00183F] hover:bg-[#070F1E] text-white text-sm font-bold flex items-center gap-2 disabled:opacity-60 cursor-pointer shadow-md transition-all"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing.id ? 'Save Changes' : 'Publish Publication'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* 3D Flipbook Testing Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-5xl h-[85vh] flex flex-col">
            <FlipbookReader
              pdfUrl={previewItem.pdf_url}
              title={previewItem.title}
              edition={previewItem.edition}
              isModal={true}
              onClose={() => setPreviewItem(null)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Delete Publication</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete &quot;{deletingItem.title}&quot;? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                {deleteLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
