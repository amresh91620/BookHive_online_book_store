import React from "react";
import { 
  BookOpen, Users, Star, PlusCircle, 
  ChevronRight, Book, ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useBooks } from "../hooks/useBooks";
import { useAdmin } from "../hooks/useAdmin";

const AdminDashboard = () => {
  const { books, loading } = useBooks();
  const { statsData = {} } = useAdmin();

  // Changed from 5 to 3 to show only the top 3 recent books
  const recentBooks = books?.slice(0, 3) || [];

  const stats = [
    { 
      title: "Total Books", 
      value: statsData?.totalBooks || "0", 
      icon: <BookOpen />, 
      color: "bg-blue-600",
      description: "In your collection"
    },
    { 
      title: "Active Users", 
      // Use ?. to safely access the property
      value: statsData?.totalUsers || "0", 
      icon: <Users />, 
      color: "bg-indigo-600",
      description: "All users"
    },
    { 
      title: "Total Reviews", 
      // Use ?. to safely access the property
      value: statsData?.totalReviews || "0", 
      icon: <Star />, 
      color: "bg-amber-500",
      description: "Platform reviews"
    },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's your library at a glance</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-white p-6  border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${item.color} p-3 rounded-lg text-white`}>
                {React.cloneElement(item.icon, { size: 22 })}
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{item.title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{item.value}</p>
            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Table Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <h2 className="font-bold text-slate-800">Top Recent Books</h2>
            {loading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                <span className="text-xs font-bold uppercase tracking-widest">Syncing</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 uppercase text-[11px] font-black tracking-widest border-b border-slate-200">
                <tr>
                  <th className="px-8 py-5">Book Info</th>
                  <th className="px-8 py-5">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBooks.length > 0 ? (
                  recentBooks.map((book) => (
                    <tr key={book._id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-14 bg-slate-100 flex items-center justify-center text-slate-400 rounded shadow-sm overflow-hidden group-hover:bg-white transition-colors">
                            {book.coverImage ? (
                              <img 
                                src={book.coverImage} 
                                alt={book.title} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Book size={18} />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-none mb-1 line-clamp-1">{book.title}</p>
                            <p className="text-xs text-slate-400 font-medium">{book.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-tight rounded-full">
                          {book.categories || "General"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : !loading && (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-slate-400">
                      No books found in the inventory.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* VIEW ALL BUTTON FOOTER */}
          <div className="p-4 bg-slate-50/50 border-t border-slate-100">
            <Link 
              to="/admin/books" 
              className="flex items-center justify-center gap-2 w-full py-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all rounded-lg"
            >
              View All Books <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">         
          <div className="bg-white p-6  border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/admin/add-book" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <PlusCircle size={18} />
                  </div>
                  <span className="font-medium text-gray-700">Add New Book</span>
                </div>
                <ChevronRight className="text-gray-400" size={18} />
              </Link>
              
              <Link to="/admin/users" className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Users size={18} />
                  </div>
                  <span className="font-medium text-gray-700">Manage Users</span>
                </div>
                <ChevronRight className="text-gray-400" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;