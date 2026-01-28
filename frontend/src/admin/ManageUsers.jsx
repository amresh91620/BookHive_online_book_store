import React, { useEffect } from "react";
import { Trash2, User, ShieldCheck, Mail } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const { users, loading, removeUser,fetchUsers } = useAdmin();
   useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = (id) => {
    toast(
      (t) => (
        <span className="flex flex-col gap-3">
          <b className="text-white">Confirm Delete?</b>
          <p className="text-xs text-slate-500">
            This action cannot be undone.
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
      { duration: 5000 },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          User Management
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          Manage permissions and view registered members
        </p>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 uppercase text-[11px] font-black tracking-widest border-b border-slate-50">
              <tr>
                <th className="px-8 py-5">User Details</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-8 py-10 text-center text-blue-600 animate-pulse font-bold"
                  >
                    Loading Users...
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors border border-slate-100">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-none mb-1">
                            {user.name || "N/A"}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                            <Mail size={12} /> {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-tight flex items-center gap-1 w-fit ${
                          user.role === "admin"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {user.role === "admin" && <ShieldCheck size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-sm active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-8 py-20 text-center text-slate-400 font-medium"
                  >
                    No users found in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
