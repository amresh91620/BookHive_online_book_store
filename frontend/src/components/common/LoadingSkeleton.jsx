/**
 * LoadingSkeleton — brand-aware skeleton system.
 * Uses the warm orange/cream design language from index.css skeleton-wave classes.
 * @param {string} type - card | list | table | detail | hero | profile | stats | blog | order
 * @param {number} count - number of skeleton items to render
 */
export function LoadingSkeleton({ type = "card", count = 1 }) {
  const skeletons = {

    /* ── BOOK CARD ─────────────────────────────────────────── */
    card: (
      <div className="rounded-xl bg-white border border-[#f0e4d6] overflow-hidden"
        style={{ boxShadow: '0 4px 20px rgba(217,118,66,0.05)' }}
      >
        {/* Image area */}
        <div className="relative bg-[#faf6f1] flex items-center justify-center" style={{ minHeight: 200 }}>
          <div className="w-[65%] aspect-[2/3] skeleton-wave rounded-sm"
            style={{ transform: 'perspective(900px) rotateY(-10deg)', boxShadow: '8px 8px 24px rgba(0,0,0,0.1)' }}
          />
          <div className="skeleton-overlay" />
        </div>
        {/* Content */}
        <div className="p-4 space-y-2.5">
          <div className="h-3 skeleton-wave rounded w-2/5" />
          <div className="h-4 skeleton-wave rounded w-full" />
          <div className="h-4 skeleton-wave rounded w-3/4" />
          <div className="flex gap-2 mt-1">
            <div className="h-6 w-20 skeleton-wave-orange rounded" />
            <div className="h-5 w-14 skeleton-wave rounded" />
          </div>
          <div className="h-10 skeleton-wave-orange rounded-lg mt-1" />
        </div>
      </div>
    ),

    /* ── LIST ITEM ─────────────────────────────────────────── */
    list: (
      <div className="bg-white border border-[#f0e4d6] rounded-2xl p-5"
        style={{ boxShadow: '0 2px 12px rgba(217,118,66,0.05)' }}
      >
        <div className="flex gap-5">
          <div className="w-20 h-28 skeleton-wave rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2.5 pt-1">
            <div className="h-5 skeleton-wave rounded w-3/4" />
            <div className="h-4 skeleton-wave rounded w-2/5" />
            <div className="h-7 w-24 skeleton-wave-orange rounded mt-2" />
            <div className="flex gap-2 pt-2">
              <div className="h-9 flex-1 skeleton-wave-orange rounded-lg" />
              <div className="h-9 w-28 skeleton-wave rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    ),

    /* ── TABLE ROW ─────────────────────────────────────────── */
    table: (
      <div className="bg-white border border-[#f0e4d6] rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 2px 12px rgba(217,118,66,0.04)' }}
      >
        {/* Header row */}
        <div className="bg-[#faf6f1] px-6 py-4 flex gap-4">
          {[40, 24, 20, 16].map((w, i) => (
            <div key={i} className={`h-4 skeleton-wave rounded w-${w}`} style={{ flex: i === 0 ? 2 : 1 }} />
          ))}
        </div>
        {/* Body rows */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4 flex gap-4 border-t border-[#f5ece3]">
            <div className="h-4 skeleton-wave rounded" style={{ flex: 2 }} />
            {[1, 1, 1].map((_, j) => (
              <div key={j} className="h-4 skeleton-wave rounded" style={{ flex: 1 }} />
            ))}
          </div>
        ))}
      </div>
    ),

    /* ── DETAIL PAGE ───────────────────────────────────────── */
    detail: (
      <div className="bg-white border border-[#f0e4d6] rounded-2xl p-6 space-y-5"
        style={{ boxShadow: '0 4px 24px rgba(217,118,66,0.06)' }}
      >
        <div className="h-8 skeleton-wave rounded w-3/4" />
        <div className="h-5 skeleton-wave rounded w-2/5" />
        <div className="h-7 skeleton-wave-orange rounded w-1/3" />
        <div className="space-y-2">
          <div className="h-4 skeleton-wave rounded w-full" />
          <div className="h-4 skeleton-wave rounded w-5/6" />
          <div className="h-4 skeleton-wave rounded w-4/6" />
        </div>
        <div className="flex gap-3 pt-2">
          <div className="h-12 flex-1 skeleton-wave-orange rounded-xl" />
          <div className="h-12 flex-1 skeleton-wave rounded-xl" />
        </div>
      </div>
    ),

    /* ── HERO ──────────────────────────────────────────────── */
    hero: (
      <div className="relative overflow-hidden rounded-2xl bg-[#faf6f1] p-10 space-y-5"
        style={{ minHeight: 360, boxShadow: '0 8px 40px rgba(217,118,66,0.08)' }}
      >
        <div className="skeleton-overlay" />
        <div className="h-4 w-32 skeleton-wave-orange rounded-full" />
        <div className="space-y-3">
          <div className="h-12 skeleton-wave rounded w-3/4" />
          <div className="h-12 skeleton-wave rounded w-1/2" />
        </div>
        <div className="h-5 skeleton-wave rounded w-2/3 mt-2" />
        <div className="flex gap-4 pt-4">
          <div className="h-14 w-44 skeleton-wave-orange rounded-xl" />
          <div className="h-14 w-44 skeleton-wave rounded-xl" />
        </div>
      </div>
    ),

    /* ── PROFILE ───────────────────────────────────────────── */
    profile: (
      <div className="bg-white border border-[#f0e4d6] rounded-2xl p-6 space-y-5"
        style={{ boxShadow: '0 4px 20px rgba(217,118,66,0.05)' }}
      >
        {/* Avatar + name row */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full skeleton-wave flex-shrink-0"
            style={{ boxShadow: '0 0 0 3px rgba(217,118,66,0.18)' }}
          />
          <div className="flex-1 space-y-2.5">
            <div className="h-6 skeleton-wave rounded w-2/5" />
            <div className="h-4 skeleton-wave rounded w-3/5" />
            <div className="h-4 skeleton-wave rounded w-2/5" />
          </div>
        </div>
        {/* Fields */}
        <div className="space-y-3 pt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 skeleton-wave rounded w-24" />
              <div className="h-10 skeleton-wave rounded-lg w-full" />
            </div>
          ))}
        </div>
        <div className="h-12 skeleton-wave-orange rounded-xl" />
      </div>
    ),

    /* ── STATS CARD ────────────────────────────────────────── */
    stats: (
      <div className="bg-white border border-[#f0e4d6] rounded-2xl p-6"
        style={{ boxShadow: '0 4px 20px rgba(217,118,66,0.06)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 skeleton-wave rounded w-2/5" />
          <div className="w-10 h-10 skeleton-wave-orange rounded-xl" />
        </div>
        <div className="h-10 skeleton-wave-orange rounded w-3/5 mb-2" />
        <div className="h-3 skeleton-wave rounded w-2/5" />
      </div>
    ),

    /* ── BLOG CARD ─────────────────────────────────────────── */
    blog: (
      <div className="bg-white border border-[#f0e4d6] rounded-2xl overflow-hidden h-full flex flex-col"
        style={{ boxShadow: '0 4px 20px rgba(217,118,66,0.05)' }}
      >
        {/* Image */}
        <div className="relative aspect-[16/9] skeleton-wave overflow-hidden">
          <div className="skeleton-overlay" />
        </div>
        {/* Content */}
        <div className="p-6 flex flex-col flex-1 space-y-3">
          <div className="h-3 skeleton-wave-orange rounded-full w-20" />
          <div className="space-y-2">
            <div className="h-6 skeleton-wave rounded w-full" />
            <div className="h-6 skeleton-wave rounded w-3/4" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="h-4 skeleton-wave rounded w-full" />
            <div className="h-4 skeleton-wave rounded w-5/6" />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[#f5ece3]">
            <div className="h-3 skeleton-wave rounded w-24" />
            <div className="h-3 skeleton-wave rounded w-16" />
          </div>
        </div>
      </div>
    ),

    /* ── ORDER CARD ────────────────────────────────────────── */
    order: (
      <div className="bg-white border border-[#f0e4d6] rounded-2xl p-6"
        style={{ boxShadow: '0 4px 20px rgba(217,118,66,0.05)' }}
      >
        {/* Order header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-6 skeleton-wave rounded w-32" />
              <div className="h-6 skeleton-wave-orange rounded-full w-24" />
            </div>
            <div className="h-4 skeleton-wave rounded w-40" />
          </div>
          <div className="h-9 w-32 skeleton-wave-orange rounded-lg" />
        </div>
        {/* Book thumbnails */}
        <div className="flex gap-3 pb-4 border-b border-[#f5ece3] mb-4 overflow-hidden">
          {[...Array(4)].map((_, j) => (
            <div key={j} className="w-12 h-16 skeleton-wave rounded flex-shrink-0" />
          ))}
        </div>
        {/* Address */}
        <div className="space-y-1.5 mb-5">
          <div className="h-4 skeleton-wave rounded w-28" />
          <div className="h-3 skeleton-wave rounded w-full" />
          <div className="h-3 skeleton-wave rounded w-4/5" />
        </div>
        {/* Actions */}
        <div className="flex gap-2">
          <div className="h-9 skeleton-wave rounded-lg w-32" />
        </div>
      </div>
    ),
  };

  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i}>{skeletons[type] || skeletons.card}</div>
      ))}
    </>
  );
}
