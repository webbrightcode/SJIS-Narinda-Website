'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Layers,
  X,
  Star,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Maximize2,
} from 'lucide-react';
import { FadeImage as Image } from '@/components/ui/FadeImage';
import { uploadMediaFile } from '@/lib/api';

interface BulkPhotoUploaderProps {
  images: string[];
  coverImage: string;
  onImagesChange: (images: string[]) => void;
  onCoverChange?: (coverUrl: string) => void;
  token?: string;
  showToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export function BulkPhotoUploader({
  images,
  coverImage,
  onImagesChange,
  onCoverChange,
  token,
  showToast,
}: BulkPhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    percent: number;
    fileName: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parallel batch upload processor (chunks of 3 concurrent uploads for max speed)
  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
      if (files.length === 0) {
        showToast?.('Please select valid image files (JPG, PNG, WebP).', 'error');
        return;
      }

      setUploading(true);
      const total = files.length;
      let completed = 0;
      const uploadedUrls: string[] = [];

      // Concurrency worker
      const concurrency = 3;
      let fileIdx = 0;

      const uploadWorker = async () => {
        while (fileIdx < total) {
          const currentIdx = fileIdx++;
          const file = files[currentIdx];

          setUploadProgress({
            current: completed + 1,
            total,
            percent: Math.round(((completed) / total) * 100),
            fileName: file.name,
          });

          try {
            const res = await uploadMediaFile(file, token);
            if (res && res.url) {
              uploadedUrls.push(res.url);
            } else {
              // Client-side fallback if server unreachable
              const dataUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
              });
              if (dataUrl) uploadedUrls.push(dataUrl);
            }
          } catch (err) {
            console.error('Error uploading file', file.name, err);
          } finally {
            completed++;
            setUploadProgress({
              current: completed,
              total,
              percent: Math.round((completed / total) * 100),
              fileName: file.name,
            });
          }
        }
      };

      const workers = Array.from({ length: Math.min(concurrency, total) }, () =>
        uploadWorker()
      );
      await Promise.all(workers);

      // If album had no cover or fallback placeholder, set 1st uploaded photo as cover
      if (
        (!coverImage || coverImage.includes('unsplash.com')) &&
        uploadedUrls.length > 0 &&
        onCoverChange
      ) {
        const [first, ...rest] = uploadedUrls;
        onCoverChange(first);
        onImagesChange([...images, ...rest]);
        showToast?.(`Uploaded ${uploadedUrls.length} photos! 1st photo set as Album Cover.`);
      } else {
        onImagesChange([...images, ...uploadedUrls]);
        showToast?.(`Successfully added ${uploadedUrls.length} photos to the album!`);
      }

      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [images, coverImage, onImagesChange, onCoverChange, token, showToast]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (idxToRemove: number) => {
    onImagesChange(images.filter((_, idx) => idx !== idxToRemove));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const reordered = [...images];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    onImagesChange(reordered);
  };

  const setAsCover = (idx: number) => {
    if (!onCoverChange) return;
    const newCover = images[idx];
    const oldCover = coverImage;
    const updatedImages = [...images];
    if (oldCover && !oldCover.includes('unsplash.com')) {
      updatedImages[idx] = oldCover;
    } else {
      updatedImages.splice(idx, 1);
    }
    onCoverChange(newCover);
    onImagesChange(updatedImages);
    showToast?.('Set as album cover photo!');
  };

  const totalAlbumPhotos = (coverImage ? 1 : 0) + images.length;

  return (
    <div className="border border-slate-200 bg-slate-50/60 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Header with Photo Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div>
          <h4 className="text-sm font-black text-[#00183F] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <span>Album Photo Collection</span>
          </h4>
          <p className="text-[11px] text-slate-500">
            Upload all photographs taken during this event (e.g. 10, 20, 50+ photos).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-2xs">
            {images.length} Extra Photos (Total {totalAlbumPhotos} in Album)
          </span>

          {images.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Remove all extra photos from this album?')) {
                  onImagesChange([]);
                  showToast?.('Cleared extra photos.');
                }
              }}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Clear Extra
            </button>
          )}
        </div>
      </div>

      {/* PRO DRAG & DROP ZONE */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-[#00183F] bg-blue-50/80 scale-[1.01]'
            : 'border-slate-300 hover:border-[#00183F] bg-white hover:bg-slate-50/80'
        } ${uploading ? 'pointer-events-none opacity-80' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />

        {uploading && uploadProgress ? (
          <div className="space-y-3 max-w-md mx-auto">
            <Loader2 className="w-8 h-8 text-[#00183F] animate-spin mx-auto" />
            <div>
              <p className="text-xs font-bold text-[#00183F]">
                Uploading {uploadProgress.current} of {uploadProgress.total} photos...
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {uploadProgress.fileName}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#D4AF37] h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress.percent}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-slate-600">
              {uploadProgress.percent}% completed
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#00183F]/5 border border-[#00183F]/10 flex items-center justify-center text-[#00183F] mx-auto">
              <Upload className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#00183F]">
                Drag & drop photos here, or{' '}
                <span className="text-[#D4AF37] underline">browse files</span>
              </span>
              <p className="text-xs text-slate-500 mt-1">
                Select multiple photos at once (JPG, PNG, WebP). Optimized automatically for ultra-fast loading.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* THUMBNAILS GRID (Extra Photos) */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
            <span>Extra Photos in Album ({images.length})</span>
            <span className="text-[11px] font-normal text-slate-400">
              Hover over a photo to make it the cover or reorder
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-72 overflow-y-auto p-1 scrollbar-thin">
            {images.map((imgUrl, idx) => (
              <div
                key={idx}
                className="group relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs"
              >
                <Image
                  src={imgUrl}
                  alt={`Album photo ${idx + 2}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  fallbackSrc="https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1200&auto=format&fit=crop"
                />

                {/* Index tag */}
                <div className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs z-10">
                  #{idx + 2}
                </div>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-20">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setAsCover(idx)}
                      className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#D4AF37] hover:bg-amber-400 text-[#00183F] px-2 py-0.5 rounded-md shadow-xs transition-colors cursor-pointer"
                      title="Set as Album Cover Photo"
                    >
                      <Star className="w-3 h-3 fill-[#00183F]" />
                      <span>Make Cover</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
                      title="Remove from album"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Move Left / Right Controls */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveImage(idx, idx - 1)}
                      className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white disabled:opacity-20 cursor-pointer"
                      title="Move earlier"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                    <span className="text-[10px] font-bold text-white">Reorder</span>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => moveImage(idx, idx + 1)}
                      className="p-1 rounded-md bg-white/20 hover:bg-white/40 text-white disabled:opacity-20 cursor-pointer"
                      title="Move later"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

