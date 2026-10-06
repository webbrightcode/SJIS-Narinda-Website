'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { BLUR_DATA_URL } from '@/lib/blur';

type FadeImageProps = ImageProps & {
  fade?: boolean;
  fallbackSrc?: string;
};

/**
 * next/image with a navy blur placeholder and a soft fade-in once decoded.
 * Pass fade={false} for above-the-fold/priority images so they never start hidden.
 * Automatically handles unoptimized for media/upload paths, and provides fallback on error.
 */
export const FadeImage: React.FC<FadeImageProps> = ({
  fade = true,
  className = '',
  onLoad,
  onError,
  src,
  fallbackSrc,
  unoptimized,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);

  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const isData = typeof imgSrc === 'string' && imgSrc.startsWith('data:');
  const isMedia = typeof imgSrc === 'string' && (imgSrc.startsWith('/media/') || imgSrc.includes('/media/'));
  const isUnoptimized = unoptimized ?? (isMedia || isData);

  return (
    <Image
      {...rest}
      src={imgSrc}
      unoptimized={isUnoptimized}
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
        if (fallbackSrc && imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
        setLoaded(true);
        onError?.(e);
      }}
      className={`${className} ${fade ? (loaded ? 'animate-img-in' : 'opacity-0') : ''}`}
    />
  );
};
