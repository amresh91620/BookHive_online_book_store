import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import BookHiveLogo from "@/components/common/BookHiveLogo";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-stone-300 mt-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-texture opacity-10"></div>
      <div className="container-shell py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link to="/" aria-label="BookHive home" className="inline-block group">
              <BookHiveLogo
                className="mb-6 bg-stone-950/50 ring-amber-400/30 backdrop-blur-sm group-hover:ring-amber-400/50 transition-smooth"
                textClassName="text-[1.5rem]"
                iconWrapClassName="h-7 w-7"
              />
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed font-light">
              Your sanctuary for literary discovery. Explore curated collections and timeless stories that inspire.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className=" font-bold text-white mb-6 text-lg tracking-tight">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-stone-400 hover:text-amber-400 transition-smooth hover:translate-x-1 inline-block">Home</Link>
              </li>
              <li>
                <Link to="/books" className="text-stone-400 hover:text-amber-400 transition-smooth hover:translate-x-1 inline-block">Books</Link>
              </li>
              <li>
                <Link to="/about" className="text-stone-400 hover:text-amber-400 transition-smooth hover:translate-x-1 inline-block">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-stone-400 hover:text-amber-400 transition-smooth hover:translate-x-1 inline-block">Contact</Link>
              </li>
              <li>
                <Link to="/blog" className="text-stone-400 hover:text-amber-400 transition-smooth hover:translate-x-1 inline-block">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className=" font-bold text-white mb-6 text-lg tracking-tight">Account</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/orders" className="text-stone-400 hover:text-amber-400 transition-smooth hover:translate-x-1 inline-block">My Orders</Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-stone-400 hover:text-amber-400 transition-smooth hover:translate-x-1 inline-block">Wishlist</Link>
              </li>
              <li>
                <Link to="/cart" className="text-stone-400 hover:text-amber-400 transition-smooth hover:translate-x-1 inline-block">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/faq" className="text-stone-400 hover:text-amber-400 transition-smooth hover:translate-x-1 inline-block">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className=" font-bold text-white mb-6 text-lg tracking-tight">Get in Touch</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 group">
                <Mail className="w-5 h-5 text-amber-500 mt-0.5 group-hover:scale-110 transition-smooth" />
                <span className="text-stone-400 group-hover:text-amber-400 transition-smooth">amresh91620@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 group">
                <Phone className="w-5 h-5 text-amber-500 mt-0.5 group-hover:scale-110 transition-smooth" />
                <span className="text-stone-400 group-hover:text-amber-400 transition-smooth">+91 91232 33736</span>
              </li>
              <li className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-amber-500 mt-0.5 group-hover:scale-110 transition-smooth" />
                <span className="text-stone-400 group-hover:text-amber-400 transition-smooth">Siwan, Bihar<br/>Pin-841239</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-700/50 mt-12 pt-8 text-center text-sm text-stone-500">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <Link to="/privacy" className="hover:text-amber-400 transition-smooth font-medium">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-amber-400 transition-smooth font-medium">Terms of Service</Link>
            <Link to="/faq" className="hover:text-amber-400 transition-smooth font-medium">FAQ</Link>
          </div>
          <p className="font-light">&copy; {new Date().getFullYear()} BookHive. Crafted with passion for readers.</p>
        </div>
      </div>
    </footer>
  );
}

