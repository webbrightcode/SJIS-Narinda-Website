'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { BLUR_DATA_URL } from '@/lib/blur';

type FadeImageProps = ImageProps & { fade?: boolean };

/**
 * next/image with a navy blur placeholder and a soft fade-in once decoded.
 * Pass fade={false} for above-the-fold/priority images so they never start hidden.
 */
export const FadeImage: React.FC<FadeImageProps> = ({
  fade = true,
  className = '',
  onLoad,
  onError,
  src,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const isData = typeof src === 'string' && src.startsWith('data:');

  return (
    <Image
      {...rest}
      src={src}
      ref={(el) => {
        if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
      }}
      placeholder={isData ? 'empty' : 'blur'}
      blurDataURL={BLUR_DATA_URL}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      onError={(e) => {
        setLoaded(true);
        onError?.(e);
      }}
      className={`${className} ${fade ? (loaded ? 'animate-img-in' : 'opacity-0') : ''}`}
    />
  );
};
