import React from 'react';

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="w-full py-24 bg-[#00183F] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-32 h-6 rounded-full bg-slate-700/80" />
        <div className="w-72 sm:w-96 h-12 rounded-2xl bg-slate-700/80" />
        <div className="w-64 sm:w-80 h-4 rounded-md bg-slate-700/80" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="w-32 h-6 rounded-full skeleton" />
            <div className="w-3/4 h-10 rounded-2xl skeleton" />
            <div className="w-full h-24 rounded-xl skeleton" />
          </div>
          <div className="lg:col-span-6 h-96 rounded-3xl skeleton" />
        </div>
      </div>
    </div>
  );
}
