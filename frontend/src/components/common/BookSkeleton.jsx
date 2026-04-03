import { Skeleton } from "@/components/ui/skeleton";

export default function BookSkeleton() {
  return (
    <div className="relative rounded-xl shadow-md h-full flex flex-col bg-white overflow-hidden border border-gray-100 animate-pulse">
      
      {/* Book Image Container with 3D Effect Skeleton */}
      <div className="relative bg-gray-50 p-4 md:p-5 lg:p-6 flex items-center justify-center" style={{ minHeight: '240px' }}>
        {/* 3D Shadow Circle */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[60%] h-6 bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full blur-lg"></div>
        
        {/* Wishlist Button Skeleton - Top Left */}
        <div className="absolute left-2 top-2 z-20 rounded-full bg-gray-200 p-2 w-9 h-9"></div>

        {/* 3D Book Skeleton */}
        <div className="relative w-[75%] md:w-[70%] lg:w-[65%] max-w-[180px]">
          <div 
            className="relative aspect-[2/3] rounded-sm shadow-2xl overflow-hidden bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200"
            style={{ 
              transform: 'perspective(1200px) rotateY(-12deg)',
              boxShadow: '12px 12px 35px rgba(0,0,0,0.15), -4px 0 12px rgba(0,0,0,0.08)'
            }}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
            
            {/* Book Spine Shadow */}
            <div className="absolute left-0 top-0 h-full w-3 bg-gradient-to-r from-gray-300/50 via-gray-200/30 to-transparent rounded-l-sm" />
            
            {/* Book Edge Highlight */}
            <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-l from-white/40 to-transparent rounded-r-sm" />
            
            {/* Book Pages Effect - Right Side */}
            <div className="absolute -right-1 top-1.5 h-[calc(100%-12px)] w-2 rounded-r-sm bg-gray-100 shadow-md" />
            <div className="absolute -right-2 top-3 h-[calc(100%-24px)] w-2 rounded-r-sm bg-gray-200 shadow-md" />
            <div className="absolute -right-3 top-4 h-[calc(100%-32px)] w-2 rounded-r-sm bg-gray-300 shadow-sm" />
          </div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="p-3 md:p-4 flex-1 flex flex-col">
        {/* Author Skeleton */}
        <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/2 mb-1"></div>

        {/* Title Skeleton - 2 lines */}
        <div className="space-y-2 mb-2 flex-grow">
          <div className="h-4 md:h-5 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-full"></div>
          <div className="h-4 md:h-5 bg-gradient-to-r from-gray-300 to-gray-200 rounded w-3/4"></div>
        </div>

        {/* Rating Skeleton */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-3 w-3 md:h-3.5 md:w-3.5 bg-gray-200 rounded-sm"></div>
            ))}
          </div>
          <div className="h-3 w-8 bg-gray-200 rounded ml-1"></div>
        </div>

        {/* Price Section Skeleton */}
        <div className="flex items-baseline gap-2 mb-3">
          <div className="h-6 md:h-7 w-20 bg-gradient-to-r from-[#d97642]/20 to-[#d97642]/10 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
        </div>

        {/* Add to Cart Button Skeleton */}
        <div className="w-full h-10 md:h-11 rounded-lg bg-gradient-to-r from-[#d97642]/30 to-[#d97642]/20"></div>
      </div>
    </div>
  );
}

