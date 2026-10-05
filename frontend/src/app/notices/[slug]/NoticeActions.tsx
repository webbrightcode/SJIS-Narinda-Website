'use client';

import React, { useState, useEffect } from 'react';
import {
  Printer,
  Copy,
  Check,
  Share2,
  Download,
  Eye,
} from 'lucide-react';
import { incrementNoticeView } from '@/lib/api';

interface NoticeActionsProps {
  noticeId: number;
  noticeTitle: string;
  initialViewsCount: number;
  attachmentUrl?: string;
}

export const NoticeActions: React.FC<NoticeActionsProps> = ({
  noticeId,
  noticeTitle,
  initialViewsCount,
  attachmentUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const [views, setViews] = useState(initialViewsCount);

  useEffect(() => {
    // Increment view once per visitor session
    const storageKey = `sjis_notice_viewed_${noticeId}`;
    if (typeof window !== 'undefined' && !sessionStorage.getItem(storageKey)) {
      sessionStorage.setItem(storageKey, 'true');
      incrementNoticeView(noticeId).then((newCount) => {
        if (typeof newCount === 'number') {
          setViews(newCount);
        } else {
          setViews((prev) => prev + 1);
        }
      });
    }
  }, [noticeId]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleWhatsAppShare = () => {
    if (typeof window !== 'undefined') {
      const text = encodeURIComponent(`Official Notice: ${noticeTitle} - St. Joseph International School, Narinda: ${window.location.href}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all shadow-2xs cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all shadow-2xs cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>Print Circular</span>
        </button>

        <button
          onClick={handleWhatsAppShare}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition-all shadow-2xs cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Share WhatsApp</span>
        </button>
      </div>

      {attachmentUrl && (
        <a
          href={attachmentUrl}
          download
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00183F] hover:bg-[#C8102E] text-white font-bold transition-all shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Circular PDF</span>
        </a>
      )}
    </div>
  );
};
