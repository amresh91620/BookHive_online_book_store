import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ShoppingCart, 
  LogOut,
  Menu,
  X,
  Home,
  Star,
  Mail,
  FileText,
  MessageSquare,
  Settings,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAdminOrderNotifications } from "@/hooks/useAdminOrderNotifications";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Enable order notifications
  const { pendingOrdersCount } = useAdminOrderNotifications();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/books", icon: BookOpen, label: "Books" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/orders", icon: ShoppingCart, label: "Orders" },
    { path: "/admin/reviews", icon: Star, label: "Reviews" },
    { path: "/admin/messages", icon: Mail, label: "Messages" },
    { path: "/admin/blogs", icon: FileText, label: "Blogs" },
    { path: "/admin/comments", icon: MessageSquare, label: "Comments" },
    { path: "/admin/activity-logs", icon: Activity, label: "Activity Logs" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Top Header — glassmorphism */}
      <header className="admin-header sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-amber-50"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Link to="/admin" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-stone-900 tracking-tight">
                BookHive <span className="text-amber-600 font-extrabold">Admin</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline" size="sm" className="border-stone-200 hover:border-amber-400 hover:bg-amber-50 transition-all duration-200">
                <Home className="w-4 h-4 mr-2" />
                Visit Store
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2.5">
              <Avatar className="w-8 h-8 ring-2 ring-amber-200 ring-offset-1">
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-700 text-white font-semibold text-sm">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-stone-900 leading-tight">{user?.name}</p>
                <p className="text-xs text-stone-500 font-medium">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar — glassmorphism + accent bars */}
        <aside
          className={`
            fixed lg:sticky top-[57px] left-0 z-30 h-[calc(100vh-57px)]
            w-64 admin-sidebar border-r border-stone-200/80 transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <nav className="p-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const showBadge = item.path === "/admin/orders" && pendingOrdersCount > 0;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    admin-nav-link flex items-center gap-3 px-4 py-2.5 rounded-xl
                    ${
                      active
                        ? "active bg-gradient-to-r from-amber-50 to-amber-100/60 text-amber-800 font-semibold shadow-sm"
                        : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                    }
                  `}
                >
                  <div className={`p-1.5 rounded-lg transition-colors duration-200 ${
                    active 
                      ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-sm" 
                      : "bg-stone-100 text-stone-500 group-hover:bg-stone-200"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="flex-1 text-sm">{item.label}</span>
                  {showBadge && (
                    <Badge 
                      variant="destructive" 
                      className="ml-auto min-w-[20px] h-5 flex items-center justify-center px-1.5 text-xs font-bold animate-pulse"
                    >
                      {pendingOrdersCount}
                    </Badge>
                  )}
                </Link>
              );
            })}

            <Separator className="my-3" />

            <button
              onClick={handleLogout}
              className="admin-nav-link flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 w-full"
            >
              <div className="p-1.5 rounded-lg bg-red-50 text-red-500">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Logout</span>
            </button>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-57px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

