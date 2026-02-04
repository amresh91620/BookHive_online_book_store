import React, { useEffect, useState } from "react";
import { Trash2, User, ShieldCheck, Mail, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const { users, loading, removeUser, fetchUsers } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");

  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!users?.length) {
      fetchUsers();
    }
  }, [users?.length, fetchUsers]);

  const handleDeleteUser = (id) => {
    toast(
      (t) => (
        <span className="flex flex-col gap-3">
          <b className="text-white font-bold">Confirm Delete?</b>
          <p className="text-xs text-slate-500">
            This action cannot be undone and will remove the user permanently.
          </p>
          <div className="flex gap-2">
            <button
              className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
              onClick={async () => {
                toast.dismiss(t.id);
                await removeUser(id);
              }}
            >
              Yes, Delete
            </button>
            <button
              className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </span>
      ),
      { duration: 5000 }
    );
  };

  // Filter users based on search
  const filteredUsers = users?.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Manage permissions and view registered members
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden rounded-sm">
        
        {/* Search Bar */}
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {/* MOBILE LIST VIEW */}
          <div className="md:hidden divide-y divide-slate-100">
            {loading ? (
                <p className="p-10 text-center text-blue-600 font-bold animate-pulse uppercase text-xs">Syncing Users...</p>
            ) : currentUsers.map((user) => (
                <div key={user._id} className="p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200">
                           <User size={20} />
                        </div>
                        <div className="min-w-0">
                           <p className="font-bold text-slate-800 text-sm truncate">{user.name}</p>
                           <p className="text-[10px] text-slate-400 truncate mb-1">{user.email}</p>
                           <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded ${user.role === 'admin' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                             {user.role}
                           </span>
                        </div>
                    </div>
                    <button onClick={() => handleDeleteUser(user._id)} className="p-2 text-red-500 bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <table className="hidden md:table w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 uppercase text-[11px] font-black tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-8 py-5">User Details</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="3" className="px-8 py-10 text-center text-blue-600 animate-pulse font-bold uppercase text-xs tracking-widest">
                    Loading Users...
                  </td>
                </tr>
              ) : currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-white transition-colors border border-slate-200">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-none mb-1">{user.name || "N/A"}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                            <Mail size={12} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-tight flex items-center gap-1 w-fit rounded-full border ${
                          user.role === "admin" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-blue-50 text-blue-600 border-blue-100"
                        }`}>
                        {user.role === "admin" && <ShieldCheck size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2.5 text-red-600 hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-8 py-20 text-center text-slate-400 font-medium italic">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION CONTROLS --- */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} Members
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                <ChevronLeft size={18} className="text-slate-600" />
              </button>
              
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`w-9 h-9 text-xs font-bold rounded-lg transition-all ${
                    currentPage === idx + 1 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                      : "bg-white border hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                <ChevronRight size={18} className="text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
