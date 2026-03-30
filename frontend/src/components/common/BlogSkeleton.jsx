export default function BlogSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 h-full flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-stone-200 via-stone-100 to-stone-200 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-6 flex flex-col flex-1">
        {/* Category */}
        <div className="mb-4">
          <div className="h-3 w-20 bg-gradient-to-r from-amber-200 to-amber-100 rounded"></div>
        </div>
        
        {/* Title */}
        <div className="space-y-2 mb-3">
          <div className="h-6 bg-gradient-to-r from-stone-200 to-stone-100 rounded w-full"></div>
          <div className="h-6 bg-gradient-to-r from-stone-200 to-stone-100 rounded w-3/4"></div>
        </div>
        
        {/* Excerpt */}
        <div className="space-y-2 flex-1 mb-6">
          <div className="h-4 bg-gradient-to-r from-stone-150 to-stone-100 rounded w-full"></div>
          <div className="h-4 bg-gradient-to-r from-stone-150 to-stone-100 rounded w-5/6"></div>
        </div>
        
        {/* Meta Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="h-3 w-24 bg-gradient-to-r from-stone-150 to-stone-100 rounded"></div>
          <div className="flex gap-4">
            <div className="h-3 w-16 bg-gradient-to-r from-stone-150 to-stone-100 rounded"></div>
            <div className="h-3 w-12 bg-gradient-to-r from-stone-150 to-stone-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
