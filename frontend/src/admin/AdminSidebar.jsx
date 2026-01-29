import React from "react";
import { NavLink, useLocation } from "react-router-dom"; // useLocation add kiya
import { LayoutDashboard, BookText, Users, MessageSquare, BookOpenCheck, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation(); 

  const links = [
    { 
      name: "Dashboard", 
      path: "/admin", 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      name: "Manage Books", 
      path: "/admin/books", 
      subPaths: ["/admin/books", "/admin/add-book", "/admin/edit-book"], 
      icon: <BookText size={20} /> 
    },
    { 
      name: "Manage Users", 
      path: "/admin/users", 
      icon: <Users size={20} /> 
    },
    { 
      name: "Manage Reviews", 
      path: "/admin/reviews", 
      icon: <MessageSquare size={20} /> 
    },
  ];

  const activeLink = "flex items-center gap-3 bg-blue-500 text-white py-3.5 px-6 mx-3 transition-all duration-300 font-bold shadow-lg shadow-blue-200";
  const normalLink = "flex items-center gap-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 py-3.5 px-6 mx-3 transition-all duration-300 font-medium";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      <aside className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-400 z-[70] flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Brand Logo */}
        <div className="p-4 flex items-center justify-between border-b border-slate-400">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-100">
              <BookOpenCheck size={21} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">BookHive</h1>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-xl">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 mt-4">
          {links.map((link) => {
            // Check if current path belongs to this section
            const isActive = link.subPaths 
              ? link.subPaths.some(p => location.pathname.startsWith(p))
              : location.pathname === link.path;

            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={isActive ? activeLink : normalLink}
              >
                {link.icon}
                <span className="text-[15px]">{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Card at Bottom */}
        <div className="mt-auto p-6">
          <div className="bg-slate-30 p-4  border border-slate-300 flex items-center gap-3">
            {/* Dynamic Initial */}
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">
                {user?.name || "Admin User"}
              </p>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">
                {user?.role || "Administrator"}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;