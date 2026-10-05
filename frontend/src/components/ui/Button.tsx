import React from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  disabled = false,
  loading = false,
  type = 'button',
}) => {
  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs font-semibold gap-1.5 rounded-lg',
    md: 'px-5 py-2.5 text-sm font-semibold gap-2 rounded-xl',
    lg: 'px-7 py-3.5 text-base font-bold gap-2.5 rounded-xl shadow-lg',
  };

  const variantStyles = {
    primary:
      'bg-[#00183F] hover:bg-[#0D2852] text-white shadow-md shadow-[#00183F]/20 hover:shadow-lg hover:shadow-[#00183F]/30 hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-[#C8102E] hover:bg-[#A00B22] text-white shadow-md shadow-[#C8102E]/25 hover:shadow-lg hover:shadow-[#C8102E]/35 hover:-translate-y-0.5 active:translate-y-0',
    gold:
      'bg-gradient-to-r from-[#D4AF37] to-[#E5A823] hover:from-[#E5A823] hover:to-[#D4AF37] text-[#00183F] font-bold shadow-md shadow-amber-500/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
    outline:
      'border-2 border-[#00183F] text-[#00183F] hover:bg-[#00183F] hover:text-white',
    ghost:
      'text-slate-700 hover:text-[#00183F] hover:bg-slate-100/80',
  };

  const isDisabled = disabled || loading;
  const baseClasses = `inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href && !isDisabled) {
    return (
      <Link href={href} className={baseClasses}>
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      className={baseClasses}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
