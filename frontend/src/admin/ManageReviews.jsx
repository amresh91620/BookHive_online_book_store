import React, { useEffect, useState } from 'react';
import { useReview } from '../hooks/useReview';
import { Trash2, MessageSquare, Star, User, Book as BookIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageReviews = () => {
  const { reviews, loading, fetchAllUsersReviews, deleteUserReviewByAdmin } = useReview();
  
  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAllUsersReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    toast((t) => (
      <span className="flex flex-col gap-3">
        <b className="text-white font-bold">Delete Review?</b>
        <p className="text-xs text-slate-500">This feedback will be permanently removed.</p>
        <div className="flex gap-2">
          <button 
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 transition-colors" 
            onClick={async () => {
              toast.dismiss(t.id);
              await deleteUserReviewByAdmin(reviewId);
            }}
          >
            Confirm
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

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil((reviews?.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = reviews?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Fetching Reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">User Reviews</h1>
        <p className="text-slate-500 text-sm font-medium">Monitor and moderate community feedback</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-20 text-center">
          <MessageSquare className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-400 font-medium">No reviews found in the system.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {currentReviews.map((review) => (
              <div key={review._id} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden group">
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* User & Book Meta */}
                    <div className="md:col-span-4 space-y-4 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                          <User size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reviewer</p>
                          <p className="font-bold text-slate-800 truncate">{review.user?.name || 'Deleted User'}</p>
                          <p className="text-xs text-slate-500 truncate">{review.user?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <BookIcon size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Book</p>
                          <p className="font-bold text-slate-800 truncate">{review.book?.title || 'Unknown Book'}</p>
                          <p className="text-xs text-slate-500">by {review.book?.author}</p>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="md:col-span-8 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                className={i < (review.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                              />
                            ))}
                            <span className="ml-2 text-xs font-black text-slate-400">({review.rating}/5)</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed italic">
                          "{review.comment || review.text || 'No written feedback provided.'}"
                        </p>
                      </div>

                      <div className="flex justify-end">
                        <button 
                          onClick={() => handleDelete(review._id)}
                          className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all"
                        >
                          <Trash2 size={16} />
                          Delete Review
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                Page {currentPage} of {totalPages} — Total {reviews.length} Reviews
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-2 border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 transition-all text-slate-600"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(idx + 1)}
                    className={`w-9 h-9 text-xs font-black rounded-lg transition-all ${
                      currentPage === idx + 1 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                        : "bg-white border hover:bg-slate-50 text-slate-500"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-2 border rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 transition-all text-slate-600"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageReviews;