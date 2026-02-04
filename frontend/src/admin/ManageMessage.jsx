import React, { useState, useEffect } from "react";
import {
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  MessageSquare, // Added for message icon
  Calendar,      // Added for date icon
} from "lucide-react";
import toast from "react-hot-toast";
import { useAdmin } from "../hooks/useAdmin";

const ITEMS_PER_PAGE = 8;

const ManageMessages = () => {
  const { fetchAllMessages, removeMessage, loading, messages } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!messages?.length) {
      fetchAllMessages();
    }
  }, [messages?.length, fetchAllMessages]);

  const handleDeleteMessage = (id) => {
    toast(
      (t) => (
        <span className="flex flex-col gap-3">
          <b className="text-white font-bold">Confirm Delete?</b>
          <p className="text-xs text-slate-500">
            This action cannot be undone and will remove the message permanently.
          </p>
          <div className="flex gap-2">
            <button
              className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors"
              onClick={async () => {
                toast.dismiss(t.id);
                  await removeMessage(id);

                }
              }
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

  // Format date helper
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMessages = messages?.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.message?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredMessages.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentMessages = filteredMessages.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Message Management
        </h1>
        <p className="text-slate-500 text-sm font-medium">
          View and manage incoming inquiries
        </p>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden rounded-sm">
        
        {/* Search Bar */}
        <div className="p-6 border-b border-slate-100 bg-white">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, email or message..."
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
              <p className="p-10 text-center text-blue-600 font-bold animate-pulse uppercase text-xs">
                Syncing Messages...
              </p>
            ) : currentMessages.length > 0 ? (
              currentMessages.map((msg) => (
                <div key={msg._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200">
                        <User size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{msg.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{msg.email}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteMessage(msg._id)} 
                      className="p-2 text-red-500 bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  {/* Message Content */}
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 leading-relaxed">{msg.message}</p>
                  </div>
                  
                  {/* Date */}
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Calendar size={10} />
                    {formatDate(msg.createdAt)}
                  </div>
                </div>
              ))
            ) : (
              <p className="p-10 text-center text-slate-400 font-medium italic">
                No messages found.
              </p>
            )}
          </div>

          {/* DESKTOP TABLE VIEW */}
          <table className="hidden md:table w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 uppercase text-[11px] font-black tracking-widest border-b border-slate-200">
              <tr>
                <th className="px-8 py-5">Sender Details</th>
                <th className="px-8 py-5">Message</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-8 py-10 text-center text-blue-600 animate-pulse font-bold uppercase text-xs tracking-widest">
                    Loading Messages...
                  </td>
                </tr>
              ) : currentMessages.length > 0 ? (
                currentMessages.map((msg) => (
                  <tr key={msg._id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-white transition-colors border border-slate-200">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-none mb-1">
                            {msg.name || "N/A"}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                            <Mail size={12} /> {msg.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 max-w-md">
                      <div className="flex items-start gap-2">
                        <MessageSquare size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                          {msg.message || "No message"}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
                        <Calendar size={12} className="text-slate-400" />
                        {formatDate(msg.createdAt)}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => handleDeleteMessage(msg._id)}
                        className="p-2.5 text-red-600 hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-90"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-medium italic">
                    No messages found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredMessages.length)} of {filteredMessages.length} Messages
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

export default ManageMessages;
