'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  Download,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  RotateCcw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface FlipbookReaderProps {
  pdfUrl: string;
  title: string;
  coverImageUrl?: string;
  edition?: string;
  onClose?: () => void;
  isModal?: boolean;
}

declare global {
  interface Window {
    jQuery?: any;
    $?: any;
    DFLIP?: any;
    dFlip?: any;
  }
}

export const FlipbookReader: React.FC<FlipbookReaderProps> = ({
  pdfUrl,
  title,
  coverImageUrl,
  edition,
  onClose,
  isModal = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const flipbookInstanceRef = useRef<any>(null);

  // Helper to load stylesheet dynamically
  const loadCss = (href: string) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    document.head.appendChild(link);
  };

  // Helper to load script sequentially
  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    let isCancelled = false;

    // Load styles
    loadCss('/dflip/css/dflip.min.css');
    loadCss('/dflip/css/themify-icons.min.css');

    // Configure global DearFlip root
    window.DFLIP = window.DFLIP || {};
    window.DFLIP.pluginRoot = '/dflip/';

    const initFlipbook = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Load jQuery if not already present
        if (!window.jQuery) {
          await loadScript('/dflip/js/libs/jquery.min.js');
        }

        // 2. Load DearFlip library
        if (!window.jQuery?.fn?.flipBook) {
          await loadScript('/dflip/js/dflip.min.js');
        }

        if (isCancelled || !containerRef.current) return;

        const $ = window.jQuery;
        if (!$ || !$.fn || !$.fn.flipBook) {
          throw new Error('DearFlip flipbook plugin could not be initialized.');
        }

        // Clean any existing container contents
        $(containerRef.current).empty();

        // 3. Initialize realistic 3D flipbook
        const options = {
          webgl: true,
          soundEnable: soundEnabled,
          height: isModal ? '100%' : 700,
          pluginRoot: '/dflip/',
          backgroundColor: '#050D1A',
          color: '#D4AF37',
          enableDownload: true,
          autoEnableOutline: true,
          autoEnableThumbnail: true,
          overwritePDFAnnotation: true,
          hard: 'cover',
          duration: 750,
          controlsPosition: 'bottom',
          onFlip: () => {},
        };

        const instance = $(containerRef.current).flipBook(pdfUrl, options);
        flipbookInstanceRef.current = instance;

        setLoading(false);
      } catch (err: any) {
        console.error('Flipbook initialization error:', err);
        if (!isCancelled) {
          setError('Could not load 3D flipbook engine. You can read or download the PDF directly.');
          setLoading(false);
        }
      }
    };

    initFlipbook();

    return () => {
      isCancelled = true;
      if (flipbookInstanceRef.current && flipbookInstanceRef.current.dispose) {
        try {
          flipbookInstanceRef.current.dispose();
        } catch {}
      }
    };
  }, [pdfUrl, soundEnabled, isModal]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      className={`flex flex-col bg-[#050D1A] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative ${
        isModal ? 'h-[90vh] w-full max-w-6xl' : 'min-h-[720px] w-full my-6'
      }`}
    >
      {/* Top Reader Controls Bar */}
      <div className="h-14 bg-gradient-to-r from-[#030712] via-[#00183F] to-[#030712] px-4 sm:px-6 flex items-center justify-between border-b border-white/10 shrink-0 select-none text-white z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-bold text-slate-100 truncate flex items-center gap-2">
              <span className="truncate">{title}</span>
              {edition && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-[10px] font-bold shrink-0">
                  {edition}
                </span>
              )}
            </h3>
            <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
              <span>Realistic 3D Page-Flip Mode</span>
              <span>•</span>
              <span className="text-amber-400/90 font-medium">Turn pages by clicking corners or dragging</span>
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title={soundEnabled ? 'Mute Page Flip Sound' : 'Enable Page Flip Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#D4AF37]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <a
            href={pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Download PDF Document"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span className="hidden md:inline">Download</span>
          </a>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Reader'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-600/80 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Reader Stage Area */}
      <div className="flex-1 relative overflow-hidden bg-[#070F1E] flex items-center justify-center min-h-[500px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#070F1E]/95 backdrop-blur-sm gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37]" />
            <p className="text-xs font-semibold text-slate-200">Preparing 3D DearFlip Reader Engine...</p>
            <p className="text-[11px] text-slate-400">Loading high-resolution book pages and textures</p>
          </div>
        )}

        {error ? (
          <div className="p-8 text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white">Interactive Flipbook Fallback</h4>
            <p className="text-xs text-slate-300">{error}</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#00183F] border border-amber-400/40 text-amber-300 hover:text-white text-xs font-bold flex items-center gap-2 shadow-lg"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Native PDF Viewer</span>
              </a>
              <a
                href={pdfUrl}
                download
                className="px-5 py-2.5 rounded-xl bg-[#C8102E] text-white text-xs font-bold flex items-center gap-2 shadow-lg"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="w-full h-full min-h-[550px]"
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>

      {/* Subtle Reader Bottom Guide */}
      <div className="h-8 bg-[#030712] border-t border-white/5 px-4 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Interactive 3D WebGL Book Engine Active</span>
        </span>
        <span className="hidden sm:inline text-slate-500">
          St. Joseph International School, Narinda • Publications Archive
        </span>
      </div>
    </div>
  );
};
