import { Link } from "react-router-dom";
import { User, Settings, Pencil, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 px-8 py-10 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg uppercase">
              {(user?.name?.charAt(0) || user?.email?.charAt(0) || "U")}
            </div>
            <div>
              <h1 className="text-2xl font-semibold font-serif">Profile</h1>
              <p className="text-white/70 text-sm">{user?.email || "guest@bookhive.com"}</p>
            </div>
          </div>
        </div>

        <div className="p-8 grid gap-4 sm:grid-cols-2">
          <Link to="/profile/update" className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Pencil size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Update Profile</div>
              <div className="text-xs text-slate-500">Edit name, email, password</div>
            </div>
          </Link>

          <Link to="/profile/settings" className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Settings size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Settings</div>
              <div className="text-xs text-slate-500">Preferences and privacy</div>
            </div>
          </Link>

          <div className="flex items-center gap-3 rounded-2xl border border-red-200 p-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <LogOut size={18} />
            </div>
            <button onClick={logout} className="text-sm font-semibold text-red-600">Logout</button>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">{user?.name || "Guest User"}</div>
              <div className="text-xs text-slate-500">Account overview</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
