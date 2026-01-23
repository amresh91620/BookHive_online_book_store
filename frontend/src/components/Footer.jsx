import React from "react";
import { Link } from "react-router-dom";
import { BookOpenCheck, Github, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800">
      {/* Horizontal padding same as Navbar & Main (px-6 md:px-8) */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <BookOpenCheck className="text-[#f5f504]" size={30} />
              <span className="text-white text-2xl font-bold">Book</span>
              <span className="text-yellow-300 text-xl font-semibold">Hive</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Discover, rate, and share your favorite books with a growing community of readers.
            </p>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold">Company</h3>
            <Link to="/about" className="hover:text-yellow-300 transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-yellow-300 transition-colors">Contact</Link>
          </div>

          {/* Support Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold">Support</h3>
            <Link to="/" className="hover:text-yellow-300 transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-yellow-300 transition-colors">Terms of Service</Link>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-yellow-300 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-yellow-300 transition-colors"><Github size={20} /></a>
              <a href="#" className="hover:text-yellow-300 transition-colors"><Mail size={20} /></a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} BookHive. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
