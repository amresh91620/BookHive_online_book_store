import React, { useState } from "react";
import { Plus, Edit, Trash2, Search, Book } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useBooks } from "../hooks/useBooks";

const ManageBooks = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { books, removeBook, loading } = useBooks();

  const handleDelete = (id) => {
    toast((t) => (
      <span className="flex flex-col gap-3">
        <b className="text-slate-900">Confirm Delete?</b>
        <p className="text-xs text-slate-500">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button 
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors" 
            onClick={async () => {
              toast.dismiss(t.id);
              await removeBook(id);
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
    ), { duration: 5000 });
  };

  const filteredBooks = books?.filter(b => 
    b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Book Inventory</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and monitor your digital library</p>
        </div>
        <Link
          to="/admin/add-book"
          className="flex items-center rounded-sm justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3  font-bold transition-all shadow-xl shadow-blue-100 active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          Add New Book
        </Link>
      </div>

      {/* Table Section */}
      <div className="bg-white  shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-300 flex items-center justify-between bg-white">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by title or author..."
              className="w-full pl-12 pr-4 py-3 bg-slate-200 border-none rounded-sm focus:ring-4 focus:ring-blue-100 outline-none transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-blue-600">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                <span className="text-xs font-bold uppercase tracking-widest">Syncing</span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 uppercase text-[11px] font-black tracking-widest border-b border-slate-300">
              <tr>
                <th className="px-8 py-5">Book Info</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Price</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 bg-slate-100  flex items-center justify-center text-slate-400 shadow-sm overflow-hidden group-hover:bg-white transition-colors">
                          {book.coverImage ? (
                            <img 
                                src={book.coverImage} 
                                alt={book.title} 
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Cover"; }}
                            />
                          ) : (
                            <Book size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-none mb-1">{book.title}</p>
                          <p className="text-xs text-slate-400 font-medium">{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-4 py-1.5 bg-blue-50 text-blue-600  text-xs font-black uppercase tracking-tight">
                        {book.categories || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-black text-slate-700">₹{book.price || 0}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* ✅ NAVIGATE TO EDIT PATH */}
                        <button 
                          onClick={() => navigate(`/admin/edit-book/${book._id}`)}
                          className="p-2.5 text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm active:scale-90"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(book._id)}
                          className="p-2.5 text-red-600 hover:bg-white rounded-xl transition-all shadow-sm active:scale-90"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                             <Book size={40} />
                        </div>
                        <p className="text-slate-400 font-medium">No books found in the inventory.</p>
                    </div>
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

export default ManageBooks;