'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { TopHeader } from '@/components/layout/TopHeader';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EmergencyBanner } from '@/components/layout/EmergencyBanner';

import { SiteSettingsProvider } from '@/components/layout/SiteSettingsContext';
import { BackToTop } from '@/components/layout/BackToTop';
import { QuickInquiryFloating } from '@/components/layout/QuickInquiryFloating';
import { RouteProgressBar } from '@/components/layout/RouteProgressBar';
import { BrandSplash } from '@/components/layout/BrandSplash';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    // In admin portal: do not show public website TopHeader, Navbar, or public Footer
    return <main className="flex-1">{children}</main>;
  }

  return (
    <SiteSettingsProvider>
      <BrandSplash />
      <React.Suspense fallback={null}>
        <RouteProgressBar />
      </React.Suspense>
      <EmergencyBanner />
      <TopHeader />
      <Navbar />
      <main className="flex-1 w-full max-w-full">{children}</main>
      <Footer />
      <BackToTop />
      <QuickInquiryFloating />
    </SiteSettingsProvider>
  );
};
