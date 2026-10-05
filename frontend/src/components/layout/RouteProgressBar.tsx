'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const RouteProgressBar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Complete progress on route change
  useEffect(() => {
    setProgress(100);
    const timeout = setTimeout(() => {
      setLoading(false);
      setProgress(0);
    }, 300);
    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  // Intercept anchor clicks to start progress bar immediately
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (
        href &&
        href.startsWith('/') &&
        !href.startsWith('/#') &&
        !target.hasAttribute('download') &&
        target.getAttribute('target') !== '_blank' &&
        href !== pathname
      ) {
        setLoading(true);
        setProgress(30);
        setTimeout(() => setProgress(70), 150);
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-[#D4AF37] via-[#C8102E] to-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.8)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition: progress === 100 ? 'width 0.2s ease-out, opacity 0.3s 0.1s ease-in' : 'width 0.3s ease-out',
        }}
      />
    </div>
  );
};
