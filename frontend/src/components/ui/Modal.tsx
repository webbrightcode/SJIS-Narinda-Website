'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  accentBar?: boolean;
  closeOnBackdrop?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  badge,
  footer,
  children,
  maxWidth = 'lg',
  accentBar = true,
  closeOnBackdrop = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-4xl',
    '3xl': 'max-w-5xl',
    '4xl': 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop with heavy blur and deep dark tint */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Modal Dialog Box */}
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 transform transition-all animate-in fade-in zoom-in-95 duration-200 my-auto`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Institutional Accent Line */}
        {accentBar && (
          <div className="h-1.5 w-full bg-gradient-to-r from-[#00183F] via-[#D4AF37] to-[#C8102E]" />
        )}

        {/* Modal Header */}
        {(title || icon || subtitle) && (
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white">
            <div className="flex items-center gap-3.5 min-w-0 pr-4">
              {icon && (
                <div className="w-10 h-10 rounded-2xl bg-[#00183F]/5 border border-[#00183F]/10 flex items-center justify-center text-[#00183F] shrink-0 shadow-xs">
                  {icon}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {typeof title === 'string' ? (
                    <h3 className="text-lg sm:text-xl font-black text-[#00183F] tracking-tight truncate">
                      {title}
                    </h3>
                  ) : (
                    title
                  )}
                  {badge && <div className="shrink-0">{badge}</div>}
                </div>
                {subtitle && (
                  <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline-block text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                ESC
              </span>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent hover:border-slate-200 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6 sm:p-8 max-h-[calc(85vh-9rem)] overflow-y-auto overscroll-contain">
          {children}
        </div>

        {/* Optional Modal Footer */}
        {footer && (
          <div className="px-6 sm:px-8 py-4 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
