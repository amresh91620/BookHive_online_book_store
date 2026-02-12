import React from 'react';

const SkeletonCard = ({ variant = 'default' }) => {
  if (variant === 'book') {
    return (
      <div className="animate-pulse bg-white rounded-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-200 aspect-[3/4]" />
        <div className="p-5 space-y-3">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
          <div className="h-8 bg-slate-50 rounded mt-4" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="animate-pulse bg-white rounded-xl p-6 border border-slate-100">
      <div className="space-y-3">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
      </div>
    </div>
  );
};

export const SkeletonGrid = ({
  count = 8,
  variant = 'default',
  className = '',
}) => (
  <div
    className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-8 sm:gap-y-10 md:gap-y-12 lg:gap-y-16 ${className}`}
  >
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} variant={variant} />
    ))}
  </div>
);

export const SkeletonList = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
