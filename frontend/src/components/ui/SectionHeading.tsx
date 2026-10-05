import React from 'react';
import { Badge } from './Badge';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  centered = true,
  light = false,
  className = '',
}) => {
  return (
    <div
      className={`max-w-3xl mb-12 ${centered ? 'mx-auto text-center' : 'text-left'} ${className}`}
    >
      {badge && (
        <div className="mb-3">
          <Badge variant="gold">{badge}</Badge>
        </div>
      )}
      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight ${
          light ? 'text-white' : 'text-[#00183F]'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            light ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`mt-5 flex items-center gap-2 ${
          centered ? 'justify-center' : 'justify-start'
        }`}
      >
        <span className="w-12 h-1 bg-[#C8102E] rounded-full" />
        <span className="w-3 h-1 bg-[#D4AF37] rounded-full" />
        <span className="w-1.5 h-1 bg-[#00183F] rounded-full" />
      </div>
    </div>
  );
};
