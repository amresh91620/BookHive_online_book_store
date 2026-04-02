import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import BookHiveLogo from "@/components/common/BookHiveLogo";

export default function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[#d8e6e1] bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(247,245,239,0.96))] text-slate-600">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(151,234,220,0.18),transparent_26%),radial-gradient(circle_at_85%_10%,rgba(241,208,136,0.14),transparent_22%)]" />
      <div className="container-shell relative py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" aria-label="BookHive home" className="inline-block group">
              <BookHiveLogo
                className="mb-6 transition-smooth group-hover:opacity-90"
                textClassName="text-[1.5rem]"
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-500">
              Your sanctuary for literary discovery. Explore curated collections and timeless stories that inspire.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold tracking-tight text-slate-900">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="inline-block text-slate-500 transition-smooth hover:translate-x-1 hover:text-[#0b7a71]">Home</Link>
              </li>
              <li>
                <Link to="/books" className="inline-block text-slate-500 transition-smooth hover:translate-x-1 hover:text-[#0b7a71]">Books</Link>
              </li>
              <li>
                <Link to="/about" className="inline-block text-slate-500 transition-smooth hover:translate-x-1 hover:text-[#0b7a71]">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="inline-block text-slate-500 transition-smooth hover:translate-x-1 hover:text-[#0b7a71]">Contact</Link>
              </li>
              <li>
                <Link to="/blog" className="inline-block text-slate-500 transition-smooth hover:translate-x-1 hover:text-[#0b7a71]">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-6 text-lg font-semibold tracking-tight text-slate-900">Account</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/orders" className="inline-block text-slate-500 transition-smooth hover:translate-x-1 hover:text-[#0b7a71]">My Orders</Link>
              </li>
              <li>
                <Link to="/wishlist" className="inline-block text-slate-500 transition-smooth hover:translate-x-1 hover:text-[#0b7a71]">Wishlist</Link>
              </li>
              <li>
                <Link to="/cart" className="inline-block text-slate-500 transition-smooth hover:translate-x-1 hover:text-[#0b7a71]">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/faq" className="inline-block text-slate-500 transition-smooth hover:translate-x-1 hover:text-[#0b7a71]">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-6 text-lg font-semibold tracking-tight text-slate-900">Get in Touch</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <Mail className="mt-0.5 h-5 w-5 text-[#0b7a71] transition-smooth group-hover:scale-110" />
                <span className="text-slate-500 transition-smooth group-hover:text-[#0b7a71]">amresh91620@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 group">
                <Phone className="mt-0.5 h-5 w-5 text-[#0b7a71] transition-smooth group-hover:scale-110" />
                <span className="text-slate-500 transition-smooth group-hover:text-[#0b7a71]">+91 91232 33736</span>
              </li>
              <li className="flex items-start gap-3 group">
                <MapPin className="mt-0.5 h-5 w-5 text-[#0b7a71] transition-smooth group-hover:scale-110" />
                <span className="text-slate-500 transition-smooth group-hover:text-[#0b7a71]">Siwan, Bihar<br />Pin-841239</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#d8e6e1] pt-8 text-center text-sm text-slate-500">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <Link to="/privacy" className="font-medium transition-smooth hover:text-[#0b7a71]">Privacy Policy</Link>
            <Link to="/terms" className="font-medium transition-smooth hover:text-[#0b7a71]">Terms of Service</Link>
            <Link to="/faq" className="font-medium transition-smooth hover:text-[#0b7a71]">FAQ</Link>
          </div>
          <p className="font-light">&copy; {new Date().getFullYear()} BookHive. Crafted with passion for readers.</p>
        </div>
      </div>
    </footer>
  );
}

