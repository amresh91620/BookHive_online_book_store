import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  LibraryBig,
  Sparkles,
} from "lucide-react";
import BookHiveLogo from "@/components/common/BookHiveLogo";

const showcaseItems = [
  {
    icon: Sparkles,
    title: "Soft visual system",
    copy: "Clean spacing, calm gradients, and premium surfaces inspired by your reference layout.",
  },
  {
    icon: LibraryBig,
    title: "Reader-first browsing",
    copy: "Discovery stays focused on books, new arrivals, and your most important collection actions.",
  },
  {
    icon: BadgeCheck,
    title: "Clear account flow",
    copy: "Authentication feels lighter, more modern, and more trustworthy from the first screen.",
  },
];

export default function AuthShell({
  badge,
  title,
  description,
  panelTitle,
  panelDescription,
  children,
  footer,
}) {
  return (
    <div className="page-wash relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(151,234,220,0.24),transparent_22%),radial-gradient(circle_at_86%_10%,rgba(241,208,136,0.18),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(11,122,113,0.08),transparent_26%)]" />

      <Link
        to="/"
        className="absolute left-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-[#d7e4df] bg-white/88 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-[#b8d7cf] hover:bg-white hover:text-[#d97642] sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="container-shell relative flex min-h-screen items-center py-12 lg:py-16">
        <div className="grid w-full items-stretch gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
          <div className="surface-panel hidden rounded-[40px] p-10 lg:flex lg:flex-col lg:justify-between xl:p-12">
            <div>
              <BookHiveLogo />

              <span className="brand-chip mt-12">
                <BookOpen className="h-4 w-4" />
                {badge}
              </span>

              <h1 className="mt-7 max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-slate-900 xl:text-6xl">
                {title}
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                {description}
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {showcaseItems.map(({ icon: Icon, title: itemTitle, copy }) => (
                <div key={itemTitle} className="surface-card rounded-[28px] p-5">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fef3ed] text-[#d97642]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-lg font-semibold text-slate-900">{itemTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel flex rounded-[34px] p-4 sm:p-6 lg:rounded-[40px] lg:p-10">
            <div className="mx-auto w-full max-w-lg self-center">
              <div className="mb-10 lg:hidden">
                <BookHiveLogo />
                <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#d7e4df] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                  {badge}
                </span>
              </div>

              <div>
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.34em] text-[#0b6158]">
                  Secure Access
                </p>
                <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-900 sm:text-[2.8rem]">
                  {panelTitle}
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-500">
                  {panelDescription}
                </p>
              </div>

              <div className="mt-8">{children}</div>

              {footer ? <div className="mt-8">{footer}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
