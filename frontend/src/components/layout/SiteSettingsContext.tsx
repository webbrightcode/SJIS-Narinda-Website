'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteSettings } from '@/lib/types';
import { DEFAULT_SITE_SETTINGS, getSiteSettings } from '@/lib/api';

const SiteSettingsContext = createContext<SiteSettings>(DEFAULT_SITE_SETTINGS);

/**
 * Loads admin-managed site settings (contact, hours, location, highlights...)
 * once on mount and refreshes whenever the tab regains focus, so edits made in
 * the admin panel appear without a manual reload.
 */
const sanitize = (raw: SiteSettings): SiteSettings => {
  const s = { ...raw };
  if (s.accreditation_label) {
    s.accreditation_label = s.accreditation_label.replace(/·\s*BD\d+/gi, '').replace(/BD\d+/gi, '').trim();
    if (s.accreditation_label === 'Cambridge Registered Centre' || !s.accreditation_label) {
      s.accreditation_label = 'Cambridge International Curriculum';
    }
  }
  if (s.school_subtitle) {
    s.school_subtitle = s.school_subtitle.replace(/·\s*1954/gi, '').replace(/Est\.?\s*1954/gi, '').trim();
  }
  return s;
};

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(sanitize(DEFAULT_SITE_SETTINGS));

  useEffect(() => {
    let cancelled = false;

    // 1. Instant check from localStorage
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('sjis_site_settings');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const clean = sanitize({ ...DEFAULT_SITE_SETTINGS, ...parsed });
          setSettings(clean);
          localStorage.setItem('sjis_site_settings', JSON.stringify(clean));
        } catch (e) {}
      }
    }

    // 2. Fetch fresh from backend
    const load = async () => {
      const data = await getSiteSettings();
      if (!cancelled && data) {
        const clean = sanitize({ ...DEFAULT_SITE_SETTINGS, ...data });
        setSettings(clean);
        if (typeof window !== 'undefined') {
          localStorage.setItem('sjis_site_settings', JSON.stringify(clean));
        }
      }
    };
    load();

    // 3. Listen for internal real-time events (same-window or admin console)
    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setSettings((prev) => ({ ...prev, ...e.detail }));
      } else {
        load();
      }
    };

    // 4. Listen for cross-tab localStorage updates
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sjis_site_settings' && e.newValue) {
        try {
          setSettings((prev) => ({ ...prev, ...JSON.parse(e.newValue!) }));
        } catch (err) {}
      }
    };

    window.addEventListener('sjis_settings_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', load);

    return () => {
      cancelled = true;
      window.removeEventListener('sjis_settings_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', load);
    };
  }, []);

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
};

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const telHref = (phone: string) => `tel:${phone.replace(/[^+\d]/g, '')}`;
