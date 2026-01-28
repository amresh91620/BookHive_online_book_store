import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Send, ArrowLeft, Loader2, Trash2, Edit3, Calendar, BookOpen, Tag, DollarSign } from "lucide-react";
import { useBooks } from "../hooks/useBooks";
import { useAuth } from "../hooks/useAuth";
import { useReview } from "../hooks/useReview";
import AuthModal from "../components/AuthModal";
import toast from "react-hot-toast";

const BookRatingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books } = useBooks();
  const { user } = useAuth();
  const { addNewReview, fetchReviews, reviews, removeReview, editReview, loading: reviewLoading } = useReview();

  const book = books.find((b) => b._id === id);

  const [isReviewing, setIsReviewing] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState("login");

  useEffect(() => { if (id) fetchReviews(id); }, [id]);

  const { avgRating, ratingDistribution, totalRatings } = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (reviews.length === 0) return { avgRating: "0.0", ratingDistribution: distribution, totalRatings: 0 };
    let total = 0;
    reviews.forEach(r => { distribution[r.rating]++; total += r.rating; });
    return { avgRating: (total / reviews.length).toFixed(1), ratingDistribution: distribution, totalRatings: reviews.length };
  }, [reviews]);

  const handleSubmit = async () => {
    if (userRating === 0 || !userComment.trim()) return toast.error("Rating and comment required!");
    const success = await addNewReview({ bookId: id, rating: userRating, comment: userComment });
    if (success) { setIsReviewing(false); setUserRating(0); setUserComment(""); }
  };

  const handleUpdate = async (reviewId) => {
    const success = await editReview(reviewId, id, { rating: editRating, comment: editContent });
    if (success) setEditingId(null);
  };

  const isOwner = (rev) => {
    const rId = (rev.user?._id || rev.user?.id || rev.user)?.toString();
    const uId = (user?._id || user?.id)?.toString();
    return rId === uId;
  };

  if (!book) return <div className="p-20 text-center text-gray-400">Loading Book Details...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans bg-white min-h-screen">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} type={authType} setType={setAuthType} />

      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-black mb-8 border-none bg-transparent cursor-pointer font-medium transition-colors">
        <ArrowLeft size={18} /> Back to Library
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT & CENTER: Book Info & Reviews (8 Columns) */}
        <div className="lg:col-span-8">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <img src={book.coverImage} className="w-48 h-64 object-cover rounded-lg shadow-md border" alt={book.title} />
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
              <p className="text-xl text-gray-500 mb-4 italic">by {book.author}</p>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl font-black text-gray-900">{avgRating}</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} fill={i < Math.round(avgRating) ? "currentColor" : "none"} />)}
                </div>
                <span className="text-gray-400 text-sm">({totalRatings} reviews)</span>
              </div>
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Description</h3>
              <p className="text-gray-600 leading-relaxed max-w-xl">{book.description}</p>
            </div>
          </div>

          {/* Write Review Section */}
          <div className="mb-12">
            {!isReviewing ? (
              <button onClick={() => user ? setIsReviewing(true) : setIsAuthModalOpen(true)} className="px-8 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all">
                Write a Review
              </button>
            ) : (
              <div className="p-6 border rounded-xl bg-gray-50">
                <h3 className="font-bold mb-4">Your Rating</h3>
                <div className="flex gap-2 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={28} className={`cursor-pointer ${userRating >= s ? 'text-amber-400' : 'text-gray-300'}`} fill={userRating >= s ? "currentColor" : "none"} onClick={() => setUserRating(s)} />
                  ))}
                </div>
                <textarea className="w-full p-4 border rounded-lg outline-none mb-4 bg-white" placeholder="What did you think?" rows="3" value={userComment} onChange={(e) => setUserComment(e.target.value)} />
                <div className="flex gap-4">
                  <button onClick={handleSubmit} disabled={reviewLoading} className="bg-black text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                    {reviewLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />} Post
                  </button>
                  <button onClick={() => setIsReviewing(false)} className="text-gray-500">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold border-b pb-4">Customer Feedback</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-400 italic">No reviews yet.</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="group border-b border-gray-100 pb-8 last:border-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">{rev.user?.name?.charAt(0).toUpperCase()}</div>
                      <div>
                        <p className="font-bold text-sm">{rev.user?.name || "Anonymous"}</p>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} />)}
                        </div>
                      </div>
                    </div>
                    {isOwner(rev) && (
                      <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingId(rev._id); setEditContent(rev.comment); setEditRating(rev.rating); }} className="text-gray-400 hover:text-blue-600"><Edit3 size={16}/></button>
                        <button onClick={() => window.confirm("Delete?") && removeReview(rev._id, id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                      </div>
                    )}
                  </div>
                  {editingId === rev._id ? (
                    <div className="mt-2 p-4 bg-blue-50 rounded-lg">
                      <div className="flex gap-1 mb-3">
                        {[1,2,3,4,5].map(s => <Star key={s} size={18} className={`cursor-pointer ${editRating >= s ? 'text-amber-400' : 'text-gray-300'}`} fill={editRating >= s ? "currentColor" : "none"} onClick={() => setEditRating(s)} />)}
                      </div>
                      <textarea className="w-full p-2 border rounded bg-white text-sm" value={editContent} onChange={e => setEditContent(e.target.value)} />
                      <div className="flex gap-2 mt-2"><button onClick={() => handleUpdate(rev._id)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">Save</button><button onClick={() => setEditingId(null)} className="text-gray-400 text-xs">Cancel</button></div>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm leading-relaxed">{rev.comment}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR: Stats & Details (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 1. Rating Distribution Card */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-sm font-bold uppercase text-gray-400 mb-6 tracking-widest">Rating Stats</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-4 text-sm">
                  <span className="w-12 text-gray-500 font-medium">{star} Star</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full" 
                      style={{ width: `${totalRatings ? (ratingDistribution[star] / totalRatings) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-gray-400 text-xs">
                    {totalRatings ? Math.round((ratingDistribution[star] / totalRatings) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Technical Details Card */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-sm font-bold uppercase text-gray-400 mb-6 tracking-widest">Specifications</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm"><DollarSign size={18} className="text-green-600" /></div>
                <div><p className="text-[10px] uppercase font-bold text-gray-400">Price</p><p className="font-bold text-gray-900">₹{book.price}</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm"><BookOpen size={18} className="text-blue-500" /></div>
                <div><p className="text-[10px] uppercase font-bold text-gray-400">Length</p><p className="font-bold text-gray-900">{book.pages} Pages</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm"><Tag size={18} className="text-purple-500" /></div>
                <div><p className="text-[10px] uppercase font-bold text-gray-400">Category</p><p className="font-bold text-gray-900 capitalize">{book.categories}</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm"><Calendar size={18} className="text-orange-500" /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">Published Date</p>
                  <p className="font-bold text-gray-900">{new Date(book.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BookRatingPage;