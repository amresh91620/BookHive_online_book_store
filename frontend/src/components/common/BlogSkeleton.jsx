/**
 * BlogSkeleton — matches the BlogCard's real layout with brand cream shimmer.
 * Mirrors the exact image aspect ratio, category pill, title, excerpt, and meta row.
 */
export default function BlogSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden h-full flex flex-col border border-[#f0e4d6]"
      style={{ boxShadow: '0 4px 20px rgba(217,118,66,0.06)' }}
    >
      {/* Cover image skeleton */}
      <div className="relative h-56 overflow-hidden skeleton-wave">
        <div className="skeleton-overlay" />
        {/* Category pill position */}
        <div className="absolute bottom-4 left-4 h-6 w-20 rounded-full skeleton-wave-orange" />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 skeleton-wave rounded w-full" />
          <div className="h-6 skeleton-wave rounded w-3/4" />
        </div>

        {/* Excerpt */}
        <div className="space-y-2 flex-1">
          <div className="h-4 skeleton-wave rounded w-full" />
          <div className="h-4 skeleton-wave rounded w-5/6" />
          <div className="h-4 skeleton-wave rounded w-4/6" />
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between pt-4 border-t border-[#f5ece3]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 skeleton-wave rounded-full" />
            <div className="h-3 skeleton-wave rounded w-20" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 skeleton-wave rounded-full" />
            <div className="h-3 skeleton-wave rounded w-14" />
          </div>
        </div>

        {/* Continue Reading row */}
        <div className="flex items-center gap-2 mt-1">
          <div className="h-4 w-28 skeleton-wave-orange rounded" />
          <div className="h-4 w-4 skeleton-wave-orange rounded" />
        </div>
      </div>
    </div>
  );
}
