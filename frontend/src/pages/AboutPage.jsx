import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BookOpen,
  Heart,
  Sparkles,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

export default function AboutPage() {
  const [heroRef, heroVisible] = useScrollAnimation();
  const [missionRef, missionVisible] = useScrollAnimation();
  const [statsRef, statsVisible] = useScrollAnimation();
  const [featuresRef, featuresVisible] = useScrollAnimation();
  const [teamRef, teamVisible] = useScrollAnimation();
  const [ctaRef, ctaVisible] = useScrollAnimation();

  const features = [
    {
      icon: BookOpen,
      title: "Vast Collection",
      description:
        "Access thousands of titles across fiction, non-fiction, academic, and children's categories.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Built for readers who love discovering, sharing, and revisiting meaningful stories.",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description:
        "We focus on trusted publishers, strong curation, and books worth recommending.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description:
        "A smooth experience, helpful support, and careful handling from shelf to doorstep.",
    },
    {
      icon: Target,
      title: "Fast Delivery",
      description: "Reliable shipping keeps your next read closer than it feels.",
    },
    {
      icon: Zap,
      title: "Easy Shopping",
      description:
        "Simple browsing, quick checkout, and a storefront that stays easy to use.",
    },
  ];

  const values = [
    {
      title: "Quality",
      description:
        "Every title we list should feel worth owning, gifting, or rereading.",
    },
    {
      title: "Accessibility",
      description:
        "Great books should feel easy to find, easy to buy, and easy to enjoy.",
    },
    {
      title: "Community",
      description:
        "Reading grows richer when readers can discover and share together.",
    },
    {
      title: "Innovation",
      description:
        "We keep improving the platform so the experience stays modern and friction-free.",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Books Available" },
    { value: "50,000+", label: "Happy Customers" },
    { value: "100+", label: "Publishers" },
    { value: "24/7", label: "Customer Support" },
  ];

  const team = [
    {
      name: "Nitesh Kumar",
      role: "Founder & CEO",
      description: "Book enthusiast with 15 years in publishing.",
    },
    {
      name: "Amresh Kumar",
      role: "Head of Operations",
      description:
        "Keeps logistics, fulfillment, and daily operations running smoothly.",
    },
    {
      name: "Amresh Kumar",
      role: "Customer Relations",
      description:
        "Focused on making every reader interaction feel personal and helpful.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f5ef] pb-20">
      <section className="page-wash relative overflow-hidden border-b border-[#d8e6e1]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(151,234,220,0.38),transparent_30%),radial-gradient(circle_at_85%_12%,rgba(241,208,136,0.24),transparent_24%)]" />

        <div
          ref={heroRef}
          className={cn(
            "container-shell relative py-12 sm:py-14 lg:py-16 transition-all duration-700",
            heroVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_380px] xl:items-end">
            <div>
              <span className="brand-chip">About BookHive</span>
              <h1 className="mt-6 max-w-4xl text-[clamp(2.6rem,6vw,5.3rem)] font-semibold leading-[0.96] tracking-tight text-slate-900">
                Building a warmer digital bookstore for{" "}
                <span className="gradient-text">curious readers everywhere</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                BookHive started with a simple idea: online book shopping should feel as
                inviting as stepping into a thoughtful neighborhood bookstore. We combine
                dependable service, careful curation, and modern browsing patterns without
                losing the warmth readers expect.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/books">
                  <Button className="h-12 rounded-full bg-[#0b7a71] px-6 text-white hover:bg-[#095f59]">
                    Explore Books
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="h-12 rounded-full border-[#0b7a71]/20 bg-white/80 px-6 text-[#0b7a71] hover:bg-[#edf7f4]"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="surface-card rounded-[24px] px-4 py-4">
                  <p className="text-2xl font-semibold text-slate-900">10k+</p>
                  <p className="mt-1 text-sm text-slate-500">Books across genres</p>
                </div>
                <div className="surface-card rounded-[24px] px-4 py-4">
                  <p className="text-2xl font-semibold text-slate-900">50k+</p>
                  <p className="mt-1 text-sm text-slate-500">Readers served</p>
                </div>
                <div className="surface-card rounded-[24px] px-4 py-4">
                  <p className="text-2xl font-semibold text-slate-900">24/7</p>
                  <p className="mt-1 text-sm text-slate-500">Support coverage</p>
                </div>
              </div>
            </div>

            <div className="surface-panel rounded-[34px] p-6 sm:p-7">
              <div className="rounded-[28px] bg-[#102032] px-5 py-5 text-white shadow-[0_24px_50px_rgba(16,32,50,0.22)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/65">
                  Our Story
                </p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight">
                  More than a store. A curated reading destination.
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/84">
                  We want discovery to feel guided, not overwhelming. From first browse to
                  checkout to delivery, every layer of BookHive is built to feel helpful and calm.
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="surface-card rounded-[24px] px-5 py-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Mission
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Make reading accessible, affordable, and enjoyable with a catalog that feels both broad and thoughtfully chosen.
                  </p>
                </div>
                <div className="surface-card rounded-[24px] px-5 py-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Promise
                  </p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    Pair dependable service with a visual experience that feels inviting from the first click.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[26px] bg-[#ecf8f5] px-5 py-5 text-[#0b6158]">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <p className="text-sm leading-7">
                    BookHive exists to make online book discovery feel more human, more curated,
                    and much easier to enjoy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-12 sm:py-14">
        <div
          ref={missionRef}
          className={cn(
            "grid gap-6 lg:grid-cols-[1.05fr_0.95fr] transition-all duration-700",
            missionVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          <div className="surface-panel rounded-[32px] p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6f8883]">
              Our Mission
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">
              Reading should feel close, not complicated.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              We believe books can transform lives, spark imagination, and connect people
              across cultures and generations. That is why we focus on making discovery simple,
              pricing fair, and the overall experience genuinely enjoyable.
            </p>
            <p className="mt-4 text-base leading-8 text-slate-600">
              From bestsellers and classics to hidden gems and new releases, our goal is to
              help every kind of reader find something that feels exactly right.
            </p>
          </div>

          <div className="surface-panel rounded-[32px] p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6f8883]">
              What Guides Us
            </p>
            <div className="mt-5 space-y-4">
              {values.map((value) => (
                <div key={value.title} className="surface-card rounded-[24px] px-5 py-5">
                  <h3 className="text-xl font-semibold text-slate-900">{value.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-4 sm:py-6">
        <div
          ref={statsRef}
          className={cn(
            "rounded-[34px] bg-[#102032] px-5 py-8 text-white shadow-[0_24px_55px_rgba(16,32,50,0.2)] sm:px-8 lg:px-10 transition-all duration-700",
            statsVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur-sm"
              >
                <p className="text-3xl font-semibold text-white sm:text-4xl">{stat.value}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#cbe8e2] sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-12 sm:py-14">
        <div
          ref={featuresRef}
          className={cn(
            "transition-all duration-700",
            featuresVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6f8883]">
                Why Readers Choose Us
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
                A bookstore experience shaped for modern readers.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              We combine a warm visual identity with a dependable user experience so browsing and buying books always feels easy to trust.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={cn(
                    "surface-card group rounded-[28px] p-6 transition-all duration-700 hover:-translate-y-1 hover:border-[#9fcfc7] hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]",
                    featuresVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                  )}
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ecf8f5] text-[#0b7a71] transition-transform duration-300 group-hover:scale-105">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-shell py-12 sm:py-14">
        <div
          ref={teamRef}
          className={cn(
            "transition-all duration-700",
            teamVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          <div className="mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6f8883]">
              Meet The Team
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
              The people behind the shelves.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {team.map((member, index) => (
              <div
                key={`${member.name}-${member.role}`}
                className={cn(
                  "surface-card rounded-[30px] p-6 transition-all duration-700 hover:-translate-y-1 hover:border-[#9fcfc7] hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]",
                  teamVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#102032] text-2xl font-semibold text-[#cbe8e2]">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900">{member.name}</h3>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-[#0b7a71]">
                      {member.role}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-slate-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell pb-6 pt-4 sm:pb-10">
        <div
          ref={ctaRef}
          className={cn(
            "surface-panel rounded-[34px] px-6 py-8 sm:px-10 sm:py-10 transition-all duration-700",
            ctaVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6f8883]">
                Ready To Browse
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                Find your next great read with BookHive.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
                Explore curated titles, discover new favorites, and enjoy a bookstore experience built with readers in mind.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/books">
                <Button className="h-12 rounded-full bg-[#0b7a71] px-6 text-white hover:bg-[#095f59]">
                  Browse Catalog
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-[#0b7a71]/20 bg-white/85 px-6 text-[#0b7a71] hover:bg-[#edf7f4]"
                >
                  Talk to Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
