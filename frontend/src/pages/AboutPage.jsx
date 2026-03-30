import { Link } from "react-router-dom";
import { ArrowRight, Award, BookOpen, Heart, Target, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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
      description: "Access thousands of titles across fiction, non-fiction, academic, and children's categories.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Built for readers who love discovering, sharing, and revisiting meaningful stories.",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "We focus on trusted publishers, strong curation, and books worth recommending.",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "A smooth experience, helpful support, and careful handling from shelf to doorstep.",
    },
    {
      icon: Target,
      title: "Fast Delivery",
      description: "Reliable shipping keeps your next read closer than it feels.",
    },
    {
      icon: Zap,
      title: "Easy Shopping",
      description: "Simple browsing, quick checkout, and a storefront that stays easy to use.",
    },
  ];

  const values = [
    {
      title: "Quality",
      description: "Every title we list should feel worth owning, gifting, or rereading.",
    },
    {
      title: "Accessibility",
      description: "Great books should feel easy to find, easy to buy, and easy to enjoy.",
    },
    {
      title: "Community",
      description: "Reading grows richer when readers can discover and share together.",
    },
    {
      title: "Innovation",
      description: "We keep improving the platform so the experience stays modern and friction-free.",
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
      description: "Keeps logistics, fulfillment, and daily operations running smoothly.",
    },
    {
      name: "Amresh Kumar",
      role: "Customer Relations",
      description: "Focused on making every reader interaction feel personal and helpful.",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle Floating Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-96 h-96 bg-orange-400/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 -left-40 w-80 h-80 bg-amber-400/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <section className="relative z-10 px-0 py-10 sm:py-10 lg:py-10">
        <div className="container-shell">
          <div
            ref={heroRef}
            className={`grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12 transition-all duration-700 ${
              heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div>
              <Badge className="mb-5 border-0 bg-[#1f2937] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-100">
                Our Story
              </Badge>
              <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight text-[#451a03] sm:text-5xl lg:text-6xl">
                Building a warmer place for readers to discover their next favorite book.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#6b4a2a] sm:text-lg">
                BookHive started with a simple idea: online book shopping should feel as inviting as walking into a well-loved bookstore. We bring together thoughtful curation, dependable service, and a reading-first experience designed for modern readers.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/books">
                  <Button className="h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-sm font-semibold text-white hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all duration-300">
                    Explore Books
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="h-12 rounded-full border-2 border-orange-500 bg-white/70 px-6 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition-all duration-300"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-amber-100 bg-white/80 px-4 py-4 shadow-sm">
                  <p className="text-2xl font-bold text-[#451a03]">10k+</p>
                  <p className="mt-1 text-sm text-[#7c5b3d]">Books across genres</p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-white/80 px-4 py-4 shadow-sm">
                  <p className="text-2xl font-bold text-[#451a03]">50k+</p>
                  <p className="mt-1 text-sm text-[#7c5b3d]">Readers served</p>
                </div>
                <div className="rounded-2xl border border-amber-100 bg-white/80 px-4 py-4 shadow-sm col-span-2 sm:col-span-1">
                  <p className="text-2xl font-bold text-[#451a03]">24/7</p>
                  <p className="mt-1 text-sm text-[#7c5b3d]">Helpful support</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 hidden h-28 w-28 rounded-full bg-amber-200/40 blur-2xl lg:block" />
              <Card className="overflow-hidden rounded-[32px] border-amber-100 bg-white/90 shadow-[0_20px_60px_rgba(120,53,15,0.12)] backdrop-blur">
                <CardContent className="p-0">
                  <div className="border-b border-amber-100 bg-[#1f2937] px-6 py-6 text-white sm:px-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">BookHive Journal</p>
                    <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-white sm:text-3xl">
                      More than a store. A curated reading destination.
                    </h2>
                  </div>
                  <div className="space-y-4 px-6 py-6 sm:px-8">
                    <div className="rounded-2xl border border-amber-100 bg-[#fff8ef] p-5">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b45309]">Mission</p>
                      <p className="mt-2 text-sm leading-7 text-[#6b4a2a]">
                        Make reading accessible, affordable, and enjoyable with a catalog that feels both broad and thoughtfully chosen.
                      </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-amber-100 bg-white p-5">
                        <p className="text-3xl font-bold text-[#451a03]">100+</p>
                        <p className="mt-1 text-sm text-[#7c5b3d]">Publishing partners</p>
                      </div>
                      <div className="rounded-2xl border border-amber-100 bg-white p-5">
                        <p className="text-3xl font-bold text-[#451a03]">Fast</p>
                        <p className="mt-1 text-sm text-[#7c5b3d]">Reliable doorstep delivery</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-14 sm:py-16">
        <div className="container-shell">
          <div
            ref={missionRef}
            className={`grid gap-6 lg:grid-cols-[1.05fr_0.95fr] transition-all duration-700 ${
              missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <Card className="rounded-[28px] border-amber-100 bg-white/85 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b45309]">Our Mission</p>
                <h2 className="mt-3 font-serif text-3xl font-bold text-[#451a03]">Reading should feel close, not complicated.</h2>
                <p className="mt-4 text-base leading-8 text-[#6b4a2a]">
                  We believe books can transform lives, spark imagination, and connect people across cultures and generations. That is why we focus on making discovery simple, pricing fair, and the overall experience genuinely enjoyable.
                </p>
                <p className="mt-4 text-base leading-8 text-[#6b4a2a]">
                  From bestsellers and classics to hidden gems and new releases, our goal is to help every kind of reader find something that feels exactly right.
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-amber-100 bg-[linear-gradient(180deg,#fff7e7_0%,#fffdf8_100%)] shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b45309]">What Guides Us</p>
                <div className="mt-5 space-y-4">
                  {values.map((value) => (
                    <div key={value.title} className="rounded-2xl border border-amber-100 bg-white/80 p-4">
                      <h3 className="font-serif text-xl font-semibold text-[#451a03]">{value.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-[#6b4a2a]">{value.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-14 sm:py-16">
        <div className="container-shell">
          <div
            ref={statsRef}
            className={`rounded-[32px] bg-[#1f2937] px-5 py-8 text-white shadow-[0_20px_50px_rgba(31,41,55,0.18)] sm:px-8 lg:px-10 transition-all duration-700 ${
              statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center backdrop-blur-sm">
                  <p className="font-serif text-3xl font-bold text-white sm:text-4xl">{stat.value}</p>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-14 sm:py-16">
        <div className="container-shell">
          <div
            ref={featuresRef}
            className={`mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end transition-all duration-700 ${
              featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b45309]">Why Readers Choose Us</p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-[#451a03] sm:text-4xl">A bookstore experience shaped for modern readers.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#6b4a2a] sm:text-base">
              We combine a warm visual identity with a practical, dependable experience that makes browsing and buying books feel effortless.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className={`group rounded-[26px] border-amber-100 bg-white/90 transition-all duration-700 hover:-translate-y-1 hover:shadow-xl ${
                    featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff3dd] text-[#b45309] shadow-sm transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 font-serif text-2xl font-semibold text-[#451a03]">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#6b4a2a]">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-14 sm:py-16">
        <div className="container-shell">
          <div
            ref={teamRef}
            className={`mb-10 text-center transition-all duration-700 ${
              teamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b45309]">Meet The Team</p>
            <h2 className="mt-3 font-serif text-3xl font-bold text-[#451a03] sm:text-4xl">The people behind the shelves.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {team.map((member, index) => (
              <Card
                key={`${member.name}-${member.role}`}
                className={`overflow-hidden rounded-[28px] border-amber-100 bg-white/90 shadow-sm transition-all duration-700 hover:-translate-y-1 hover:shadow-lg ${
                  teamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6 sm:p-7">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1f2937] text-2xl font-bold text-amber-200">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-semibold text-[#451a03]">{member.name}</h3>
                      <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-[#b45309]">
                        {member.role}
                      </p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-[#6b4a2a]">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16 pt-6 sm:pb-20">
        <div className="container-shell">
          <div
            ref={ctaRef}
            className={`rounded-[32px] border border-amber-100 bg-[linear-gradient(135deg,#fff8e8_0%,#fff1d9_100%)] px-6 py-8 shadow-sm sm:px-10 sm:py-10 transition-all duration-700 ${
              ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#b45309]">Ready To Browse</p>
                <h2 className="mt-3 font-serif text-3xl font-bold text-[#451a03]">Find your next great read with BookHive.</h2>
                <p className="mt-3 text-sm leading-7 text-[#6b4a2a] sm:text-base">
                  Explore curated titles, discover new favorites, and enjoy a bookstore experience built with readers in mind.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/books">
                  <Button className="h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 text-white hover:from-orange-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all duration-300">
                    Browse Catalog
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="h-12 rounded-full border-2 border-orange-500 bg-white/80 px-6 text-orange-600 hover:bg-orange-50 transition-all duration-300"
                  >
                    Talk to Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
