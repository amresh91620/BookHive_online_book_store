import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import BookHiveLogo from "@/components/common/BookHiveLogo";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container-shell py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" aria-label="BookHive home">
              <BookHiveLogo
                className="mb-4 bg-[#061534] ring-amber-300/25"
                textClassName="text-[1.45rem]"
                iconWrapClassName="h-6 w-6"
              />
            </Link>
            <p className="text-sm text-gray-400">
              Your one-stop destination for all your reading needs. Discover, explore, and enjoy the world of books.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-amber-500 transition">Home</Link>
              </li>
              <li>
                <Link to="/books" className="hover:text-amber-500 transition">Books</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-500 transition">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-500 transition">Contact</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-amber-500 transition">Blog</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-white mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/orders" className="hover:text-amber-500 transition">My Orders</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-amber-500 transition">Wishlist</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-amber-500 transition">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-500 transition">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>amresh91620@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>+91 91232 33736</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                <span>Siwan (Bihar) Pin-841239</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <div className="flex justify-center gap-6 mb-4">
            <Link to="/privacy" className="hover:text-amber-500 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-amber-500 transition">Terms of Service</Link>
            <Link to="/faq" className="hover:text-amber-500 transition">FAQ</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} BookHive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
