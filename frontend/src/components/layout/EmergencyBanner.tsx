'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, Info, Bell, ArrowRight, X } from 'lucide-react';
import { getAboutInfo } from '@/lib/api';
import { EmergencyAlert } from '@/lib/types';

export const EmergencyBanner: React.FC = () => {
  const [alert, setAlert] = useState<EmergencyAlert | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function loadAlert() {
      try {
        const info = await getAboutInfo();
        if (info?.emergency_alert && info.emergency_alert.is_active && info.emergency_alert.message) {
          setAlert(info.emergency_alert);
        }
      } catch (e) {}
    }
    loadAlert();
  }, []);

  if (!alert || !alert.is_active || dismissed) return null;

  const bgStyles = {
    urgent: 'bg-gradient-to-r from-[#990000] via-[#C8102E] to-[#800000] text-white border-b-2 border-red-700',
    warning: 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white border-b-2 border-amber-800',
    info: 'bg-gradient-to-r from-[#00183F] via-[#0D2852] to-[#00183F] text-amber-200 border-b-2 border-[#D4AF37]',
  }[alert.type] || 'bg-[#C8102E] text-white';

  const Icon = alert.type === 'urgent' ? AlertTriangle : alert.type === 'warning' ? Bell : Info;

  return (
    <div className={`relative z-50 px-4 py-2.5 text-xs font-semibold shadow-md transition-all ${bgStyles}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <span className="p-1 rounded bg-white/20 shrink-0">
            <Icon className="w-4 h-4 animate-pulse text-white" />
          </span>
          <span className="truncate tracking-wide text-xs sm:text-sm">
            <strong className="uppercase mr-1.5 font-black tracking-wider text-[11px] bg-white/25 px-1.5 py-0.5 rounded">
              {alert.type === 'urgent' ? 'Campus Emergency' : alert.type === 'warning' ? 'Important Notice' : 'Campus Bulletin'}:
            </strong>
            {alert.message}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {alert.link_url && (
            <Link
              href={alert.link_url}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white text-[#00183F] hover:bg-slate-100 font-bold text-[11px] transition-transform active:scale-95 shadow-sm"
            >
              <span>{alert.link_text || 'Learn More'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
            title="Dismiss Announcement"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
