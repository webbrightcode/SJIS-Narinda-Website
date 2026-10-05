'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1800,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          // Extract number and non-numeric prefix/suffix
          // Examples: "3,200+" -> prefix "", num 3200, suffix "+", hasComma true
          // "100%" -> prefix "", num 100, suffix "%"
          const match = value.match(/^([^0-9]*)([0-9,.]+)([^0-9]*)$/);

          if (!match) {
            setDisplayValue(value);
            return;
          }

          const prefix = match[1] || '';
          const rawNumStr = match[2];
          const suffix = match[3] || '';
          const hasComma = rawNumStr.includes(',');
          const targetNum = parseFloat(rawNumStr.replace(/,/g, ''));

          if (isNaN(targetNum)) {
            setDisplayValue(value);
            return;
          }

          const startTime = performance.now();

          const updateCount = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out expo curve for organic deceleration
            const easeOutProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentNum = Math.floor(easeOutProgress * targetNum);

            const formattedNum = hasComma
              ? currentNum.toLocaleString('en-US')
              : currentNum.toString();

            setDisplayValue(`${prefix}${formattedNum}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(updateCount);
        }
      },
      { threshold: 0.15 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, duration, hasAnimated]);

  return (
    <span ref={elementRef} className={`inline-block tabular-nums ${className}`}>
      {displayValue}
    </span>
  );
};
