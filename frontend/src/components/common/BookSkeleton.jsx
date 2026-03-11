import { Skeleton } from "@/components/ui/skeleton";

export default function BookSkeleton() {
  return (
    <div className="bg-white border border-gray-100 rounded-lg overflow-hidden flex flex-col h-full shadow-sm">
      {/* Cover Skeleton */}
      <div className="mx-4 mt-4 relative aspect-[3/4] rounded-r-md overflow-hidden bg-gray-50">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 rounded-md" />
        
        {/* Author */}
        <Skeleton className="h-4 w-1/2 rounded-md" />

        {/* Rating */}
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-3.5 w-3.5 rounded-full" />
          ))}
        </div>

        {/* Price & Bottom */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <Skeleton className="h-7 w-20 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
