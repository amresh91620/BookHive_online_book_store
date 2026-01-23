import { useState } from "react";
import AuthModal from "./AuthModal";
import { NavLink, Link } from "react-router-dom";
import { BookOpenCheck, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const activeClass = "text-blue-400 border-b-2 border-blue-400 pb-1 font-semibold";
  const normalClass = "text-gray-300 hover:text-white transition-all duration-300";

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
              <BookOpenCheck className="text-white" size={24} />
            </div>
            <span className="text-white text-2xl font-bold tracking-tight">
              Book<span className="text-blue-500">Hive</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="flex items-center gap-8 text-sm uppercase tracking-widest font-medium">
              <li>
                <NavLink to="/" end className={({ isActive }) => isActive ? activeClass : normalClass}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => isActive ? activeClass : normalClass}>
                  Contact
                </NavLink>
              </li>
            </ul>

            <div className="flex items-center gap-4 ml-4 border-l border-slate-700 pl-8">
              <button 
                onClick={() => openModal("login")}
                className="text-white hover:text-blue-400 transition font-medium"
              >
                Log in
              </button>
              <button 
                onClick={() => openModal("register")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-blue-900/20"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Mobile Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 animate-in fade-in slide-in-from-top-5">
            <ul className="flex flex-col p-6 gap-6 text-white text-base">
              <NavLink to="/" onClick={() => setIsOpen(false)} className={({isActive}) => isActive ? "text-blue-400" : ""}>Home</NavLink>
              <NavLink to="/about" onClick={() => setIsOpen(false)} className={({isActive}) => isActive ? "text-blue-400" : ""}>About</NavLink>
              <NavLink to="/contact" onClick={() => setIsOpen(false)} className={({isActive}) => isActive ? "text-blue-400" : ""}>Contact</NavLink>
              <hr className="border-slate-800" />
              <button onClick={() => { openModal("login"); setIsOpen(false); }} className="text-left text-blue-400 font-semibold">Log in</button>
              <button onClick={() => { openModal("register"); setIsOpen(false); }} className="bg-blue-600 text-center py-3 rounded-xl font-bold">Sign Up Free</button>
            </ul>
          </div>
        )}
      </header>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} type={modalType} setType={setModalType} />
    </>
  );
};

export default Navbar;