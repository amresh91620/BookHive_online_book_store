import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingCart,
  Heart,
  User,
  LogOut,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import BookHiveLogo from "@/components/common/BookHiveLogo";
import { cn } from "@/lib/utils";

const getDesktopNavClass = (isActive) =>
  cn(
    "relative text-sm font-medium uppercase tracking-wide transition after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:rounded-full after:transition-transform",
    isActive
      ? "text-[#F59E0B] after:scale-x-100 after:bg-[#F59E0B]"
      : "text-gray-700 hover:text-[#F59E0B] after:scale-x-0 after:bg-[#F59E0B]"
  );

const getMobileNavClass = (isActive) =>
  cn(
    "rounded-md px-4 py-2 text-sm font-medium uppercase transition",
    isActive
      ? "bg-[#FEF3C7] text-[#92400E]"
      : "text-gray-700 hover:bg-[#FEF3C7] hover:text-[#92400E]"
  );

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const queryFilter = new URLSearchParams(location.search).get("filter");
  const isNewReleaseActive =
    location.pathname === "/books" && queryFilter === "newArrival";
  const isBooksActive =
    location.pathname.startsWith("/books") && !isNewReleaseActive;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const cartCount = user ? (cartItems?.length || 0) : 0;
  const wishlistCount = user ? (wishlistItems?.length || 0) : 0;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar - Hidden on mobile */}
      <div className="hidden bg-[#1F2937] text-white sm:block">
        <div className="container-shell">
          <div className="flex h-9 items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">+91 9876543210</span>
              <span className="sm:hidden">Call Us</span>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-xs opacity-90">Follow us:</span>
              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#F59E0B]"
                  aria-label="Facebook"
                >
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#F59E0B]"
                  aria-label="Instagram"
                >
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#F59E0B]"
                  aria-label="Twitter"
                >
                  <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container-shell">
          <div className="flex h-16 items-center justify-between sm:h-20">
            <Link to="/" aria-label="BookHive home" className="shrink-0">
              <BookHiveLogo className="scale-90 transition hover:-translate-y-0.5 sm:scale-100" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
              <NavLink to="/" end className={({ isActive }) => getDesktopNavClass(isActive)}>
                Home
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => getDesktopNavClass(isActive)}>
                About
              </NavLink>
              <Link to="/books" className={getDesktopNavClass(isBooksActive)}>
                Books
              </Link>
              <Link
                to="/books?filter=newArrival"
                className={getDesktopNavClass(isNewReleaseActive)}
              >
                New Release
              </Link>
              <NavLink to="/contact" className={({ isActive }) => getDesktopNavClass(isActive)}>
                Contact
              </NavLink>
              <NavLink to="/blog" className={({ isActive }) => getDesktopNavClass(isActive)}>
                Blog
              </NavLink>
              {user?.role === "admin" && (
                <NavLink
                  to="/admin"
                  className={() =>
                    getDesktopNavClass(location.pathname.startsWith("/admin"))
                  }
                >
                  Admin
                </NavLink>
              )}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              {user ? (
                <>
                  <Link to="/profile" className="hidden lg:block">
                    <User className="h-5 w-5 text-gray-700 transition hover:text-[#F59E0B]" />
                  </Link>
                  <Link to="/wishlist" className="relative">
                    <Heart className="h-5 w-5 text-gray-700 transition hover:text-red-500" />
                    {wishlistCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white sm:h-5 sm:w-5 sm:text-xs">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                  <Link to="/cart" className="relative">
                    <ShoppingCart className="h-5 w-5 text-gray-700 transition hover:text-[#F59E0B]" />
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#F59E0B] text-[10px] font-medium text-white sm:h-5 sm:w-5 sm:text-xs">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="hidden text-gray-700 hover:text-[#F59E0B] lg:flex"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="hidden gap-2 lg:flex">
                  <Link to="/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#F59E0B] text-[#F59E0B] hover:bg-[#FEF3C7]"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="bg-[#F59E0B] text-white hover:bg-[#D97706]">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white py-4 shadow-lg lg:hidden">
          <div className="container-shell">
            <nav className="flex flex-col gap-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) => getMobileNavClass(isActive)}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/about"
                className={({ isActive }) => getMobileNavClass(isActive)}
                onClick={() => setMobileMenuOpen(false)}
              >
                About Us
              </NavLink>
              <Link
                to="/books"
                className={getMobileNavClass(isBooksActive)}
                onClick={() => setMobileMenuOpen(false)}
              >
                Books
              </Link>
              <Link
                to="/books?filter=newArrival"
                className={getMobileNavClass(isNewReleaseActive)}
                onClick={() => setMobileMenuOpen(false)}
              >
                New Release
              </Link>
              <NavLink
                to="/contact"
                className={({ isActive }) => getMobileNavClass(isActive)}
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact Us
              </NavLink>
              <NavLink
                to="/blog"
                className={({ isActive }) => getMobileNavClass(isActive)}
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </NavLink>
              {user?.role === "admin" && (
                <NavLink
                  to="/admin"
                  className={() => getMobileNavClass(location.pathname.startsWith("/admin"))}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </NavLink>
              )}

              {user ? (
                <>
                  <div className="my-2 border-t border-gray-200 pt-2">
                    <Link
                      to="/orders"
                      className={getMobileNavClass(location.pathname.startsWith("/orders"))}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/profile"
                      className={getMobileNavClass(location.pathname === "/profile")}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="rounded-md px-4 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="mt-2 flex flex-col gap-2 border-t border-gray-200 pt-3">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full border-[#F59E0B] text-[#F59E0B]" variant="outline">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-[#F59E0B] text-white hover:bg-[#D97706]">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
