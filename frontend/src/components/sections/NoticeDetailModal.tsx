'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Download,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  FileText,
  Pin,
  Eye,
  ExternalLink,
  Maximize2,
  Minimize2,
  Building2,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from 'lucide-react';
import { Notice } from '@/lib/types';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useSiteSettings } from '@/components/layout/SiteSettingsContext';
import { incrementNoticeView } from '@/lib/api';

interface NoticeDetailModalProps {
  notice: Notice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({
  notice,
  isOpen,
  onClose,
}) => {
  const site = useSiteSettings();
  const [activeTab, setActiveTab] = useState<'memo' | 'preview'>('memo');
  const [copied, setCopied] = useState(false);
  const [viewsCount, setViewsCount] = useState<number>(notice?.views_count || 0);
  const [hasIncremented, setHasIncremented] = useState(false);
  const [previewHeight, setPreviewHeight] = useState<'normal' | 'large'>('normal');

  useEffect(() => {
    if (notice) {
      setViewsCount(notice.views_count || 0);
      setActiveTab('memo');
      setHasIncremented(false);
    }
  }, [notice?.id]);

  useEffect(() => {
    if (isOpen && notice && !hasIncremented) {
      setHasIncremented(true);
      // Increment views count asynchronously
      incrementNoticeView(notice.id).then((newCount) => {
        if (typeof newCount === 'number') {
          setViewsCount(newCount);
        } else {
          setViewsCount((prev) => prev + 1);
        }
      });
    }
  }, [isOpen, notice, hasIncremented]);

  if (!notice) return null;

  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'admission':
        return 'gold';
      case 'exams':
        return 'crimson';
      case 'events':
        return 'navy';
      case 'holidays':
        return 'emerald';
      default:
        return 'slate';
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/notices#notice-${notice.id}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const refNumber = `SJIS/CIR/2026-${String(notice.id).padStart(3, '0')}`;
  const showViews = site.show_notice_views !== false;
  const isImageAttachment = notice.attachment_url && /\.(jpg|jpeg|png|webp|gif)$/i.test(notice.attachment_url);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth={activeTab === 'preview' || previewHeight === 'large' ? '3xl' : 'xl'}
      title="Official Circular Notice"
      subtitle="St. Joseph International School, Narinda • Academic Council"
      icon={<FileText className="w-5 h-5 text-[#00183F]" />}
      badge={
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={getCategoryBadgeVariant(notice.category)}>
            {notice.category_display || notice.category}
          </Badge>
          {notice.is_pinned && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C8102E] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
              <Pin className="w-2.5 h-2.5 fill-white" />
              Pinned
            </span>
          )}
          {showViews && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200/80 text-[11px] font-semibold">
              <Eye className="w-3 h-3 text-sky-600" />
              <span>{viewsCount.toLocaleString()} Views</span>
            </span>
          )}
        </div>
      }
      footer={
        <div className="w-full flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {notice.attachment_url && (
              <a
                href={notice.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-[#00183F] font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Official PDF</span>
              </a>
            )}
            <Button variant="primary" size="sm" onClick={onClose}>
              Dismiss
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Navigation Tabs (if attachment is present) */}
        {notice.attachment_url && (
          <div className="flex items-center justify-between gap-3 flex-wrap border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl">
              <button
                onClick={() => setActiveTab('memo')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'memo'
                    ? 'bg-white text-[#00183F] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#00183F]" />
                <span>Official Memorandum</span>
              </button>

              <button
                onClick={() => setActiveTab('preview')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-[#00183F] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>Document Attachment Preview</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </div>

            {activeTab === 'preview' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewHeight(prev => prev === 'normal' ? 'large' : 'normal')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  title="Toggle viewer height"
                >
                  {previewHeight === 'large' ? (
                    <>
                      <Minimize2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Standard View</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Expanded View</span>
                    </>
                  )}
                </button>

                <a
                  href={notice.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#00183F]" />
                  <span>Open in Tab</span>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Memorandum Top Meta Strip */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-mono font-semibold">
            <span className="text-slate-400">REF:</span>
            <span className="text-[#00183F] font-bold">{refNumber}</span>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C8102E]" />
              <span>Issue Date: <strong className="text-slate-700 font-semibold">{notice.publish_date}</strong></span>
            </span>

            {showViews && (
              <span className="flex items-center gap-1.5 text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-md font-semibold border border-sky-200/60">
                <Eye className="w-3.5 h-3.5 text-sky-600" />
                <span>{viewsCount.toLocaleString()} Total Reads</span>
              </span>
            )}

            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold border border-emerald-200/60">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Circular
            </span>
          </div>
        </div>

        {/* Notice Subject / Title */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#C8102E]">
            Subject of Notice
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#00183F] leading-tight tracking-tight">
            {notice.title}
          </h2>
        </div>

        {/* VIEW 1: Formal Memorandum Body */}
        {activeTab === 'memo' && (
          <div className="space-y-6">
            {/* Quick Preview Callout if Attachment exists */}
            {notice.attachment_url && (
              <div className="rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 via-amber-100/40 to-amber-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-amber-300 flex items-center justify-center text-[#C8102E] shrink-0 shadow-2xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#00183F] flex items-center gap-2">
                      <span>Official Signed Circular Attachment Available</span>
                      <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[10px] font-black">PDF</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      View the complete formatted document with authorized stamp, signature, and annexures.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00183F] hover:bg-[#071936] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Preview Document</span>
                  </button>

                  <a
                    href={notice.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-300 bg-white hover:bg-amber-50 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            )}

            {/* Memorandum Paper Layout */}
            <div className="relative rounded-2xl border-l-4 border-[#00183F] bg-gradient-to-br from-slate-50/90 via-white to-slate-50/50 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-3 font-normal">
                {notice.content}
              </div>

              {/* Institutional Sign-off Block */}
              <div className="pt-6 mt-6 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="text-xs text-slate-500 space-y-1">
                  <div className="font-semibold text-slate-700">Distribution:</div>
                  <div>• General Notice Board (Physical & Digital)</div>
                  <div>• Concerned Students, Faculty, and Parents</div>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold">
                    <Building2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Office of the Administrator
                  </div>
                  <div className="text-xs font-bold text-[#00183F]">
                    St. Joseph International School
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Narinda, Dhaka-1100, Bangladesh
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Live Preview Below Memorandum */}
            {notice.attachment_url && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#C8102E]" />
                    <span>Attached Official Document (Live Preview)</span>
                  </h4>
                  <a
                    href={notice.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#00183F] hover:text-[#C8102E] flex items-center gap-1"
                  >
                    <span>Open External View</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="rounded-2xl border-2 border-slate-200 overflow-hidden shadow-md bg-slate-900">
                  {isImageAttachment ? (
                    <div className="p-4 flex items-center justify-center bg-slate-100">
                      <img
                        src={notice.attachment_url}
                        alt={notice.title}
                        className="max-h-[500px] w-auto object-contain rounded-xl shadow-xs"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full h-[520px] bg-slate-800">
                      <object
                        data={`${notice.attachment_url}#toolbar=1&navpanes=0`}
                        type="application/pdf"
                        className="w-full h-full border-0 bg-white"
                      >
                        <iframe
                          src={`${notice.attachment_url}#toolbar=1&navpanes=0`}
                          title="Attached Notice Document Preview"
                          className="w-full h-full border-0 bg-white"
                        />
                      </object>
                    </div>
                  )}

                  <div className="bg-slate-900 px-4 py-2.5 text-xs text-slate-300 flex items-center justify-between border-t border-slate-800">
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Certified CAIE Official Circular Document</span>
                    </span>
                    <a
                      href={notice.attachment_url}
                      download
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Direct Download</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: Dedicated Pro Document Preview Tab */}
        {activeTab === 'preview' && notice.attachment_url && (
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-t-2xl p-4 flex flex-wrap items-center justify-between gap-3 border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 font-bold text-xs">
                  PDF
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white truncate max-w-md">
                    {notice.title} (Official Signed Document)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Format: Adobe Acrobat PDF • Certified St. Joseph Narinda Seal
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={notice.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
                  <span>Pop-out Window</span>
                </a>

                <a
                  href={notice.attachment_url}
                  download
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#00183F] text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>

            <div className={`relative w-full rounded-b-2xl overflow-hidden shadow-2xl border-x-2 border-b-2 border-slate-900 bg-slate-900 transition-all ${
              previewHeight === 'large' ? 'h-[750px]' : 'h-[560px]'
            }`}>
              {isImageAttachment ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-950 p-4">
                  <img
                    src={notice.attachment_url}
                    alt={notice.title}
                    className="max-h-full max-w-full object-contain rounded-xl"
                  />
                </div>
              ) : (
                <iframe
                  src={`${notice.attachment_url}#toolbar=1&navpanes=0`}
                  title="Notice Official PDF Viewer"
                  className="w-full h-full border-0 bg-white"
                />
              )}
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center justify-between">
              <span>Notice Ref: <strong>{refNumber}</strong></span>
              <span>Can&apos;t preview properly? <a href={notice.attachment_url} target="_blank" rel="noopener noreferrer" className="text-[#00183F] font-bold underline">Click here to open PDF directly</a></span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
