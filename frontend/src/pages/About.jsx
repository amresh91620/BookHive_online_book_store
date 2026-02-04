import React from "react";
import { BookOpen, Star, Users, ShieldCheck, Sparkles, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-14 sm:py-20">
        {/* Hero */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center mb-16">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-xs uppercase tracking-[0.3em] text-slate-500">
              <Sparkles size={14} className="text-amber-500" />
              About BookHive
            </div>
            <h1 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight">
              A modern bookstore built for real readers
            </h1>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              BookHive is a community-first platform where readers discover new
              titles, share honest reviews, and build their personal libraries.
              We focus on clarity, trust, and the joy of finding your next great
              read.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold uppercase tracking-wider">
                Curated Picks
              </span>
              <span className="px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold uppercase tracking-wider">
                Verified Reviews
              </span>
              <span className="px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold uppercase tracking-wider">
                Reader Community
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h3 className="text-sm uppercase tracking-[0.25em] text-slate-400">
              Our Mission
            </h3>
            <p className="mt-4 text-slate-700 leading-relaxed">
              Make book discovery effortless and reviews meaningful. Every
              rating helps someone choose their next story.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <p className="text-2xl font-black text-slate-900">10K+</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Readers
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <p className="text-2xl font-black text-slate-900">50K+</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Reviews
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <p className="text-2xl font-black text-slate-900">3K+</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Titles
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <p className="text-2xl font-black text-slate-900">4.8</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Avg Rating
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <BookOpen className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Smart Discovery</h3>
            <p className="text-slate-600 text-sm">
              Find books by genre, author, or popularity with zero clutter.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Star className="w-10 h-10 text-amber-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Honest Reviews</h3>
            <p className="text-slate-600 text-sm">
              Real reader feedback you can trust before you buy.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Users className="w-10 h-10 text-emerald-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Reader Community</h3>
            <p className="text-slate-600 text-sm">
              Connect, share, and discover what others are reading.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <ShieldCheck className="w-10 h-10 text-violet-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Secure & Reliable</h3>
            <p className="text-slate-600 text-sm">
              Safe authentication and protected data across the platform.
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center mb-16">
          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop"
            alt="Bookshelf"
            className="rounded-3xl shadow-lg border border-slate-200"
          />
          <div>
            <h2 className="text-3xl font-black mb-4">Why we built BookHive</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We wanted a bookstore experience that feels personal, not noisy.
              BookHive helps readers focus on what matters: great stories and
              genuine recommendations.
            </p>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Heart size={18} className="text-rose-500" />
              Crafted with care for readers, students, and lifelong learners.
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Join the BookHive community</h3>
            <p className="text-white/70 mt-2">
              Start reviewing, rating, and discovering your next favorite book.
            </p>
          </div>
          <a
            href="/books"
            className="inline-flex items-center justify-center bg-white text-slate-900 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition"
          >
            Explore Books
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
