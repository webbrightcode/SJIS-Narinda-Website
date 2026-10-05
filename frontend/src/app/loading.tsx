import React from 'react';

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-slate-50 space-y-12 animate-pulse">
      {/* Hero Skeleton */}
      <div className="w-full h-[620px] sm:h-[680px] lg:h-[750px] bg-slate-800 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="w-40 h-8 rounded-full bg-slate-700" />
            <div className="w-full max-w-xl h-14 rounded-2xl bg-slate-700" />
            <div className="w-3/4 h-6 rounded-xl bg-slate-700" />
            <div className="flex gap-4 pt-4">
              <div className="w-40 h-12 rounded-xl bg-slate-700" />
              <div className="w-36 h-12 rounded-xl bg-slate-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-3xl shadow-xl border border-slate-100">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2 p-4">
              <div className="w-24 h-8 rounded-xl skeleton" />
              <div className="w-32 h-4 rounded-md skeleton" />
            </div>
          ))}
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-32 h-6 rounded-full skeleton" />
          <div className="w-80 h-10 rounded-2xl skeleton" />
          <div className="w-96 h-4 rounded-md skeleton" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
              <div className="w-20 h-6 rounded-full skeleton" />
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
