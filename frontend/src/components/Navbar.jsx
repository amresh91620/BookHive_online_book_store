import { useState, useEffect, useRef } from "react";
import AuthModal from "./AuthModal";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  BookOpenCheck,
  Menu,
  MoreVertical,
  X,
  LogOut,
  ChevronDown,
  ShoppingCart,
  User,
  Package,
  Settings,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const { user, logout } = useAuth();
  // Logout Handler with Toast and Refresh
  const handleLogout = () => {
    logout(); // Context se logout call kiya
    toast.success("Logged out successfully!");

    // Page Refresh logic (thoda delay ke saath taaki toast dikh jaye)
    setTimeout(() => {
      window.location.href = "/"; // Ye page ko refresh karke home par bhej dega
    }, 1000);
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeClass =
    "text-blue-200 border-b-2 border-blue-200 pb-1 font-semibold";
  const normalClass =
    "text-slate-300 hover:text-white transition-all duration-300";
  const mobileActiveClass =
    "text-white bg-white/10 border border-white/10";
  const mobileNormalClass =
    "text-slate-200 hover:text-white hover:bg-white/5 border border-transparent";

  return (
    <>
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 backdrop-blur-md border-b border-slate-800">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors border border-white/10">
              <BookOpenCheck className="text-white" size={24} />
            </div>
            <span className="text-white text-2xl font-semibold tracking-wide font-serif">
              Book<span className="text-blue-200">Hive</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-semibold">
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    isActive ? activeClass : normalClass
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/books"
                  className={() =>
                    location.pathname.startsWith("/books") ||
                    location.pathname.startsWith("/book-rating")
                      ? activeClass
                      : normalClass
                  }
                >
                  Books
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? activeClass : normalClass
                  }
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    isActive ? activeClass : normalClass
                  }
                >
                  Contact
                </NavLink>
              </li>
            </ul>

            <div className="flex items-center gap-4 ml-4 border-l border-slate-800 pl-8">
              {user ? (
                <div className="flex items-center gap-3">
                  <div ref={profileRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors border border-white/10 rounded-full p-1.5 pr-2"
                    >
                      <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">
                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </div>
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-slate-50">
                          <p className="text-xs uppercase tracking-wider text-slate-500">
                            Signed in as
                          </p>
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {user.name || user.email}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                            <User size={18} />
                          </span>
                          <span className="flex-1">My Profile</span>
                        </Link>
                        <Link
                          to="/profile/my-orders"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                            <Package size={18} />
                          </span>
                          <span className="flex-1">My Orders</span>
                        </Link>
                        <Link
                          to="/profile/settings"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <span className="w-9 h-9 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center">
                            <Settings size={18} />
                          </span>
                          <span className="flex-1">Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                        >
                          <span className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                            <LogOut size={18} />
                          </span>
                          <span className="flex-1">Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <Link
                    to="/cart"
                    className="hidden lg:flex items-center gap-2 bg-white/10 text-white/90 border border-white/10 px-4 py-2 rounded-2xl text-xs uppercase tracking-wider hover:bg-white/20 transition-colors"
                  >
                    <ShoppingCart size={20} />
                  </Link>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openModal("login")}
                    className="text-white/90 hover:text-white transition font-semibold text-sm uppercase tracking-wider"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => openModal("register")}
                    className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all shadow-lg shadow-blue-900/20"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-3">
            {user && (
              <Link
                to="/cart"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/10 text-white/90 hover:bg-white/20 transition"
              >
                <ShoppingCart size={20} />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white"
            >
              {isOpen ? <X size={28} /> : <MoreVertical size={26} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-gradient-to-b from-slate-950 to-blue-950 border-t border-slate-800 px-6 py-4 max-h-[75vh]  overflow-y-auto">
            <ul className="flex flex-col gap-3 text-base pb-2">
              <NavLink
                to="/"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl transition ${
                    isActive ? mobileActiveClass : mobileNormalClass
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/books"
                onClick={() => setIsOpen(false)}
                className={() =>
                  `px-4 py-3 rounded-xl transition ${
                    location.pathname.startsWith("/books") ||
                    location.pathname.startsWith("/book-rating")
                      ? mobileActiveClass
                      : mobileNormalClass
                  }`
                }
              >
                Books
              </NavLink>
              <NavLink
                to="/about"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl transition ${
                    isActive ? mobileActiveClass : mobileNormalClass
                  }`
                }
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl transition ${
                    isActive ? mobileActiveClass : mobileNormalClass
                  }`
                }
              >
                Contact
              </NavLink>
              <hr className="border-slate-800" />
              {user ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-left"
                  >
                    <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">
                      {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-slate-300 truncate">
                        {user.email}
                      </p>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-white/80 transition-transform ${
                        isMobileProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isMobileProfileOpen && (
                    <div className="mt-2 space-y-2">
                      <NavLink
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `px-4 py-3 rounded-xl transition block ${
                            isActive ? mobileActiveClass : mobileNormalClass
                          }`
                        }
                      >
                        My Profile
                      </NavLink>
                      <NavLink
                        to="/profile/my-orders"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `px-4 py-3 rounded-xl transition block ${
                            isActive ? mobileActiveClass : mobileNormalClass
                          }`
                        }
                      >
                        My Orders
                      </NavLink>
                      <NavLink
                        to="/profile/settings"
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `px-4 py-3 rounded-xl transition block ${
                            isActive ? mobileActiveClass : mobileNormalClass
                          }`
                        }
                      >
                        Settings
                      </NavLink>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                        className="text-left text-red-300 font-semibold flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-red-500/10 transition w-full"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      openModal("login");
                      setIsOpen(false);
                    }}
                    className="text-left text-blue-300 font-semibold px-4 py-3 rounded-xl hover:bg-blue-500/10 transition"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      openModal("register");
                      setIsOpen(false);
                    }}
                    className="bg-blue-700 text-center py-3 rounded-2xl font-bold uppercase tracking-wider"
                  >
                    Sign Up Free
                  </button>
                </>
              )}
            </ul>
          </div>
        )}
      </header>

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
