import React from "react";
import { Link } from "react-router-dom";
import { BookOpenCheck, Github, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-white/10 p-2 rounded-lg border border-white/10">
                <BookOpenCheck className="text-white" size={22} />
              </div>
              <span className="text-white text-2xl font-semibold tracking-wide font-serif">
                Book<span className="text-blue-200">Hive</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Discover, rate, and share your favorite books with a growing community of readers.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold uppercase tracking-wider text-xs">Company</h3>
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold uppercase tracking-wider text-xs">Support</h3>
            <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-white font-semibold uppercase tracking-wider text-xs">Connect</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Github size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Mail size={20} /></a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} BookHive. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
