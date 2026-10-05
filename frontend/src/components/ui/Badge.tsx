import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'crimson' | 'navy' | 'emerald' | 'slate';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'gold',
  className = '',
}) => {
  const variantStyles = {
    gold: 'bg-amber-50 text-amber-900 border-amber-300/80 shadow-sm',
    crimson: 'bg-rose-50 text-rose-800 border-rose-200 shadow-sm',
    navy: 'bg-[#00183F]/10 text-[#00183F] border-[#00183F]/20',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${variantStyles[variant]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-pulse" />
      {children}
    </span>
  );
};
