import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Current Weather Card Skeleton */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="h-4 w-48 bg-slate-800 rounded" />
            <div className="h-10 w-64 bg-slate-800 rounded" />
            <div className="flex items-center gap-6 pt-2">
              <div className="h-20 w-36 bg-slate-800 rounded" />
              <div className="space-y-2">
                <div className="h-6 w-32 bg-slate-800 rounded" />
                <div className="h-4 w-44 bg-slate-800 rounded" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="h-20 bg-slate-900/80 rounded-lg border border-slate-800/60" />
            <div className="h-20 bg-slate-900/80 rounded-lg border border-slate-800/60" />
            <div className="h-20 bg-slate-900/80 rounded-lg border border-slate-800/60" />
            <div className="h-20 bg-slate-900/80 rounded-lg border border-slate-800/60" />
          </div>
        </div>
      </div>

      {/* Recommendations Skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-52 bg-slate-800 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="h-28 bg-slate-900/70 border border-slate-800 rounded-xl" />
          <div className="h-28 bg-slate-900/70 border border-slate-800 rounded-xl" />
          <div className="h-28 bg-slate-900/70 border border-slate-800 rounded-xl" />
        </div>
      </div>

      {/* 7-Day Forecast Skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-44 bg-slate-800 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-36 bg-slate-900/70 border border-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
};
