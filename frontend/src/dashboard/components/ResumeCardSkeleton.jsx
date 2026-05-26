import React from 'react';

export default function ResumeCardSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="h-[280px] bg-slate-800 rounded-t-xl border border-slate-700 p-4 flex flex-col">
        <div className="flex-1 bg-slate-700/60 rounded-md" />
        <div className="h-4 bg-slate-700 rounded w-3/4 mx-auto mt-4" />
        <div className="h-3 bg-slate-700/80 rounded w-1/2 mx-auto mt-2" />
      </div>
      <div className="h-12 bg-slate-700 rounded-b-xl" />
    </div>
  );
}
