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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl skeleton" />
          ))}
        </div>
      </div>
    </div>
  );
}
