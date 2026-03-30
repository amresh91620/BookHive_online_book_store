import { Skeleton } from "@/components/ui/skeleton";

export default function BookSkeleton() {
  return (
    <div className="bg-white border-2 border-stone-200 rounded-xl overflow-hidden flex flex-col h-full shadow-soft animate-pulse">
      {/* Cover Skeleton with shimmer effect */}
      <div className="mx-4 mt-4 relative aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Title - 2 lines */}
        <div className="space-y-2">
          <div className="h-5 bg-gradient-to-r from-stone-200 to-stone-100 rounded-md w-full"></div>
          <div className="h-5 bg-gradient-to-r from-stone-200 to-stone-100 rounded-md w-3/4"></div>
        </div>
        
        {/* Author */}
        <div className="h-4 bg-gradient-to-r from-stone-150 to-stone-100 rounded-md w-1/2"></div>

        {/* Rating */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 w-4 bg-amber-100 rounded-full"></div>
          ))}
        </div>

        {/* Price & Button */}
        <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
          <div className="h-7 w-24 bg-gradient-to-r from-amber-200 to-amber-100 rounded-lg"></div>
          <div className="h-9 w-28 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
