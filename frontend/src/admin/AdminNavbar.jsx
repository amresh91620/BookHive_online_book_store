import { Menu, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ADMIN_NAV_META } from "../config/adminNav";

const AdminNavbar = ({ toggleSidebar }) => {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-400 px-4 md:px-8 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu for Mobile */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden sm:block">
          <h2 className="text-slate-900 font-extrabold text-lg">{ADMIN_NAV_META.title}</h2>
          <p className="text-slate-500 text-[11px] uppercase tracking-wider font-bold">
            {ADMIN_NAV_META.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">        
        <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2.5 rounded-sm text-sm font-bold transition-all shadow-lg shadow-blue-100 active:scale-95"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
