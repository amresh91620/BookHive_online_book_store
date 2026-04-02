import { useEffect, useState } from "react";
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
    "group relative py-2 text-[15px] font-medium transition-colors duration-200",
    isActive
      ? "text-slate-900"
      : "text-slate-600 hover:text-[#0b7a71]"
  );

const getMobileNavClass = (isActive) =>
  cn(
    "group flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-[15px] font-medium transition-all duration-200",
    isActive
      ? "bg-[#ecf8f5] text-[#0b6158]"
      : "text-slate-700 hover:bg-[#f3f7f5] hover:text-[#0b7a71]"
  );

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const { data: cartData } = useCart();
  const { data: wishlistItems = [] } = useWishlist();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const isBooksActive = location.pathname.startsWith("/books");

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", mobileMenuOpen);

    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [mobileMenuOpen]);

  const handleOpenMenu = () => {
    setMobileMenuOpen(true);
    setTimeout(() => setIsAnimating(true), 10);
  };

  const handleCloseMenu = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setMobileMenuOpen(false);
    }, 300);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const cartCount = user ? (cartData?.items?.length || 0) : 0;
  const wishlistCount = user ? (wishlistItems?.length || 0) : 0;

  return (
    <>
      <header className="relative sticky top-0 z-50 border-b border-[#d8e6e1] bg-[#f7f5ef]/95 backdrop-blur-xl shadow-sm">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_15%_0%,rgba(151,234,220,0.12),transparent_34%),radial-gradient(circle_at_85%_0%,rgba(241,208,136,0.08),transparent_28%)]" />
        <div className="container-shell relative">
          <div className="flex h-16 items-center justify-between gap-4">
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
                      "absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-full bg-[#0b7a71] transition-transform duration-300",
                      location.pathname === "/" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}></span>
                  </span>
                </NavLink>
                <Link to="/books" className={getDesktopNavClass(isBooksActive)}>
                  <span className="relative">
                    Books
                    <span className={cn(
                      "absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-full bg-[#0b7a71] transition-transform duration-300",
                      isBooksActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}></span>
                  </span>
                </Link>
                <NavLink to="/deals" className={({ isActive }) => getDesktopNavClass(isActive)}>
                  <span className="relative">
                    Deals
                    <span className={cn(
                      "absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-full bg-[#0b7a71] transition-transform duration-300",
                      location.pathname === "/deals" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}></span>
                  </span>
                </NavLink>
                <NavLink to="/blog" className={({ isActive }) => getDesktopNavClass(isActive)}>
                  <span className="relative">
                    Blog
                    <span className={cn(
                      "absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-full bg-[#0b7a71] transition-transform duration-300",
                      location.pathname.startsWith("/blog") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}></span>
                  </span>
                </NavLink>
                <NavLink to="/about" className={({ isActive }) => getDesktopNavClass(isActive)}>
                  <span className="relative">
                    About
                    <span className={cn(
                      "absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-full bg-[#0b7a71] transition-transform duration-300",
                      location.pathname === "/about" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}></span>
                  </span>
                </NavLink>
                <NavLink to="/contact" className={({ isActive }) => getDesktopNavClass(isActive)}>
                  <span className="relative">
                    Contact
                    <span className={cn(
                      "absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-full bg-[#0b7a71] transition-transform duration-300",
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
                        "absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-full bg-[#0b7a71] transition-transform duration-300",
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
                    <Link to="/wishlist" className="relative group hidden lg:block">
                      <div className="rounded-full p-2.5 transition-all duration-300 hover:bg-white/80">
                        <Heart className="h-5 w-5 text-slate-700 transition-all duration-300 group-hover:scale-110 group-hover:text-red-500" />
                      </div>
                      {wishlistCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-[10px] font-bold text-white ring-2 ring-[#f7f5ef] shadow-sm">
                          {wishlistCount}
                        </span>
                      )}
                    </Link>
                    <Link to="/cart" className="relative group">
                      <div className="rounded-full p-2.5 transition-all duration-300 hover:bg-white/80">
                        <ShoppingCart className="h-5 w-5 text-slate-700 transition-all duration-300 group-hover:scale-110 group-hover:text-[#0b7a71]" />
                      </div>
                      {cartCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#0b7a71] text-[10px] font-bold text-white ring-2 ring-[#f7f5ef] shadow-sm">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <Link to="/profile" className="hidden lg:block">
                      <div className="rounded-full p-2.5 transition-all duration-300 group hover:bg-white/80">
                        <User className="h-5 w-5 text-slate-700 transition-all duration-300 group-hover:scale-110 group-hover:text-[#0b7a71]" />
                      </div>
                    </Link>
                  </>
                ) : (
                  <div className="hidden items-center gap-2 lg:flex">
                    <Link to="/login">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 rounded-full px-5 text-slate-700 hover:bg-white/80 hover:text-[#0b7a71]"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button
                        size="sm"
                        className="h-10 rounded-full bg-[#0b7a71] px-6 text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-[#095f59]"
                      >
                        Register
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => {
                    if (mobileMenuOpen) {
                      handleCloseMenu();
                    } else {
                      handleOpenMenu();
                    }
                  }}
                  className="rounded-full p-2.5 transition-all duration-300 hover:bg-[#edf7f4] lg:hidden"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6 text-slate-700" />
                  ) : (
                    <Menu className="h-6 w-6 text-slate-700" />
                  )}
                </button>
              </div>
            </div>
          </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <>
          <div
            className={cn(
              "fixed inset-0 z-[60] bg-[rgba(15,23,42,0.42)] backdrop-blur-[3px] lg:hidden transition-opacity duration-300",
              isAnimating ? "opacity-100" : "opacity-0"
            )}
            onClick={handleCloseMenu}
          />

          <div
            className={cn(
              "fixed inset-y-0 right-0 z-[70] flex w-[min(88vw,340px)] flex-col overflow-hidden border-l border-[#d8e6e1] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(244,249,247,0.98)_100%)] shadow-[0_28px_70px_rgba(15,23,42,0.22)] transition-transform duration-300 ease-out supports-[backdrop-filter]:bg-[linear-gradient(180deg,rgba(255,255,255,0.88)_0%,rgba(244,249,247,0.9)_100%)] supports-[backdrop-filter]:backdrop-blur-xl lg:hidden",
              isAnimating ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="border-b border-[#d8e6e1] bg-[radial-gradient(circle_at_top_left,rgba(151,234,220,0.24),transparent_44%),linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(247,250,249,0.76)_100%)] px-4 pb-4 pt-5">
              <div className="flex items-start justify-between gap-3">
                <Link
                  to="/"
                  aria-label="BookHive home"
                  className="min-w-0 shrink"
                  onClick={handleCloseMenu}
                >
                  <BookHiveLogo
                    className="gap-2.5"
                    iconWrapClassName="h-11 w-11 rounded-2xl"
                    textClassName="text-[1.38rem]"
                  />
                </Link>

                <button
                  type="button"
                  onClick={handleCloseMenu}
                  className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#cfe2dc] bg-white/90 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-all duration-200 hover:bg-[#edf7f4] hover:text-[#0b7a71]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mobile-drawer-scroll flex-1 overflow-y-auto overscroll-contain py-5">
              <nav className="flex flex-col gap-1 px-4">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) => getMobileNavClass(isActive)}
                  onClick={handleCloseMenu}
                >
                  <Home className="h-5 w-5" />
                  Home
                </NavLink>

                <Link
                  to="/books"
                  className={getMobileNavClass(isBooksActive)}
                  onClick={handleCloseMenu}
                >
                  <BookOpen className="h-5 w-5" />
                  Books
                </Link>

                <NavLink
                  to="/deals"
                  className={({ isActive }) => getMobileNavClass(isActive)}
                  onClick={handleCloseMenu}
                >
                  <Percent className="h-5 w-5" />
                  Deals
                </NavLink>

                <NavLink
                  to="/blog"
                  className={({ isActive }) => getMobileNavClass(isActive)}
                  onClick={handleCloseMenu}
                >
                  <Newspaper className="h-5 w-5" />
                  Blog
                </NavLink>

                <NavLink
                  to="/about"
                  className={({ isActive }) => getMobileNavClass(isActive)}
                  onClick={handleCloseMenu}
                >
                  <Info className="h-5 w-5" />
                  About
                </NavLink>

                <NavLink
                  to="/contact"
                  className={({ isActive }) => getMobileNavClass(isActive)}
                  onClick={handleCloseMenu}
                >
                  <Phone className="h-5 w-5" />
                  Contact
                </NavLink>

                {user?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className={() => getMobileNavClass(location.pathname.startsWith("/admin"))}
                    onClick={handleCloseMenu}
                  >
                    <Shield className="h-5 w-5" />
                    Admin
                  </NavLink>
                )}

                {user ? (
                  <>
                    <div className="my-4 border-t border-[#d8e6e1] pt-4">
                      <Link
                        to="/orders"
                        className={getMobileNavClass(location.pathname.startsWith("/orders"))}
                        onClick={handleCloseMenu}
                      >
                        <Package className="h-5 w-5" />
                        My Orders
                      </Link>
                      <Link
                        to="/profile"
                        className={getMobileNavClass(location.pathname === "/profile")}
                        onClick={handleCloseMenu}
                      >
                        <User className="h-5 w-5" />
                        My Profile
                      </Link>
                    </div>

                    <button
                      onClick={() => {
                        handleLogout();
                        handleCloseMenu();
                      }}
                      className="mt-2 flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 font-medium text-red-600 transition-all duration-200 hover:bg-red-50"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="mt-4 flex flex-col gap-2 px-1">
                    <Link to="/login" onClick={handleCloseMenu}>
                      <Button
                        variant="outline"
                        className="h-11 w-full justify-start gap-3 rounded-full border-[#0b7a71]/20 text-[#0b7a71] hover:bg-[#edf7f4]"
                      >
                        <LogIn className="h-5 w-5" />
                        Login
                      </Button>
                    </Link>
                    <Link to="/register" onClick={handleCloseMenu}>
                      <Button className="h-11 w-full justify-start gap-3 rounded-full bg-[#0b7a71] hover:bg-[#095f59]">
                        <UserPlus className="h-5 w-5" />
                        Register
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

