/**
 * AdminSkeleton — Dedicated skeleton system for admin panel pages.
 * Uses the warm stone/amber admin design language.
 * 
 * @param {string} type - dashboard | table | order-detail | settings | activity-log | review-list | message-list | form | stats-row | page-header
 * @param {number} count - number of skeleton items to render (for repeatable types)
 */
export function AdminSkeleton({ type = "table", count = 1 }) {

  /* ─── Reusable pulse bar ─── */
  const Bar = ({ w = "w-full", h = "h-4", orange = false, className = "" }) => (
    <div className={`${h} ${w} ${orange ? "skeleton-wave-orange" : "skeleton-wave"} rounded ${className}`} />
  );

  /* ─── Page Header skeleton ─── */
  const PageHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="space-y-3">
        <Bar w="w-64" h="h-9" />
        <Bar w="w-40" h="h-4" />
      </div>
      <Bar w="w-32" h="h-10" orange className="rounded-lg" />
    </div>
  );

  /* ─── Search Bar skeleton ─── */
  const SearchBar = () => (
    <div className="mb-6">
      <div className="h-10 skeleton-wave rounded-lg w-full" />
    </div>
  );

  const skeletons = {

    /* ═══════════════════════════════════════════════════════════
       DASHBOARD — full page skeleton
       ═══════════════════════════════════════════════════════════ */
    dashboard: (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-3">
            <Bar w="w-48" h="h-10" />
            <Bar w="w-72" h="h-5" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border-2 border-stone-200 p-5 space-y-4"
                style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.05)', animationDelay: `${i * 100}ms` }}
              >
                <div className="flex justify-between items-start">
                  <Bar w="w-24" h="h-4" />
                  <div className="w-11 h-11 skeleton-wave-orange rounded-xl" />
                </div>
                <Bar w="w-20" h="h-8" orange />
                <Bar w="w-28" h="h-3" />
              </div>
            ))}
          </div>

          {/* New Orders card */}
          <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 space-y-5"
            style={{ boxShadow: '0 4px 24px rgba(217,118,66,0.06)' }}
          >
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Bar w="w-40" h="h-7" />
                <Bar w="w-64" h="h-4" />
              </div>
              <Bar w="w-32" h="h-9" orange className="rounded-lg" />
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-2 border-stone-100 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 skeleton-wave-orange rounded-xl" />
                  <div className="space-y-2">
                    <Bar w="w-28" h="h-5" />
                    <Bar w="w-40" h="h-3" />
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <Bar w="w-20" h="h-5" orange />
                  <Bar w="w-16" h="h-5" />
                </div>
              </div>
            ))}
          </div>

          {/* Order Status + Quick Actions row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border-2 border-stone-200 p-6 space-y-4"
                style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)' }}
              >
                <Bar w="w-48" h="h-7" />
                <Bar w="w-32" h="h-4" />
                <div className="grid grid-cols-3 gap-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-24 skeleton-wave rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl border-2 border-stone-200 p-6 space-y-4"
            style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)' }}
          >
            <Bar w="w-64" h="h-7" />
            <Bar w="w-48" h="h-4" />
            <div className="space-y-4 pt-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Bar w="w-12" h="h-4" />
                    <Bar w="w-20" h="h-4" />
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-3">
                    <div className="h-full skeleton-wave-orange rounded-full" style={{ width: `${60 - i * 8}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),

    /* ═══════════════════════════════════════════════════════════
       TABLE — for Books, Users, Orders, Blogs, Comments
       ═══════════════════════════════════════════════════════════ */
    table: (
      <div className="space-y-6">
        <PageHeader />
        <SearchBar />

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl border-2 border-stone-200 overflow-hidden"
          style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)' }}
        >
          {/* Header row */}
          <div className="bg-gradient-to-r from-stone-50 to-amber-50/50 px-6 py-4 flex gap-6 border-b-2 border-stone-200">
            {[{ w: 'flex-[2]' }, { w: 'flex-1' }, { w: 'flex-1' }, { w: 'flex-1' }, { w: 'w-20' }].map((col, i) => (
              <div key={i} className={`h-4 skeleton-wave rounded ${col.w}`} />
            ))}
          </div>
          {/* Body rows */}
          {[...Array(count > 1 ? count : 8)].map((_, i) => (
            <div key={i} className="px-6 py-5 flex gap-6 items-center border-b border-stone-100 last:border-0"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center gap-3 flex-[2]">
                <div className="w-10 h-14 skeleton-wave rounded flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Bar w="w-3/4" h="h-4" />
                  <Bar w="w-1/2" h="h-3" />
                </div>
              </div>
              <Bar w="w-full" h="h-4" className="flex-1" />
              <Bar w="w-full" h="h-4" orange className="flex-1" />
              <Bar w="w-full" h="h-6" className="flex-1 rounded-full" />
              <div className="w-20 flex gap-2">
                <div className="w-8 h-8 skeleton-wave rounded-lg" />
                <div className="w-8 h-8 skeleton-wave rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {[...Array(count > 1 ? count : 4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-stone-200 p-4 space-y-3"
              style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)' }}
            >
              <div className="flex gap-4">
                <div className="w-16 h-22 skeleton-wave rounded flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Bar w="w-3/4" h="h-5" />
                  <Bar w="w-1/2" h="h-4" />
                  <Bar w="w-1/3" h="h-4" orange />
                </div>
              </div>
              <div className="flex gap-2">
                <Bar w="w-full" h="h-9" className="flex-1 rounded-lg" />
                <div className="w-9 h-9 skeleton-wave rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    /* ═══════════════════════════════════════════════════════════
       ORDER DETAIL — 3-col layout
       ═══════════════════════════════════════════════════════════ */
    "order-detail": (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back button */}
        <Bar w="w-36" h="h-10" className="rounded-lg" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order header card */}
            <div className="bg-white rounded-2xl border-2 border-stone-200 p-6"
              style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)' }}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <Bar w="w-56" h="h-8" />
                  <Bar w="w-36" h="h-4" />
                </div>
                <Bar w="w-24" h="h-8" orange className="rounded-full" />
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-2xl border-2 border-stone-200 p-6 space-y-3"
              style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 skeleton-wave-orange rounded-lg" />
                <Bar w="w-48" h="h-6" />
              </div>
              <Bar w="w-40" h="h-4" />
              <Bar w="w-56" h="h-4" />
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border-2 border-stone-200 p-6"
              style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)' }}
            >
              <Bar w="w-32" h="h-6" className="mb-5" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 py-4 border-b border-stone-100 last:border-0">
                  <div className="w-16 h-24 skeleton-wave rounded flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Bar w="w-3/4" h="h-5" />
                    <Bar w="w-1/3" h="h-4" />
                    <Bar w="w-1/4" h="h-4" />
                  </div>
                  <Bar w="w-20" h="h-6" orange />
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white rounded-2xl border-2 border-stone-200 p-6 space-y-4"
              style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)' }}
            >
              <Bar w="w-36" h="h-6" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Bar w="w-20" h="h-4" />
                  <Bar w="w-16" h="h-4" />
                </div>
              ))}
              <div className="border-t-2 border-stone-200 pt-4 flex justify-between">
                <Bar w="w-16" h="h-6" />
                <Bar w="w-24" h="h-7" orange />
              </div>
            </div>

            {/* Payment card */}
            <div className="bg-white rounded-2xl border-2 border-stone-200 p-6 space-y-3"
              style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 skeleton-wave-orange rounded-lg" />
                <Bar w="w-40" h="h-6" />
              </div>
              <div className="flex justify-between"><Bar w="w-16" h="h-4" /><Bar w="w-20" h="h-4" /></div>
              <div className="flex justify-between"><Bar w="w-16" h="h-4" /><Bar w="w-16" h="h-6" orange className="rounded-full" /></div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border-2 border-stone-200 p-6"
              style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)' }}
            >
              <Bar w="w-36" h="h-6" className="mb-5" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 pb-4">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full skeleton-wave-orange" />
                    {i < 2 && <div className="w-0.5 flex-1 bg-stone-200 mt-2" />}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <Bar w="w-24" h="h-4" />
                    <Bar w="w-32" h="h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),

    /* ═══════════════════════════════════════════════════════════
       SETTINGS — 2x2 grid of settings cards
       ═══════════════════════════════════════════════════════════ */
    settings: (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 skeleton-wave-orange rounded" />
              <Bar w="w-40" h="h-8" />
            </div>
            <Bar w="w-64" h="h-4" />
          </div>
          <div className="flex gap-3">
            <Bar w="w-36" h="h-10" className="rounded-lg" />
            <Bar w="w-32" h="h-10" orange className="rounded-lg" />
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-stone-200 p-6 space-y-5"
              style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 skeleton-wave-orange rounded" />
                <Bar w="w-32" h="h-6" />
              </div>
              <Bar w="w-48" h="h-4" />
              {/* Toggle row */}
              <div className="flex justify-between items-center p-3 bg-stone-50 rounded-lg">
                <div className="space-y-1">
                  <Bar w="w-28" h="h-4" />
                  <Bar w="w-36" h="h-3" />
                </div>
                <div className="w-11 h-6 skeleton-wave rounded-full" />
              </div>
              {/* Input fields */}
              <div className="space-y-3">
                <Bar w="w-24" h="h-3" />
                <Bar w="w-full" h="h-10" className="rounded-lg" />
              </div>
              <div className="space-y-3">
                <Bar w="w-20" h="h-3" />
                <Bar w="w-full" h="h-10" className="rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Config summary */}
        <div className="bg-white rounded-2xl border-2 border-stone-200 p-6"
          style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)' }}
        >
          <Bar w="w-48" h="h-6" className="mb-5" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-stone-50 rounded-lg space-y-3">
                <Bar w="w-12" h="h-3" />
                <Bar w="w-16" h="h-8" orange />
                <Bar w="w-20" h="h-6" className="rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),

    /* ═══════════════════════════════════════════════════════════
       ACTIVITY LOG — timeline-style cards
       ═══════════════════════════════════════════════════════════ */
    "activity-log": (
      <div className="space-y-6">
        <PageHeader />
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-stone-200 p-5 space-y-3"
              style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)' }}
            >
              <Bar w="w-32" h="h-4" />
              <Bar w="w-16" h="h-8" orange />
            </div>
          ))}
        </div>
        <SearchBar />
        {/* Log entries */}
        <div className="space-y-3">
          {[...Array(count > 1 ? count : 8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-stone-200 p-4"
              style={{ boxShadow: '0 2px 8px rgba(217,118,66,0.03)', animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 skeleton-wave-orange rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Bar w="w-28" h="h-4" />
                    <Bar w="w-20" h="h-5" orange className="rounded-full" />
                  </div>
                  <Bar w="w-3/4" h="h-3" />
                  <Bar w="w-32" h="h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    /* ═══════════════════════════════════════════════════════════
       REVIEW LIST — review cards with stars
       ═══════════════════════════════════════════════════════════ */
    "review-list": (
      <div className="space-y-6">
        <PageHeader />
        {/* Filter bar */}
        <div className="bg-white rounded-xl border-2 border-stone-200 p-5"
          style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Bar w="w-full" h="h-10" className="rounded-lg" />
            <div className="flex gap-2 flex-wrap">
              {[...Array(6)].map((_, i) => (
                <Bar key={i} w="w-16" h="h-9" className="rounded-lg" />
              ))}
            </div>
          </div>
        </div>
        {/* Review cards */}
        <div className="space-y-4">
          {[...Array(count > 1 ? count : 5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-stone-200 p-5"
              style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)', animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 skeleton-wave-orange rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Bar w="w-28" h="h-5" />
                    <Bar w="w-40" h="h-3" />
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-4 h-4 skeleton-wave-orange rounded" />
                    ))}
                    <Bar w="w-20" h="h-3" className="ml-2" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 skeleton-wave rounded" />
                    <Bar w="w-40" h="h-4" />
                  </div>
                  <Bar w="w-full" h="h-4" />
                  <Bar w="w-3/4" h="h-4" />
                </div>
                <div className="w-8 h-8 skeleton-wave rounded-lg flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    /* ═══════════════════════════════════════════════════════════
       MESSAGE LIST — message cards
       ═══════════════════════════════════════════════════════════ */
    "message-list": (
      <div className="space-y-6">
        <PageHeader />
        {/* Search */}
        <div className="bg-white rounded-xl border-2 border-stone-200 p-5"
          style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)' }}
        >
          <Bar w="w-full" h="h-10" className="rounded-lg" />
        </div>
        {/* Message cards */}
        <div className="space-y-4">
          {[...Array(count > 1 ? count : 5)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border-2 border-stone-200 p-5"
              style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)', animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 skeleton-wave-orange rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Bar w="w-48" h="h-5" />
                    <Bar w="w-24" h="h-3" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Bar w="w-36" h="h-4" />
                    <Bar w="w-44" h="h-4" />
                  </div>
                  <Bar w="w-full" h="h-4" />
                  <Bar w="w-2/3" h="h-4" />
                  <div className="flex gap-2 pt-1">
                    <Bar w="w-32" h="h-8" className="rounded-lg" />
                    <Bar w="w-20" h="h-8" className="rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),

    /* ═══════════════════════════════════════════════════════════
       FORM — for book/blog forms
       ═══════════════════════════════════════════════════════════ */
    form: (
      <div className="max-w-6xl mx-auto space-y-6">
        <Bar w="w-36" h="h-10" className="rounded-lg" />
        <div className="bg-white rounded-2xl border-2 border-stone-200 overflow-hidden"
          style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.04)' }}
        >
          <div className="bg-gradient-to-r from-stone-50 to-amber-50/50 px-6 py-5 border-b-2 border-stone-200">
            <Bar w="w-48" h="h-8" />
            <Bar w="w-72" h="h-4" className="mt-2" />
          </div>
          <div className="p-6 space-y-8">
            {/* Section 1 */}
            <div className="p-6 bg-stone-50 rounded-xl border-2 border-stone-200 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 skeleton-wave-orange rounded-lg" />
                <Bar w="w-40" h="h-6" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Bar w="w-20" h="h-3" />
                    <Bar w="w-full" h="h-10" className="rounded-lg" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Bar w="w-24" h="h-3" />
                <Bar w="w-full" h="h-24" className="rounded-lg" />
              </div>
            </div>
            {/* Section 2 */}
            <div className="p-6 bg-stone-50 rounded-xl border-2 border-stone-200 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 skeleton-wave-orange rounded-lg" />
                <Bar w="w-32" h="h-6" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Bar w="w-16" h="h-3" />
                    <Bar w="w-full" h="h-10" className="rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
            {/* Submit buttons */}
            <div className="flex gap-3">
              <Bar w="w-36" h="h-12" orange className="rounded-lg" />
              <Bar w="w-24" h="h-12" className="rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    ),

    /* ═══════════════════════════════════════════════════════════
       STATS ROW — reusable stats cards (for inline use)
       ═══════════════════════════════════════════════════════════ */
    "stats-row": (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(count > 1 ? count : 4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border-2 border-stone-200 p-5 space-y-4"
            style={{ boxShadow: '0 4px 16px rgba(217,118,66,0.05)' }}
          >
            <div className="flex justify-between items-start">
              <Bar w="w-24" h="h-4" />
              <div className="w-11 h-11 skeleton-wave-orange rounded-xl" />
            </div>
            <Bar w="w-20" h="h-8" orange />
            <Bar w="w-28" h="h-3" />
          </div>
        ))}
      </div>
    ),

    /* ═══════════════════════════════════════════════════════════
       PAGE HEADER — reusable header skeleton
       ═══════════════════════════════════════════════════════════ */
    "page-header": <PageHeader />,
  };

  return skeletons[type] || skeletons.table;
}
