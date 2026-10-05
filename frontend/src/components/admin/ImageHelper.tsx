'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ImageIcon, Upload, Sparkles, X, Check } from 'lucide-react';

interface ImageHelperProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export const ImageHelper: React.FC<ImageHelperProps> = ({
  value,
  onChange,
  label = 'Image URL',
  required = false,
}) => {
  const [showPresets, setShowPresets] = useState(false);

  const presets = [
    {
      title: 'Heritage Campus Quadrangle',
      url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Cambridge STEM & Robotics',
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Modern Science & Chemistry Lab',
      url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Grand Library & Study Hall',
      url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Sports & Football Ground',
      url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Annual Cultural Festival & Arts',
      url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Smart Interactive Classroom',
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Graduation & Convocation Ceremony',
      url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onChange(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          {label} {required && '*'}
        </label>
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold text-[#00183F] hover:text-[#C8102E] cursor-pointer flex items-center gap-1">
            <Upload className="w-3 h-3" />
            <span>Upload Device File</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="text-[11px] font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>{showPresets ? 'Hide Presets' : 'Choose Presets'}</span>
          </button>
        </div>
      </div>

      <input
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
        placeholder="https://images.unsplash.com/... or data:image/..."
      />

      {/* Preset Picker Tray */}
      {showPresets && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <div className="text-[10px] font-bold uppercase text-slate-400">
            Curated High-Resolution School Photography
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setShowPresets(false);
                }}
                className={`relative h-20 rounded-xl overflow-hidden border text-left group transition-all ${
                  value === preset.url ? 'ring-2 ring-[#00183F] border-transparent' : 'border-slate-200 hover:opacity-90'
                }`}
              >
                <Image src={preset.url} alt={preset.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-1.5 flex flex-col justify-end">
                  <span className="text-[10px] font-bold text-white line-clamp-1 leading-tight">
                    {preset.title}
                  </span>
                </div>
                {value === preset.url && (
                  <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live Preview */}
      {value && (
        <div className="relative h-32 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group">
          <Image
            src={value}
            alt="Asset Preview"
            fill
            className="object-contain p-2"
            unoptimized={value.startsWith('data:') || value.endsWith('.svg')}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-md hover:bg-rose-700"
            >
              <X className="w-3.5 h-3.5" />
              Remove Image
            </button>
          </div>
          <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded">
            Live Preview
          </span>
        </div>
      )}
    </div>
  );
};
