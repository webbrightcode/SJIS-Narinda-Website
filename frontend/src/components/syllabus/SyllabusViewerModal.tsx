'use client';

import React, { useEffect, useState } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  FileText, 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  Maximize2, 
  Minimize2, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { SyllabusItem } from '@/lib/types';
import { incrementSyllabusDownload } from '@/lib/api';

interface SyllabusViewerModalProps {
  syllabus: SyllabusItem | null;
  onClose: () => void;
  onDownloadIncrement?: (id: number) => void;
}

export default function SyllabusViewerModal({
  syllabus,
  onClose,
  onDownloadIncrement,
}: SyllabusViewerModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (syllabus) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [syllabus, onClose]);

  if (!syllabus) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await incrementSyllabusDownload(syllabus.id);
      if (onDownloadIncrement) {
        onDownloadIncrement(syllabus.id);
      }
    } catch {
      // ignore
    } finally {
      setIsDownloading(false);
      // Trigger download
      const a = document.createElement('a');
      a.href = syllabus.file_url;
      a.download = `${syllabus.subject}_${syllabus.grade}_Syllabus_${syllabus.academic_year}.pdf`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const sectionLabel =
    syllabus.curriculum_section === 'cambridge_primary'
      ? 'Cambridge Primary'
      : syllabus.curriculum_section === 'cambridge_lower_sec'
      ? 'Cambridge Lower Secondary'
      : syllabus.curriculum_section === 'cambridge_igcse'
      ? 'Cambridge IGCSE'
      : syllabus.curriculum_section === 'gce_alevel'
      ? 'Cambridge International A Level'
      : 'General Academic';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Syllabus viewer for ${syllabus.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className={`bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-300 ${
          isFullscreen
            ? 'w-full h-full rounded-none'
            : 'w-full max-w-5xl h-[92vh] max-h-[960px]'
        }`}
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-[#00183F] bg-gradient-to-r from-[#00183F] via-[#070F1E] to-[#0A192F] text-white flex items-center justify-between border-b border-slate-800 select-none">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {sectionLabel}
                </span>
                <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-sky-400/20 text-sky-300 border border-sky-400/30">
                  {syllabus.grade}
                </span>
                {syllabus.version && (
                  <span className="text-[11px] font-mono text-slate-400">
                    {syllabus.version}
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
                {syllabus.title}
              </h2>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:inline-flex"
              title={isFullscreen ? 'Exit full screen' : 'Full screen'}
              aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <a
              href={syllabus.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Open in new browser tab"
              aria-label="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-red-500/20 hover:text-red-300 transition-colors ml-1"
              title="Close viewer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Sub-bar */}
        <div className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-300 gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#00183F] dark:text-sky-400" />
              <span>Class: <strong className="text-slate-800 dark:text-white">{syllabus.grade}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#00183F] dark:text-sky-400" />
              <span>Session: <strong className="text-slate-800 dark:text-white">{syllabus.academic_year}</strong></span>
            </div>
            {syllabus.subjects_included && (
              <div className="flex items-center gap-1.5 max-w-md truncate">
                <span className="text-slate-500">Subjects:</span>
                <span className="text-slate-800 dark:text-white font-medium truncate" title={syllabus.subjects_included}>
                  {syllabus.subjects_included}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {syllabus.file_size && (
              <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono text-[11px]">
                {syllabus.file_size}
              </span>
            )}
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Complete Grade Packet
            </span>
          </div>
        </div>

        {/* Embedded PDF Viewer Container */}
        <div className="flex-1 bg-slate-800 relative overflow-hidden flex flex-col">
          {!loadError ? (
            <object
              data={`${syllabus.file_url}#toolbar=1&navpanes=1`}
              type="application/pdf"
              className="w-full h-full flex-1 border-0"
              onError={() => setLoadError(true)}
            >
              <iframe
                src={`${syllabus.file_url}#toolbar=1`}
                className="w-full h-full border-0"
                title={syllabus.title}
              >
                <div className="p-8 text-center text-white flex flex-col items-center justify-center h-full">
                  <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
                  <p className="text-base font-semibold mb-2">Unable to display PDF directly in your browser.</p>
                  <p className="text-sm text-slate-300 max-w-md mb-4">
                    Your current browser does not support inline PDF rendering. You can easily view or download the complete syllabus using the buttons below.
                  </p>
                  <div className="flex gap-3">
                    <a
                      href={syllabus.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-sky-500 hover:bg-sky-400 rounded-lg text-white font-medium text-sm flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" /> Open in New Tab
                    </a>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 rounded-lg text-slate-950 font-semibold text-sm flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download PDF
                    </button>
                  </div>
                </div>
              </iframe>
            </object>
          ) : (
            <div className="p-8 text-center text-white flex flex-col items-center justify-center h-full">
              <FileText className="w-16 h-16 text-amber-400 mb-3" />
              <h3 className="text-lg font-bold mb-1">Official Syllabus Document</h3>
              <p className="text-sm text-slate-300 max-w-md mb-4">
                {syllabus.description || 'Download the comprehensive syllabus guideline to view prescribed textbooks, term milestones, and assessment schemes.'}
              </p>
              <div className="flex gap-3">
                <a
                  href={syllabus.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 rounded-lg text-white font-medium text-sm flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Open in New Tab
                </a>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 rounded-lg text-slate-950 font-semibold text-sm flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Toolbar / Disclaimer */}
        <div className="px-5 py-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">
              St. Joseph International School &bull; Academic Directorate &bull; Narinda Campus
            </span>
          </div>
          <div className="text-[11px] font-mono">
            Downloads: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{syllabus.download_count}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
