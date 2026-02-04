import React, { useEffect, useState } from "react";
import { 
  BookOpen, Users, Star, PlusCircle, 
  ChevronRight, Book, ArrowRight, ArrowLeft, Trash2, Shield
} from "lucide-react";
import { Link } from "react-router-dom";
import { useBooks } from "../hooks/useBooks";
import { useAdmin } from "../hooks/useAdmin";

const AdminDashboard = () => {
  const { books, loading } = useBooks();
  const { statsData = {}, allUsers = [], deleteUser, updateUserRole, fetchUsers, fetchDashboardStats } = useAdmin();
  
  // State to switch between "Books" and "Users" view in the main table
  const [activeView, setActiveView] = useState("recent-books");

  const recentBooks = books?.slice(0, 3) || [];

  useEffect(() => {
    if (!allUsers?.length) {
      fetchUsers();
    }
    if (!statsData?.totalBooks && !statsData?.totalUsers && !statsData?.totalReviews) {
      fetchDashboardStats();
    }
  }, [allUsers?.length, statsData, fetchUsers, fetchDashboardStats]);

  const stats = [
    { title: "Total Books", value: statsData?.totalBooks || "0", icon: <BookOpen />, color: "bg-blue-600", description: "In your collection" },
    { title: "Active Users", value: statsData?.totalUsers || "0", icon: <Users />, color: "bg-indigo-600", description: "All users" },
    { title: "Total Reviews", value: statsData?.totalReviews || "0", icon: <Star />, color: "bg-amber-500", description: "Platform reviews" },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8 bg-slate-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {activeView === "manage-users" ? "User Management" : "Dashboard Overview"}
          </h1>
          <p className="text-gray-500 mt-1">
            {activeView === "manage-users" ? "Control access and user roles" : "Welcome back! Here's your library at a glance"}
          </p>
        </div>
        {activeView === "manage-users" && (
          <button 
            onClick={() => setActiveView("recent-books")}
            className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-white border px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50 transition-all"
          >
            <ArrowLeft size={16} /> Back to Stats
          </button>
        )}
      </div>

      {/* Stats Grid (Only visible in main view) */}
      {activeView === "recent-books" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          {stats.map((item, idx) => (
            <div key={idx} className="bg-white p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
              <div className={`${item.color} w-fit p-3 rounded-lg text-white shadow-sm mb-4`}>
                {React.cloneElement(item.icon, { size: 22 })}
              </div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{item.title}</h3>
              <p className="text-3xl font-bold text-gray-900 mt-1">{item.value}</p>
              <p className="text-sm text-gray-400 mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Dynamic Table Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden animate-in fade-in duration-700">
          
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <h2 className="font-bold text-slate-800">
              {activeView === "manage-users" ? "All Platform Users" : "Recent Books Added"}
            </h2>
            {loading && <div className="animate-pulse text-xs font-black text-blue-600 uppercase">Syncing...</div>}
          </div>

          <div className="flex-1">
            {activeView === "recent-books" ? (
              /* --- BOOKS VIEW --- */
              <>
                {/* Mobile Books */}
                <div className="md:hidden divide-y divide-slate-100">
                  {recentBooks.map((book) => (
                    <div key={book._id} className="p-4 flex items-center gap-4">
                      <div className="w-12 h-16 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                        <img src={book.coverImage} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 text-sm truncate">{book.title}</p>
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-black uppercase">{book.categories}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Desktop Books Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-slate-400 uppercase text-[11px] font-black tracking-widest border-b border-slate-200">
                      <tr><th className="px-8 py-5">Book Info</th><th className="px-8 py-5">Category</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentBooks.map((book) => (
                        <tr key={book._id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-14 bg-slate-100 rounded shadow-sm overflow-hidden"><img src={book.coverImage} className="w-full h-full object-cover" alt="" /></div>
                              <div><p className="font-bold text-slate-800 line-clamp-1">{book.title}</p><p className="text-xs text-slate-400">{book.author}</p></div>
                            </div>
                          </td>
                          <td className="px-8 py-5"><span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-full">{book.categories}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              /* --- USERS VIEW --- */
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-slate-400 uppercase text-[11px] font-black tracking-widest border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-5">User</th>
                      <th className="px-6 py-5">Role</th>
                      <th className="px-6 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold uppercase">{u.name?.charAt(0)}</div>
                            <div><p className="font-bold text-slate-800 text-sm">{u.name}</p><p className="text-xs text-slate-400">{u.email}</p></div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <button 
                            onClick={() => updateUserRole(u._id, u.role === 'admin' ? 'user' : 'admin')}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tight transition-all border ${u.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}
                          >
                            <Shield size={12} /> {u.role}
                          </button>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => window.confirm("Delete this user?") && deleteUser(u._id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-50/50 border-t border-slate-100">
            {activeView === "recent-books" ? (
              <Link to="/admin/books" className="flex items-center justify-center gap-2 w-full py-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all rounded-lg">
                View All Books <ArrowRight size={16} />
              </Link>
            ) : (
              <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-widest">End of user list</p>
            )}
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 border border-gray-200 shadow-sm rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Shortcuts</h3>
            <div className="space-y-3">
              <Link to="/admin/add-book" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors"><PlusCircle size={18} /></div>
                  <span className="font-medium text-gray-700">Add New Book</span>
                </div>
                <ChevronRight className="text-gray-400" size={18} />
              </Link>
              
              <button 
                onClick={() => setActiveView("manage-users")}
                className={`flex items-center justify-between w-full p-3 rounded-lg transition-all group ${activeView === 'manage-users' ? 'bg-indigo-600 text-white' : 'bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${activeView === 'manage-users' ? 'bg-indigo-500' : 'bg-indigo-100 group-hover:bg-indigo-600 group-hover:text-white'}`}><Users size={18} /></div>
                  <span className={`font-medium ${activeView === 'manage-users' ? 'text-white' : 'text-gray-700'}`}>Manage Users</span>
                </div>
                <ChevronRight className={activeView === 'manage-users' ? 'text-white' : 'text-gray-400'} size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
