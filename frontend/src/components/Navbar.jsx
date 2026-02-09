import { useState } from "react";
import AuthModal from "./AuthModal";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpenCheck,
  MoreVertical,
  X,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");

  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const activeClass =
    "text-blue-200 border-b-2 border-blue-200 pb-1 font-semibold";
  const normalClass =
    "text-slate-300 hover:text-white transition-all duration-300";
  const mobileActiveClass = "text-white bg-white/10 border border-white/10";
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
                  <Link
                    to="/cart"
                    className="hidden lg:flex items-center gap-2 bg-white/10 text-white/90 border border-white/10 px-4 py-2 rounded-2xl text-xs uppercase tracking-wider hover:bg-white/20 transition-colors"
                  >
                    <ShoppingCart size={20} />
                  </Link>
                  <Link
                    to="/user/profile"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors border border-white/10 rounded-full p-1.5 pr-2"
                  >
                    <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">
                      {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </div>
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
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X size={28} /> : <MoreVertical size={26} />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-gradient-to-b from-slate-950 to-blue-950 border-t border-slate-800 px-6 py-4 max-h-[75vh] overflow-y-auto">
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
                  <NavLink
                    to="/user/profile"
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl transition block ${
                        isActive ? mobileActiveClass : mobileNormalClass
                      }`
                    }
                  >
                    My Profile
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