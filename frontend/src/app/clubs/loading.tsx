import React from 'react';

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="w-full py-20 bg-[#00183F] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-32 h-6 rounded-full bg-slate-700/80" />
        <div className="w-72 sm:w-96 h-12 rounded-2xl bg-slate-700/80" />
        <div className="w-64 sm:w-80 h-4 rounded-md bg-slate-700/80" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs">
              <div className="h-48 skeleton" />
              <div className="p-6 space-y-3">
                <div className="w-24 h-6 rounded-full skeleton" />
                <div className="w-3/4 h-7 rounded-xl skeleton" />
                <div className="w-full h-4 rounded-md skeleton" />
                <div className="w-2/3 h-4 rounded-md skeleton" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
