import { useState } from "react";
import AuthModal from "./AuthModal";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  User,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Heart,
  Settings,
  MoreVertical,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import toast from "react-hot-toast";
import { BRAND, NAV_ITEMS, TOP_BAR } from "../config/site";

const Navbar = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);

  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
    setUserDropdownOpen(false);
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-[10px] sm:text-sm">{TOP_BAR.promo}</span>
                <span className="hidden md:inline">|</span>
                <span className="hidden md:inline">
                  {TOP_BAR.rating}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-sm">
                {user ? (
                  <span className="truncate max-w-[120px] sm:max-w-none">Welcome back, {user.name?.split(" ")[0]}!</span>
                ) : (
                  <>
                    <button
                      onClick={() => openModal("login")}
                      className="hover:text-blue-100 transition hidden sm:inline"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => openModal("register")}
                      className="hover:text-blue-100 transition hidden sm:inline"
                    >
                      Create Account
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 sm:p-2.5 rounded-xl group-hover:rotate-12 transition-transform">
                <BookOpen className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {BRAND.wordmark.leading}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                    {BRAND.wordmark.accent}
                  </span>
                </span>
                <span className="text-[8px] sm:text-[10px] text-slate-500 -mt-1 tracking-wider">
                  {BRAND.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center flex-1 max-w-2xl mx-8">
              <div className="flex items-center flex-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `px-4 py-2 font-medium transition-all text-sm ${
                        isActive
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Cart */}
              <Link
                to={user ? "/cart" : "#"}
                onClick={(e) => {
                  if (!user) {
                    e.preventDefault();
                    openModal("login");
                  }
                }}
                className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors group"
              >
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700 group-hover:text-blue-600 transition-colors" />

                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                      {user.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0).toUpperCase() ||
                        user.email?.charAt(0).toUpperCase()
                      )}
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="font-semibold text-slate-900 text-sm sm:text-base">
                          {user.name}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <Link
                        to="/user/profile"
                        className="flex items-center gap-3 px-4 py-2.5 sm:py-3 hover:bg-slate-50 transition-colors text-sm"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/user/wishlist"
                        className="flex items-center gap-3 px-4 py-2.5 sm:py-3 hover:bg-slate-50 transition-colors text-sm"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                        <span>Wishlist</span>
                      </Link>

                      <Link
                        to="/user/orders"
                        className="flex items-center gap-3 px-4 py-2.5 sm:py-3 hover:bg-slate-50 transition-colors text-sm"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="/user/settings"
                        className="flex items-center gap-3 px-4 py-2.5 sm:py-3 hover:bg-slate-50 transition-colors text-sm"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                        <span>Settings</span>
                      </Link>

                      <div className="border-t border-slate-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 sm:py-3 w-full text-left hover:bg-red-50 text-red-600 transition-colors text-sm"
                        >
                          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openModal("login")}
                    className="hidden md:inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 text-slate-700 font-semibold hover:text-blue-600 transition-colors text-sm"
                  >
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    Sign In
                  </button>
                  <button
                    onClick={() => openModal("register")}
                    className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md text-sm"
                  >
                    Get Started
                  </button>
                </>
              )}

              {/* Three Dot Menu Button - Mobile Only */}
              <div className="relative lg:hidden">
                <button
                  onClick={() => setMenuDropdownOpen(!menuDropdownOpen)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
                </button>

                {menuDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                    {NAV_ITEMS.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMenuDropdownOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center px-4 py-2.5 sm:py-3 transition-colors text-sm ${
                            isActive
                              ? "bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600"
                              : "text-slate-700 hover:bg-slate-50"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                    
                    {!user && (
                      <>
                        <div className="border-t border-slate-100 my-2"></div>
                        <button
                          onClick={() => {
                            openModal("login");
                            setMenuDropdownOpen(false);
                          }}
                          className="flex items-center gap-2 px-4 py-2.5 sm:py-3 w-full text-left text-slate-700 hover:bg-slate-50 transition-colors text-sm md:hidden"
                        >
                          <User className="w-4 h-4" />
                          Sign In
                        </button>
                        <button
                          onClick={() => {
                            openModal("register");
                            setMenuDropdownOpen(false);
                          }}
                          className="flex items-center justify-center px-4 py-2.5 sm:py-3 w-[calc(100%-1rem)] mx-2 text-center bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold mt-2 text-sm md:hidden"
                        >
                          Create Account
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-[88px] sm:h-[96px]"></div>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={modalType}
        setType={setModalType}
      />
    </>
  );
};

export default Navbar;
