/**
 * BookSkeleton — matches BookCard layout px-for-px.
 * Uses the brand cream skeleton system (skeleton-wave) from index.css.
 */
export default function BookSkeleton() {
  return (
    <div className="relative rounded-xl h-full flex flex-col bg-white overflow-hidden border border-[#f0e4d6]"
      style={{ boxShadow: '0 4px 20px rgba(217,118,66,0.06)' }}
    >
      {/* Book Image Container */}
      <div
        className="relative flex items-center justify-center bg-[#faf6f1] p-4 md:p-5 lg:p-6"
        style={{ minHeight: '240px' }}
      >
        {/* Ground shadow circle */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[60%] h-5 skeleton-wave rounded-full blur-lg opacity-60" />

        {/* Wishlist button skeleton */}
        <div className="absolute left-2 top-2 z-20 rounded-full skeleton-wave w-9 h-9" />

        {/* 3D Book skeleton */}
        <div className="relative w-[75%] md:w-[70%] lg:w-[65%] max-w-[180px]">
          <div
            className="relative aspect-[2/3] rounded-sm overflow-hidden skeleton-wave"
            style={{
              transform: 'perspective(1200px) rotateY(-12deg)',
              boxShadow: '10px 10px 30px rgba(0,0,0,0.12), -3px 0 10px rgba(0,0,0,0.07)',
            }}
          >
            {/* Shimmer overlay */}
            <div className="skeleton-overlay" />

            {/* Spine shadow */}
            <div className="absolute left-0 top-0 h-full w-3 bg-gradient-to-r from-black/15 via-black/05 to-transparent rounded-l-sm" />
            {/* Edge highlight */}
            <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-l from-white/35 to-transparent rounded-r-sm" />
          </div>

          {/* Pages effect */}
          <div className="absolute -right-1 top-1.5 h-[calc(100%-12px)] w-2 rounded-r-sm bg-[#f5f0ea] shadow" />
          <div className="absolute -right-2 top-3  h-[calc(100%-24px)] w-2 rounded-r-sm bg-[#ede8e0] shadow" />
          <div className="absolute -right-3 top-4  h-[calc(100%-32px)] w-2 rounded-r-sm bg-[#e5dfd6]" />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-4 flex-1 flex flex-col gap-2">
        {/* Author */}
        <div className="h-3 skeleton-wave rounded w-2/5" />

        {/* Title */}
        <div className="space-y-1.5 flex-grow">
          <div className="h-4 skeleton-wave rounded w-full" />
          <div className="h-4 skeleton-wave rounded w-3/4" />
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-3 skeleton-wave rounded-sm" />
          ))}
          <div className="h-3 w-7 skeleton-wave rounded ml-1" />
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1">
          <div className="h-6 w-20 skeleton-wave-orange rounded" />
          <div className="h-4 w-14 skeleton-wave rounded" />
        </div>

        {/* Add to Cart button */}
        <div className="w-full h-10 md:h-11 rounded-lg skeleton-wave-orange mt-1" />
      </div>
    </div>
  );
}
