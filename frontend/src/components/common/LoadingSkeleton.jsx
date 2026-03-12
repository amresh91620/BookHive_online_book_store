/**
 * Reusable loading skeleton component
 * @param {string} type - Type of skeleton (card, list, table, detail, hero, profile)
 * @param {number} count - Number of skeletons to render
 */
export function LoadingSkeleton({ type = "card", count = 1 }) {
  const skeletons = {
    card: (
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="aspect-[3/4] bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
      </div>
    ),
    list: (
      <div className="bg-white border rounded-lg p-4">
        <div className="flex gap-4">
          <div className="w-16 h-20 bg-gray-200 rounded animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      </div>
    ),
    table: (
      <div className="bg-white border rounded-lg p-4">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    ),
    detail: (
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
        <div className="flex gap-4 mt-6">
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
      </div>
    ),
    hero: (
      <div className="bg-gray-100 rounded-lg p-8 space-y-4">
        <div className="h-12 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
        <div className="flex gap-4 mt-6">
          <div className="h-12 bg-gray-200 rounded w-40 animate-pulse" />
          <div className="h-12 bg-gray-200 rounded w-40 animate-pulse" />
        </div>
      </div>
    ),
    profile: (
      <div className="bg-white border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        </div>
        <div className="space-y-3 mt-6">
          <div className="h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
        </div>
      </div>
    ),
    stats: (
      <div className="bg-white border rounded-lg p-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
        <div className="h-16 bg-gray-200 rounded animate-pulse" />
      </div>
    ),
  };

  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i}>{skeletons[type]}</div>
      ))}
    </>
  );
}
