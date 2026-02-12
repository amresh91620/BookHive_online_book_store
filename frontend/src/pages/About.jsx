import React from "react";
import { BookOpen, Star, Users, ShieldCheck, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, Badge, Button } from "../components/ui";

const About = () => {
  const values = [
    {
      icon: BookOpen,
      title: "Smart Discovery",
      description: "Find books by genre, author, or popularity with zero clutter.",
      color: "text-blue-600",
    },
    {
      icon: Star,
      title: "Honest Reviews",
      description: "Real reader feedback you can trust before you buy.",
      color: "text-amber-500",
    },
    {
      icon: Users,
      title: "Reader Community",
      description: "Connect, share, and discover what others are reading.",
      color: "text-emerald-600",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Reliable",
      description: "Safe authentication and protected data across the platform.",
      color: "text-violet-600",
    },
  ];

  const stats = [
    { value: "10K+", label: "Readers" },
    { value: "50K+", label: "Reviews" },
    { value: "3K+", label: "Titles" },
    { value: "4.8", label: "Avg Rating" },
  ];

  const features = ["Curated Picks", "Verified Reviews", "Reader Community"];

  return (
    <div className="bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        {/* Hero */}
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center mb-16">
          <div>
            <Badge variant="secondary" icon={Sparkles} className="mb-5">
              About BookHive
            </Badge>
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
              {features.map((feature) => (
                <Badge key={feature} variant="secondary" size="md">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          <Card variant="elevated" padding="lg">
            <Card.Header>
              <Badge variant="secondary" size="sm" className="mb-2">
                Our Mission
              </Badge>
            </Card.Header>
            <Card.Content>
              <p className="text-slate-700 leading-relaxed mb-6">
                Make book discovery effortless and reviews meaningful. Every
                rating helps someone choose their next story.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-slate-50 p-4 border border-slate-200"
                  >
                    <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                    <Badge variant="secondary" size="sm" className="mt-1">
                      {stat.label}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <Card key={value.title} variant="elevated" padding="lg" hover>
                <Icon className={`w-10 h-10 ${value.color} mb-4`} />
                <Card.Title className="mb-2">{value.title}</Card.Title>
                <Card.Description>{value.description}</Card.Description>
              </Card>
            );
          })}
        </div>

        {/* Story */}
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center mb-16">
          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop"
            alt="Bookshelf"
            className="rounded-3xl shadow-lg border border-slate-200 w-full"
          />
          <div>
            <h2 className="text-3xl font-black mb-4">Why we built BookHive</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We wanted a bookstore experience that feels personal, not noisy.
              BookHive helps readers focus on what matters: great stories and
              genuine recommendations.
            </p>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Heart size={18} className="text-rose-500 flex-shrink-0" />
              Crafted with care for readers, students, and lifelong learners.
            </div>
          </div>
        </div>

        {/* CTA */}
        <Card variant="default" padding="xl" className="bg-slate-900 text-white border-slate-900">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white">Join the BookHive community</h3>
              <p className="text-white/70 mt-2">
                Start reviewing, rating, and discovering your next favorite book.
              </p>
            </div>
            <Link to="/books">
              <Button variant="secondary" size="lg">
                Explore Books
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default About;
