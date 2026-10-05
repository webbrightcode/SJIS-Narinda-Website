import React from 'react';

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-slate-50">
      {/* Header Banner Skeleton */}
      <div className="w-full py-20 bg-[#00183F] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-32 h-6 rounded-full bg-slate-700/80" />
        <div className="w-72 sm:w-96 h-12 rounded-2xl bg-slate-700/80" />
        <div className="w-64 sm:w-80 h-4 rounded-md bg-slate-700/80" />
      </div>

      {/* Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        <div className="flex gap-3 overflow-hidden pb-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-28 h-9 rounded-xl skeleton shrink-0" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex justify-between items-center">
                <div className="w-20 h-6 rounded-full skeleton" />
                <div className="w-24 h-4 rounded-md skeleton" />
              </div>
              <div className="w-full h-8 rounded-xl skeleton" />
              <div className="w-3/4 h-4 rounded-md skeleton" />
              <div className="w-1/2 h-4 rounded-md skeleton" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
