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
  Home,
  BookOpen,
  Percent,
  Newspaper,
  Info,
  Shield,
  Package,
  LogIn,
  UserPlus,
} from "lucide-react";
import { logout } from "@/store/slices/authSlice";
import { useCart } from "@/hooks/api/useCart";
import { useWishlist } from "@/hooks/api/useWishlist";
import { Button } from "@/components/ui/button";
import BookHiveLogo from "@/components/common/BookHiveLogo";
import { cn } from "@/lib/utils";

const getDesktopNavClass = (isActive) =>
  cn(
    "relative text-[13px] font-semibold uppercase tracking-wider transition-all duration-300 py-2 px-1",
    isActive
      ? "text-amber-700"
      : "text-stone-700 hover:text-amber-700"
  );

const getMobileNavClass = (isActive) =>
  cn(
    "group flex w-full items-center gap-3 rounded-xl px-5 py-3.5 text-[15px] font-medium transition-all duration-200",
    isActive
      ? "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-900 border-l-4 border-amber-600"
      : "text-stone-700 hover:bg-stone-50 hover:text-amber-800"
  );

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const { data: cartData } = useCart();
  const { data: wishlistItems = [] } = useWishlist();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isBooksActive = location.pathname.startsWith("/books");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const cartCount = user ? (cartData?.items?.length || 0) : 0;
  const wishlistCount = user ? (wishlistItems?.length || 0) : 0;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-stone-200">
        {/* Sleek Top Bar */}
        <div className="hidden bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white sm:block">
          <div className="container-shell">
            <div className="flex h-9 items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-stone-300">
                <Phone className="h-3.5 w-3.5 text-amber-500" />
                <span className="font-medium">+91 98765 43210</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-stone-400 text-[11px] uppercase tracking-wider">Follow Us</span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-400 hover:text-amber-500 transition-all duration-300 hover:scale-110"
                    aria-label="Facebook"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-400 hover:text-amber-500 transition-all duration-300 hover:scale-110"
                    aria-label="Instagram"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-400 hover:text-amber-500 transition-all duration-300 hover:scale-110"
                    aria-label="Twitter"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="bg-white/95 backdrop-blur-md">
          <div className="container-shell">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link to="/" aria-label="BookHive home" className="shrink-0 group">
                <BookHiveLogo className="transition-all duration-300 group-hover:scale-105" />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden items-center gap-8 lg:flex">
                <NavLink to="/" end className={({ isActive }) => getDesktopNavClass(isActive)}>
                  <span className="relative">
                    Home
                    <span className={cn(
                      "absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-amber-600 transition-transform duration-300",
                      location.pathname === "/" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}></span>
                  </span>
                </NavLink>
                <Link to="/books" className={getDesktopNavClass(isBooksActive)}>
                  <span className="relative">
                    Books
                    <span className={cn(
                      "absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-amber-600 transition-transform duration-300",
                      isBooksActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}></span>
                  </span>
                </Link>
                <NavLink to="/deals" className={({ isActive }) => getDesktopNavClass(isActive)}>
                  <span className="relative">
                    Deals
                    <span className={cn(
                      "absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-amber-600 transition-transform duration-300",
                      location.pathname === "/deals" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}></span>
                  </span>
                </NavLink>
                <NavLink to="/blog" className={({ isActive }) => getDesktopNavClass(isActive)}>
                  <span className="relative">
                    Blog
                    <span className={cn(
                      "absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-amber-600 transition-transform duration-300",
                      location.pathname.startsWith("/blog") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}></span>
                  </span>
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => getDesktopNavClass(isActive)}>
                  <span className="relative">
                    About
                    <span className={cn(
                      "absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-amber-600 transition-transform duration-300",
                      location.pathname === "/about" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}></span>
                  </span>
                </NavLink>
                <NavLink to="/contact" className={({ isActive }) => getDesktopNavClass(isActive)}>
                  <span className="relative">
                    Contact
                    <span className={cn(
                      "absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-amber-600 transition-transform duration-300",
                      location.pathname === "/contact" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}></span>
                  </span>
                </NavLink>

                {user?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={() => getDesktopNavClass(location.pathname.startsWith("/admin"))}
                  >
                    <span className="relative">
                      Admin
                      <span className={cn(
                        "absolute -bottom-1 left-0 h-0.5 w-full origin-left rounded-full bg-amber-600 transition-transform duration-300",
                        location.pathname.startsWith("/admin") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      )}></span>
                    </span>
                  </NavLink>
                )}
              </nav>

              {/* Action Icons */}
              <div className="flex items-center gap-2">
                {user ? (
                  <>
                    <Link to="/profile" className="hidden lg:block">
                      <div className="p-2.5 rounded-lg hover:bg-stone-100 transition-all duration-300 group">
                        <User className="h-5 w-5 text-stone-600 group-hover:text-amber-700 transition-all duration-300 group-hover:scale-110" />
                      </div>
                    </Link>
                    <Link to="/wishlist" className="relative group">
                      <div className="p-2.5 rounded-lg hover:bg-stone-100 transition-all duration-300">
                        <Heart className="h-5 w-5 text-stone-600 group-hover:text-red-500 transition-all duration-300 group-hover:scale-110" />
                      </div>
                      {wishlistCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-[10px] font-bold text-white ring-2 ring-white shadow-sm">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    <Link to="/cart" className="relative group">
                      <div className="p-2.5 rounded-lg hover:bg-stone-100 transition-all duration-300">
                        <ShoppingCart className="h-5 w-5 text-stone-600 group-hover:text-amber-700 transition-all duration-300 group-hover:scale-110" />
                      </div>
                      {cartCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-[10px] font-bold text-white ring-2 ring-white shadow-sm">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLogout}
                      className="hidden lg:flex h-10 w-10 text-stone-600 hover:text-amber-700 hover:bg-stone-100 transition-all duration-300 hover:scale-105"
                    >
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <div className="hidden items-center gap-2 lg:flex">
                    <Link to="/login">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 text-stone-700 hover:text-amber-700 hover:bg-stone-100 font-medium transition-all duration-300"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button
                        size="sm"
                        className="h-9 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2.5 rounded-lg hover:bg-stone-100 transition-all duration-300"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6 text-stone-700" />
                  ) : (
                    <Menu className="h-6 w-6 text-stone-700" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div
            className={cn(
              "fixed top-0 bottom-0 right-0 z-50 w-[85%] max-w-[320px] mt-16 bg-white flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl",
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="flex flex-col gap-1 px-4">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => getMobileNavClass(isActive)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  Home
                </NavLink>

                <Link
                  to="/books"
                  className={getMobileNavClass(isBooksActive)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookOpen className="h-5 w-5" />
                  Books
                </Link>

                <NavLink
                  to="/deals"
                  className={({ isActive }) => getMobileNavClass(isActive)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Percent className="h-5 w-5" />
                  Deals
                </NavLink>

                <NavLink
                  to="/blog"
                  className={({ isActive }) => getMobileNavClass(isActive)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Newspaper className="h-5 w-5" />
                  Blog
                </NavLink>

                <NavLink
                  to="/about"
                  className={({ isActive }) => getMobileNavClass(isActive)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Info className="h-5 w-5" />
                  About
                </NavLink>

                <NavLink
                  to="/contact"
                  className={({ isActive }) => getMobileNavClass(isActive)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Phone className="h-5 w-5" />
                  Contact
                </NavLink>

                {user?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={() => getMobileNavClass(location.pathname.startsWith("/admin"))}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="h-5 w-5" />
                    Admin
                  </NavLink>
                )}

                {user ? (
                  <>
                    <div className="my-3 border-t border-stone-200 pt-3">
                      <Link
                        to="/orders"
                        className={getMobileNavClass(location.pathname.startsWith("/orders"))}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Package className="h-5 w-5" />
                        My Orders
                      </Link>
                      <Link
                        to="/profile"
                        className={getMobileNavClass(location.pathname === "/profile")}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        My Profile
                      </Link>
                    </div>

                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-5 py-3.5 text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="mt-4 flex flex-col gap-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-3 border-amber-600 text-amber-700 hover:bg-amber-50 h-11"
                      >
                        <LogIn className="h-5 w-5" />
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full justify-start gap-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 h-11">
                        <UserPlus className="h-5 w-5" />
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
