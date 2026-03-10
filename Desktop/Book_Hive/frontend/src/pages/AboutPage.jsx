import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Award, Heart, Target, Zap } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: BookOpen,
      title: "Vast Collection",
      description: "Access to thousands of books across all genres and categories",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a community of book lovers and share your reading experiences",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Carefully curated selection of high-quality books",
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Dedicated customer support and hassle-free returns",
    },
    {
      icon: Target,
      title: "Fast Delivery",
      description: "Quick and reliable delivery to your doorstep",
    },
    {
      icon: Zap,
      title: "Easy Shopping",
      description: "Simple and intuitive shopping experience",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      description: "Book enthusiast with 15 years in publishing",
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      description: "Logistics expert ensuring smooth deliveries",
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Relations",
      description: "Dedicated to providing excellent customer service",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2378350f' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`}}></div>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#FEF3C7] to-transparent py-20 relative z-10 border-b border-[#E5E5E5]">
        <div className="container-shell">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-serif font-bold text-[#451a03] mb-6 tracking-tight">About BookHive</h1>
            <p className="text-xl font-serif italic text-[#78350F] leading-relaxed">
              We're passionate about connecting readers with the books they love. Since our
              founding, we've been dedicated to making quality literature accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 relative z-10">
        <div className="container-shell">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
               <div className="h-[1px] w-12 sm:w-24 bg-[#D97706]"></div>
               <h2 className="text-3xl font-serif font-bold text-[#451a03] text-center">Our Mission</h2>
               <div className="h-[1px] w-12 sm:w-24 bg-[#D97706]"></div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-serif">
              At BookHive, we believe that books have the power to transform lives, spark
              imagination, and connect people across cultures and generations. Our mission is to
              make reading accessible, affordable, and enjoyable for everyone.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed font-serif">
              We carefully curate our collection to include bestsellers, classics, hidden gems,
              and new releases across all genres. Whether you're looking for fiction, non-fiction,
              academic texts, or children's books, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white/50 border-y border-[#E5E5E5] relative z-10">
        <div className="container-shell">
          <h2 className="text-3xl font-serif font-bold text-[#451a03] mb-12 text-center">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow bg-white border-[#E5E5E5]">
                  <CardContent className="p-6">
                    <div className="bg-[#FEF3C7] w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-[#FDE68A]">
                      <Icon className="w-6 h-6 text-[#D97706]" />
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-[#451a03] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 font-serif">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 relative z-10">
        <div className="container-shell">
          <h2 className="text-3xl font-serif font-bold text-[#451a03] mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="bg-white border-[#E5E5E5] shadow-sm hover:shadow-md transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-serif font-bold text-[#D97706]">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-[#451a03] mb-1">{member.name}</h3>
                  <p className="text-[#D97706] font-medium mb-2 font-serif">{member.role}</p>
                  <p className="text-gray-600 text-sm font-serif">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#78350F] text-[#FEF3C7] relative z-10">
        <div className="container-shell">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-serif font-bold mb-2 text-white">10,000+</div>
              <div className="text-[#FDE68A] font-serif uppercase tracking-wider text-sm">Books Available</div>
            </div>
            <div>
              <div className="text-4xl font-serif font-bold mb-2 text-white">50,000+</div>
              <div className="text-[#FDE68A] font-serif uppercase tracking-wider text-sm">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-serif font-bold mb-2 text-white">100+</div>
              <div className="text-[#FDE68A] font-serif uppercase tracking-wider text-sm">Publishers</div>
            </div>
            <div>
              <div className="text-4xl font-serif font-bold mb-2 text-white">24/7</div>
              <div className="text-[#FDE68A] font-serif uppercase tracking-wider text-sm">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 relative z-10 border-t border-[#E5E5E5]">
        <div className="container-shell">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-[#451a03] mb-8 text-center">Our Values</h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E5E5]">
                <h3 className="text-xl font-serif font-semibold text-[#451a03] mb-2">Quality</h3>
                <p className="text-gray-600 font-serif">
                  We ensure every book in our collection meets high standards of quality and
                  authenticity.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E5E5]">
                <h3 className="text-xl font-serif font-semibold text-[#451a03] mb-2">Accessibility</h3>
                <p className="text-gray-600 font-serif">
                  We believe everyone should have access to great books at affordable prices.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E5E5]">
                <h3 className="text-xl font-serif font-semibold text-[#451a03] mb-2">Community</h3>
                <p className="text-gray-600 font-serif">
                  We foster a community of readers who share their love for books and learning.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E5E5]">
                <h3 className="text-xl font-serif font-semibold text-[#451a03] mb-2">Innovation</h3>
                <p className="text-gray-600 font-serif">
                  We continuously improve our platform to provide the best shopping experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
