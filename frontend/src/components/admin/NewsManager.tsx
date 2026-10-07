'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Search,
  Calendar,
  Eye,
  Star,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Upload,
  Image as ImageIcon,
  Newspaper,
  X,
  Sparkles,
  TrendingUp,
  Tag
} from 'lucide-react';
import { News } from '@/lib/types';
import { getNews, createNews, updateNews, deleteNews, uploadMediaFile } from '@/lib/api';
import { Modal } from '@/components/ui/Modal';
import { formatNewsDate } from '@/lib/news';

interface NewsManagerProps {
  token?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'events', label: 'Events & Celebrations' },
  { id: 'sports', label: 'Sports & Athletics' },
  { id: 'cultural', label: 'Arts & Culture' },
  { id: 'academic', label: 'Academic & Olympiads' },
  { id: 'campus', label: 'Campus Life' },
];

const emptyNews: Partial<News> = {
  title: '',
  category: 'events',
  summary: '',
  content: '',
  image_url: '',
  gallery_images: [],
  publish_date: new Date().toISOString().split('T')[0],
  is_featured: false,
  is_active: true,
};

export const NewsManager: React.FC<NewsManagerProps> = ({ token }) => {
  const [items, setItems] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<News> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [flash, setFlash] = useState<{ ok: boolean; text: string } | null>(null);
  const [deletingItem, setDeletingItem] = useState<News | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Load all items (active and inactive) for admin
      const data = await getNews('all', '', false);
      setItems(data);
    } catch {
      setFlash({ ok: false, text: 'Failed to load news records.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Cover Photo Upload
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploadingCover(true);
    try {
      const res = await uploadMediaFile(file, token);
      if (res && res.url) {
        setEditing({ ...editing, image_url: res.url });
        setFlash({ ok: true, text: 'Cover image uploaded.' });
      } else {
        setFlash({ ok: false, text: 'Failed to upload cover image.' });
      }
    } catch {
      setFlash({ ok: false, text: 'Network error during image upload.' });
    } finally {
      setUploadingCover(false);
      setTimeout(() => setFlash(null), 3000);
    }
  };

  // Handle Event Gallery Photo Upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editing) return;
    setUploadingGallery(true);
    try {
      const currentGallery = editing.gallery_images || [];
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const res = await uploadMediaFile(files[i], token);
        if (res && res.url) {
          newUrls.push(res.url);
        }
      }

      if (newUrls.length > 0) {
        setEditing({ ...editing, gallery_images: [...currentGallery, ...newUrls] });
        setFlash({ ok: true, text: `Added ${newUrls.length} photo(s) to gallery.` });
      } else {
        setFlash({ ok: false, text: 'Could not upload gallery images.' });
      }
    } catch {
      setFlash({ ok: false, text: 'Error uploading gallery photos.' });
    } finally {
      setUploadingGallery(false);
      setTimeout(() => setFlash(null), 3000);
    }
  };

  // Add gallery image by URL
  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim() || !editing) return;
    const current = editing.gallery_images || [];
    setEditing({ ...editing, gallery_images: [...current, galleryUrlInput.trim()] });
    setGalleryUrlInput('');
  };

  // Remove gallery image
  const handleRemoveGalleryImage = (indexToRemove: number) => {
    if (!editing) return;
    const current = editing.gallery_images || [];
    setEditing({
      ...editing,
      gallery_images: current.filter((_, idx) => idx !== indexToRemove),
    });
  };

  // Save News Story (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.title?.trim() || !editing.summary?.trim() || !editing.content?.trim()) {
      setFlash({ ok: false, text: 'Please fill in Title, Summary, and Article Content.' });
      return;
    }
    setSaving(true);
    try {
      let saved: News | null = null;
      if (editing.id) {
        saved = await updateNews(editing.id, editing, token);
      } else {
        saved = await createNews(editing, token);
      }

      if (saved) {
        setFlash({ ok: true, text: `"${saved.title}" published successfully.` });
        setEditing(null);
        loadData();
      } else {
        setFlash({ ok: false, text: 'Server rejected the news item. Please verify all fields.' });
      }
    } catch {
      setFlash({ ok: false, text: 'Network error while saving news story.' });
    } finally {
      setSaving(false);
      setTimeout(() => setFlash(null), 4000);
    }
  };

  // Delete News Story
  const confirmDelete = async () => {
    if (!deletingItem) return;
    const target = deletingItem;
    setDeleteLoading(true);
    setItems((prev) => prev.filter((n) => n.id !== target.id));
    setDeletingItem(null);

    const ok = await deleteNews(target.id, token);
    setDeleteLoading(false);
    if (ok) {
      setFlash({ ok: true, text: `"${target.title}" removed.` });
    } else {
      setItems((prev) => [target, ...prev]);
      setFlash({ ok: false, text: `Failed to delete "${target.title}".` });
    }
    setTimeout(() => setFlash(null), 3000);
  };

  // Filtered stories
  const filteredItems = items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSummary = (item.summary || '').toLowerCase().includes(q);
      const matchContent = item.content.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary && !matchContent) return false;
    }
    return true;
  });

  const totalViews = items.reduce((acc, curr) => acc + (curr.views_count || 0), 0);
  const featuredCount = items.filter((n) => n.is_featured).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-amber-500" />
            School News &amp; Campus Events
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Publish photo stories, student competition results, annual celebrations, and athletic milestones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/news"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public News Page</span>
          </a>
          <button
            onClick={() => setEditing({ ...emptyNews })}
            className="px-4 py-2.5 rounded-xl bg-[#00183F] hover:bg-navy-900 text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Publish New Story</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Stories</div>
            <div className="text-2xl font-black text-[#00183F] mt-0.5">{items.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Newspaper className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Featured on Home</div>
            <div className="text-2xl font-black text-amber-500 mt-0.5">{featuredCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Reader Views</div>
            <div className="text-2xl font-black text-emerald-600 mt-0.5">{totalViews.toLocaleString()}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Flash Alert */}
      {flash && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
            flash.ok ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {flash.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
          {flash.text}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search news by headline, summary, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#00183F] outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white outline-none cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stories Table */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading school news stories...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-700">No news articles found</p>
          <p className="text-xs text-slate-400 mt-1">Click &quot;Publish New Story&quot; above to add the first event report.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Story &amp; Cover</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Publish Date</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Gallery</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0 max-w-sm">
                          <div className="font-bold text-slate-800 line-clamp-1">{item.title}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{item.summary}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                        {item.category_display || item.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {formatNewsDate(item.publish_date)}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500">
                      {item.views_count || 0}
                    </td>

                    <td className="py-3 px-4">
                      {item.gallery_images && item.gallery_images.length > 0 ? (
                        <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-200">
                          {item.gallery_images.length} photos
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">&mdash;</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {item.is_featured ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> Home
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">&mdash;</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {item.is_active ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Published</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">Hidden</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/news/${item.slug || item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-navy-950 hover:bg-slate-100"
                          title="View on public site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setEditing(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-navy-950 hover:bg-slate-100"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingItem(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
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

      {/* Edit / Create News Modal */}
      {editing && (
        <Modal
          isOpen={!!editing}
          title={editing.id ? 'Edit News Story' : 'Publish New Campus Story'}
          onClose={() => setEditing(null)}
          maxWidth="2xl"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Story Headline *
                </label>
                <input
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-[#00183F] outline-none"
                  placeholder="e.g. Scintilla 2026: Young Innovators Take Centre Stage"
                  value={editing.title || ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Category *
                </label>
                <select
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-[#00183F] outline-none bg-white cursor-pointer"
                  value={editing.category || 'events'}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value as News['category'] })}
                >
                  <option value="events">Events &amp; Celebrations</option>
                  <option value="sports">Sports &amp; Athletics</option>
                  <option value="cultural">Arts &amp; Culture</option>
                  <option value="academic">Academic &amp; Olympiads</option>
                  <option value="campus">Campus Life</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Publish Date
                </label>
                <input
                  type="date"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-[#00183F] outline-none"
                  value={editing.publish_date || ''}
                  onChange={(e) => setEditing({ ...editing, publish_date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Custom URL Slug (Optional)
                </label>
                <input
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-[#00183F] outline-none font-mono text-xs"
                  placeholder="leave blank to auto-generate"
                  value={editing.slug || ''}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Headline Summary (1-2 Sentences) *
              </label>
              <textarea
                required
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-[#00183F] outline-none"
                placeholder="Brief captivating teaser shown on news cards and social media previews..."
                value={editing.summary || ''}
                onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
              />
            </div>

            {/* Primary Cover Image */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Cover Photo
                </label>
                {uploadingCover && (
                  <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading image...
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-[#00183F] outline-none bg-white"
                  placeholder="https://... or upload photo from device"
                  value={editing.image_url || ''}
                  onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                />
                <label className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5 text-[#00183F]" />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                </label>
              </div>

              {editing.image_url && (
                <div className="mt-2 w-32 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                  <img
                    src={editing.image_url}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, image_url: '' })}
                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 rounded-md text-white transition-colors"
                    title="Remove cover"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Event Photo Gallery */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Event Photo Gallery (Optional)
                  </label>
                  <p className="text-[10px] text-slate-400">
                    Upload multiple pictures from the ceremony or match to show in the interactive story lightbox.
                  </p>
                </div>
                {uploadingGallery && (
                  <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading gallery...
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:ring-2 focus:ring-[#00183F] outline-none bg-white"
                  placeholder="Paste photo URL..."
                  value={galleryUrlInput}
                  onChange={(e) => setGalleryUrlInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddGalleryUrl}
                  className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-bold text-slate-700"
                >
                  Add URL
                </button>
                <label className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer shrink-0">
                  <Upload className="w-3.5 h-3.5 text-[#00183F]" />
                  <span>Upload Photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleGalleryUpload}
                  />
                </label>
              </div>

              {/* Gallery Thumbnails Grid */}
              {editing.gallery_images && editing.gallery_images.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                  {editing.gallery_images.map((photo, idx) => (
                    <div
                      key={idx}
                      className="relative h-16 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100"
                    >
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Article Body */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Article Story Content *
              </label>
              <textarea
                required
                rows={8}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-[#00183F] outline-none leading-relaxed"
                placeholder="Write the complete story report. Use blank lines to separate paragraphs..."
                value={editing.content || ''}
                onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              />
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-[#00183F]"
                  checked={editing.is_featured ?? false}
                  onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                />
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  Feature on Homepage News Showcase
                </span>
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
                disabled={saving || uploadingCover || uploadingGallery}
                className="px-5 py-2 rounded-xl bg-[#00183F] hover:bg-navy-900 text-white text-sm font-bold flex items-center gap-2 disabled:opacity-60 cursor-pointer shadow-md transition-colors"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing.id ? 'Save Changes' : 'Publish Story'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <Modal
          isOpen={!!deletingItem}
          title="Delete News Story"
          onClose={() => setDeletingItem(null)}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Are you sure you want to permanently delete &quot;<strong>{deletingItem.title}</strong>&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={confirmDelete}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-60"
              >
                {deleteLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Delete Story</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
