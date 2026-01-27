import React from "react";
import { BookOpen, Star, Users, ShieldCheck } from "lucide-react";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          About <span className="text-blue-500">BookHive</span>
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          BookHive is an online book review and rating platform where readers
          discover books, share honest reviews, and help others choose their
          next great read.
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            📚 Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to build a community-driven platform for book lovers.
            We believe every reader has a story to tell and every book deserves
            a fair review. BookHive empowers users to rate books, write reviews,
            and explore recommendations from real readers.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1512820790803-83ca734da794"
          alt="Books"
          className="rounded-xl shadow-lg"
        />
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          🌟 What We Offer
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature Card */}
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
            <BookOpen className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Book Discovery</h3>
            <p className="text-gray-600 text-sm">
              Explore books by title, author, genre, and popularity.
            </p>
          </div>

          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
            <Star className="w-10 h-10 text-yellow-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Ratings & Reviews</h3>
            <p className="text-gray-600 text-sm">
              Share your honest opinions and rate books with stars.
            </p>
          </div>

          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
            <Users className="w-10 h-10 text-blue-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Reader Community</h3>
            <p className="text-gray-600 text-sm">
              Connect with fellow readers and see what others are reading.
            </p>
          </div>

          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition">
            <ShieldCheck className="w-10 h-10 text-purple-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Secure Platform</h3>
            <p className="text-gray-600 text-sm">
              Safe authentication and reliable data handling for users.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-green-50 rounded-2xl p-10 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Why Choose BookHive?
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Unlike generic review platforms, BookHive focuses purely on books and
          readers. Every review matters, every rating counts, and every reader
          helps build a better reading community.
        </p>
      </div>
    </div>
  );
};

export default About;
