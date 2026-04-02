import { Link } from "react-router-dom";
import { Search, ArrowRight, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookStats, useBookCategories } from "@/hooks/api/useBooks";

const placeholderCover =
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop";

export default function HeroCarousel() {
  const { data: stats, isLoading } = useBookStats();
  const { data: categories = [] } = useBookCategories();

  const featuredBooks = stats?.featured?.slice(0, 3) || [];
  const featuredBook = featuredBooks[0];
  const categoryCount = categories.length || 50;

  if (isLoading) {
    return (
      <section className="page-wash relative flex min-h-[65vh] w-full items-center overflow-hidden py-8 sm:min-h-[75vh] sm:py-10 lg:min-h-[85vh] lg:py-0">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_30%,rgba(151,234,220,0.32),transparent_22%),radial-gradient(circle_at_88%_22%,rgba(241,208,136,0.22),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.25),rgba(255,255,255,0))]" />

        <div className="container-shell relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="space-y-4 px-4 text-center lg:col-span-7 lg:px-0 lg:text-left">
              <div className="inline-block h-10 w-56 rounded-full bg-[#e7f6f2]" />
              <div className="space-y-3">
                <div className="h-16 w-full max-w-3xl rounded-[28px] bg-white/80" />
                <div className="h-16 w-4/5 max-w-xl rounded-[28px] bg-white/70" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-5 w-full max-w-xl rounded-full bg-white/70" />
                <div className="h-5 w-5/6 max-w-lg rounded-full bg-white/60" />
              </div>
              <div className="flex flex-col items-center gap-3 pt-3 sm:flex-row lg:justify-start">
                <div className="h-14 w-full max-w-[220px] rounded-full bg-[#0b7a71]/20" />
                <div className="h-14 w-full max-w-[220px] rounded-full bg-white/80" />
              </div>
              <div className="flex items-center justify-center gap-4 pt-4 lg:justify-start sm:gap-6">
                <div className="space-y-2">
                  <div className="h-8 w-20 rounded bg-[#0b7a71]/20" />
                  <div className="h-4 w-24 rounded bg-white/60" />
                </div>
                <div className="h-10 w-px bg-[#d7e4df]" />
                <div className="space-y-2">
                  <div className="h-8 w-20 rounded bg-[#0b7a71]/20" />
                  <div className="h-4 w-24 rounded bg-white/60" />
                </div>
                <div className="h-10 w-px bg-[#d7e4df]" />
                <div className="space-y-2">
                  <div className="h-8 w-16 rounded bg-[#0b7a71]/20" />
                  <div className="h-4 w-20 rounded bg-white/60" />
                </div>
              </div>
            </div>

            <div className="relative mt-8 flex h-[400px] items-center justify-center px-4 sm:h-[480px] lg:col-span-5 lg:mt-0 lg:h-[550px] lg:px-0">
              <div className="relative flex h-full w-full max-w-[280px] items-center justify-center sm:max-w-[320px] lg:max-w-[380px]">
                <div
                  className="relative"
                  style={{
                    transform: "rotateY(-20deg) rotateX(5deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="absolute inset-0 h-80 w-56 rounded-xl bg-gradient-to-r from-[#f8f6ef] to-[#ece6d8] shadow-[0_22px_50px_rgba(15,23,42,0.08)] sm:h-[380px] sm:w-64 lg:h-[480px] lg:w-80" />
                  <div className="relative h-80 w-56 rounded-xl bg-gradient-to-br from-[#dcefea] via-[#edf7f4] to-white shadow-[0_30px_90px_-20px_rgba(15,23,42,0.28)] sm:h-[380px] sm:w-64 lg:h-[480px] lg:w-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-wash relative flex min-h-[65vh] w-full items-center overflow-hidden py-8 sm:min-h-[75vh] sm:py-10 lg:min-h-[90vh] lg:py-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_28%,rgba(151,234,220,0.38),transparent_24%),radial-gradient(circle_at_88%_20%,rgba(241,208,136,0.28),transparent_21%),radial-gradient(circle_at_50%_100%,rgba(11,122,113,0.08),transparent_28%)]" />
      <div className="pointer-events-none absolute top-20 right-10 h-64 w-64 rounded-full bg-[#f3d89a]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 left-10 h-80 w-80 rounded-full bg-[#97eadc]/22 blur-3xl" />

      <div className="container-shell relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-4 px-4 text-center lg:col-span-7 lg:px-0 lg:text-left">
            <div className="inline-block animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#9fd1c8] bg-[#eef8f5] px-4 py-2 text-xs font-semibold text-[#0b7a71] sm:text-sm">
                <BookOpen className="h-4 w-4" />
                Welcome to BookHive
              </span>
            </div>

            <h1
              className="animate-fade-in-up text-3xl font-semibold leading-[1.08] tracking-[-0.05em] text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
              style={{ animationDelay: "0.1s" }}
            >
              Discover Your Next <br className="hidden sm:block" />
              <span className="relative mt-1 inline-block text-[#0b7a71] sm:mt-2">
                Great Read
                <svg
                  className="absolute -bottom-4 left-0 w-full"
                  viewBox="0 0 320 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 19 Q70 8 155 17 Q240 26 300 18"
                    stroke="#d3a347"
                    strokeWidth="3.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p
              className="mx-auto max-w-xl animate-fade-in-up px-2 text-sm font-medium leading-relaxed text-slate-600 sm:text-base lg:mx-0 lg:text-lg lg:px-0"
              style={{ animationDelay: "0.2s" }}
            >
              Explore thousands of books across all genres. From bestsellers to hidden gems,
              find the perfect book that speaks to your soul.
            </p>

            <div
              className="animate-fade-in-up flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center lg:justify-start"
              style={{ animationDelay: "0.3s" }}
            >
              <Link to="/books" className="w-full sm:w-auto">
                <Button className="h-12 w-full rounded-full bg-[#0b7a71] px-7 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(11,122,113,0.2)] transition-all hover:scale-[1.02] hover:bg-[#095f59] sm:h-14 sm:w-auto sm:text-base">
                  Browse Books
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/books?filter=newArrival" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-full border-[#d7e4df] bg-white/80 px-7 text-sm font-semibold text-slate-800 transition-all hover:scale-[1.02] hover:bg-[#edf7f4] hover:text-[#0b7a71] sm:h-14 sm:w-auto sm:text-base"
                >
                  <Search className="mr-2 h-4 w-4" />
                  New Arrivals
                </Button>
              </Link>
            </div>

            <div
              className="animate-fade-in-up flex items-center justify-center gap-4 pt-4 sm:gap-6 lg:justify-start"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="text-center lg:text-left">
                <p className="text-xl font-bold text-[#0b7a71] sm:text-2xl">10,000+</p>
                <p className="text-[10px] font-medium text-slate-500 sm:text-xs">Books Available</p>
              </div>
              <div className="h-10 w-px bg-[#d7e4df]" />
              <div className="text-center lg:text-left">
                <p className="text-xl font-bold text-[#0b7a71] sm:text-2xl">5,000+</p>
                <p className="text-[10px] font-medium text-slate-500 sm:text-xs">Happy Readers</p>
              </div>
              <div className="h-10 w-px bg-[#d7e4df]" />
              <div className="text-center lg:text-left">
                <p className="text-xl font-bold text-[#0b7a71] sm:text-2xl">{categoryCount}+</p>
                <p className="text-[10px] font-medium text-slate-500 sm:text-xs">Categories</p>
              </div>
            </div>
          </div>

          <div className="relative mt-8 flex h-[400px] items-center justify-center px-4 sm:h-[480px] lg:col-span-5 lg:mt-0 lg:h-[550px] lg:px-0">
            <div
              className="relative flex h-full w-full max-w-[280px] items-center justify-center animate-fade-in-up sm:max-w-[320px] lg:max-w-[380px]"
              style={{ perspective: "2000px", animationDelay: "0.5s" }}
            >
              <div
                className="relative transition-all duration-700 hover:scale-105"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateY(-20deg) rotateX(5deg)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "translateZ(-25px)",
                    background: "linear-gradient(to right, #f9f6ee, #f2ebdb, #e5dcc9)",
                    boxShadow: "inset 0 0 20px rgba(15,23,42,0.08), 0 10px 35px rgba(15,23,42,0.12)",
                  }}
                >
                  <div className="flex h-full flex-col justify-evenly px-4 py-4">
                    {[...Array(15)].map((_, index) => (
                      <div key={index} className="h-px w-full bg-[#d7cdb9]/70" />
                    ))}
                  </div>
                </div>

                <div
                  className="relative overflow-hidden rounded-xl shadow-[0_30px_90px_-20px_rgba(15,23,42,0.45)]"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "translateZ(25px)",
                  }}
                >
                  <img
                    src={featuredBook?.coverImage || placeholderCover}
                    loading="eager"
                    crossOrigin="anonymous"
                    onError={(event) => {
                      event.target.onerror = null;
                      event.target.src = placeholderCover;
                    }}
                    className="h-80 w-56 object-cover sm:h-[380px] sm:w-64 lg:h-[480px] lg:w-80"
                    alt={featuredBook?.title || "Featured book"}
                  />

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-transparent opacity-60" />
                  <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0f2f34]/55 via-[#0f2f34]/18 to-transparent" />

                  <div
                    className="absolute top-4 left-4 rounded-full bg-[#0b7a71] px-3 py-1.5 text-xs font-bold text-white shadow-lg"
                    style={{ animationDelay: "0.6s" }}
                  >
                    FEATURED
                  </div>

                  <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-[#132238]/95 via-[#132238]/70 to-transparent p-4 lg:p-5">
                    <p className="mb-1 text-sm font-semibold italic text-[#f0c76c] lg:text-base">
                      This Week&apos;s Pick
                    </p>
                    <p className="text-xs text-white/90 lg:text-sm">
                      {featuredBook?.title || "Trending now on BookHive"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ===== FIXED FREE PREVIEW BADGE (ab fully visible) ===== */}
              <div
                className="absolute right-0 top-16 z-30 flex items-center gap-2 rounded-2xl border border-[#cfe5de] bg-white/97 p-3 shadow-[0_20px_45px_rgba(15,23,42,0.15)] bg-[#e7f6f2]  sm:top-20 lg:top-24"
                style={{
                  animation: "fadeInUp 0.6s ease-out 0.7s both, float 3s ease-in-out infinite",
                }}
              >
                <div className="rounded-full bg-[#e7f6f2] p-2">
                  <BookOpen className="h-4 w-4 text-[#0b7a71] sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold  text-slate-900 sm:text-sm">Free Preview</p>
                </div>
              </div>

              {/* ===== FIXED BESTSELLER BADGE (ab fully visible) ===== */}
              <div
                className="absolute bottom-20 left-0 z-30 flex items-center gap-2 rounded-2xl border border-[#ead7ab] bg-white/97 p-3 shadow-[0_20px_45px_rgba(15,23,42,0.15)] bg-[#e7f6f2]  sm:bottom-24 lg:bottom-28"
                style={{
                  animation: "fadeInUp 0.6s ease-out 0.8s both, float 3s ease-in-out 1.5s infinite",
                }}
              >
                <div className="rounded-full bg-[#fff4dc] p-2">
                  <Users className="h-4 w-4 text-[#c3902f] sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wide text-[#a47622] sm:text-[10px]">
                    Bestseller
                  </p>
                  <p className="text-xs font-bold text-slate-900 sm:text-sm">5,000+ Sold</p>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(11,122,113,0.18)_0%,rgba(11,122,113,0.07)_35%,transparent_70%)] blur-[110px]" />
              <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-32 w-[70%] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#0f172a]/15 via-[#0f172a]/5 to-transparent blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}