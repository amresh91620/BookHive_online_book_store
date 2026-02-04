import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  const { addNewReview, fetchReviewsPage, removeReview, editReview, loading: reviewLoading } = useReview();

  const book = books.find((b) => b._id === id);

  const [isReviewing, setIsReviewing] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState("login");
  const [reviews, setReviews] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [stats, setStats] = useState({
    avgRating: "0.0",
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    totalRatings: 0,
  });

  const loadFirstPage = async () => {
    if (!id) return;
    setPageLoading(true);
    try {
      const res = await fetchReviewsPage(id, { limit: 5 });
      setReviews(res?.reviews || []);
      setNextCursor(res?.nextCursor || null);
      setHasMore(Boolean(res?.hasMore));
      setStats({
        avgRating: res?.avgRating || "0.0",
        ratingDistribution: res?.ratingDistribution || {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
        totalRatings: res?.totalRatings || 0,
      });
    } catch (error) {
      setReviews([]);
      setNextCursor(null);
      setHasMore(false);
      setStats({
        avgRating: "0.0",
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        totalRatings: 0,
      });
    } finally {
      setPageLoading(false);
    }
  };

  const loadMore = async () => {
    if (!id || !hasMore || pageLoading) return;
    setPageLoading(true);
    try {
      const res = await fetchReviewsPage(id, {
        cursor: nextCursor,
        limit: 5,
      });
      setReviews((prev) => [...prev, ...(res?.reviews || [])]);
      setNextCursor(res?.nextCursor || null);
      setHasMore(Boolean(res?.hasMore));
    } catch (error) {
      // no-op
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadFirstPage();
  }, [id, fetchReviewsPage]);

  const { avgRating, ratingDistribution, totalRatings } = useMemo(() => {
    return {
      avgRating: stats.avgRating,
      ratingDistribution: stats.ratingDistribution,
      totalRatings: stats.totalRatings,
    };
  }, [stats]);

  const handleSubmit = async () => {
    if (!user) {
      setIsAuthModalOpen(true);
      setAuthType("login");
      return;
    }
    if (userRating === 0 || !userComment.trim()) return toast.error("Rating and comment required!");
    const result = await addNewReview({ bookId: id, rating: userRating, comment: userComment });
    if (result?.ok) {
      setIsReviewing(false);
      setUserRating(0);
      setUserComment("");
      await loadFirstPage();
    } else if (result?.errorMsg?.toLowerCase().includes("already reviewed")) {
      await loadFirstPage();
      const myReview = reviews.find((r) => {
        const rId = (r.user?._id || r.user?.id || r.user)?.toString();
        const uId = (user?._id || user?.id)?.toString();
        return rId === uId;
      });
      if (myReview) {
        setEditingId(myReview._id);
        setEditContent(myReview.comment);
        setEditRating(myReview.rating);
        setIsReviewing(false);
      }
    }
  };

  const handleUpdate = async (reviewId) => {
    const success = await editReview(reviewId, id, { rating: editRating, comment: editContent });
    if (success) {
      setEditingId(null);
      await loadFirstPage();
    }
  };

  const isOwner = (rev) => {
    const rId = (rev.user?._id || rev.user?.id || rev.user)?.toString();
    const uId = (user?._id || user?.id)?.toString();
    return rId === uId;
  };

  if (!book) return <div className="p-20 text-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 bg-white min-h-screen">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} type={authType} setType={setAuthType} />

      <div className="flex items-center justify-between gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black border-none bg-transparent cursor-pointer font-medium transition-colors">
          <ArrowLeft size={18} /> Back to Home
        </button>
      </div>

      {/* 1. BOOK MAIN DETAILS */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <img src={book.coverImage} className="w-48 h-64 object-cover shadow-xl border  mx-auto md:mx-0" alt={book.title} />
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{book.title}</h1>
          <p className="text-xl text-gray-500 mb-6 italic">by {book.author}</p>
          <div className="flex items-center justify-center md:justify-start gap-4 mb-6 bg-gray-50 w-fit px-4 py-2 rounded-full mx-auto md:mx-0">
            <span className="text-3xl font-black text-gray-900">{avgRating}</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} fill={i < Math.round(avgRating) ? "currentColor" : "none"} />)}
            </div>
            <span className="text-gray-400 text-sm font-medium">({totalRatings} reviews)</span>
          </div>
          <h3 className="text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Description</h3>
          <p className="text-gray-600 leading-relaxed max-w-3xl">{book.description}</p> 
        </div>
        <div>
                  <Link
          to="/cart"
          className="inline-flex items-center justify-center bg-amber-300 text-gray-900 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-amber-200 transition"
        >
          Buy Now
        </Link>
        </div>
      </div>

      {/* 2. STATS & SPECS (The "One Line" Responsive Row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {/* Specifications */}
        <div className="bg-gray-50 p-6 border border-gray-200 rounded-sm">
          <h3 className="text-xs font-bold uppercase text-gray-500 mb-6 tracking-widest">Specifications</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm"><DollarSign size={18} className="text-green-600" /></div>
              <div><p className="text-[10px] uppercase font-bold text-gray-400">Price</p><p className="font-bold text-gray-900">₹{book.price}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm"><BookOpen size={18} className="text-blue-500" /></div>
              <div><p className="text-[10px] uppercase font-bold text-gray-400">Pages</p><p className="font-bold text-gray-900">{book.pages}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm"><Tag size={18} className="text-purple-500" /></div>
              <div><p className="text-[10px] uppercase font-bold text-gray-400">Category</p><p className="font-bold text-gray-900 capitalize">{book.categories}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm"><Calendar size={18} className="text-orange-500" /></div>
              <div><p className="text-[10px] uppercase font-bold text-gray-400">Published</p><p className="font-bold text-gray-900">{new Date(book.publishedDate).getFullYear()}</p></div>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-gray-50 p-6 border border-gray-200 rounded-sm">
          <h3 className="text-xs font-bold uppercase text-gray-500 mb-6 tracking-widest">Rating Stats</h3>
          <div className="space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-4 text-xs">
                <span className="w-10 text-gray-500 font-bold">{star} Star</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${totalRatings ? (ratingDistribution[star] / totalRatings) * 100 : 0}%` }} />
                </div>
                <span className="w-8 text-right text-gray-400">{totalRatings ? Math.round((ratingDistribution[star] / totalRatings) * 100) : 0}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr className="mb-12 border-gray-100" />

      {/* 3. REVIEWS SECTION */}
      <div className="max-w-4xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Customer Feedback</h2>
          {!isReviewing && (
            <button onClick={() => user ? setIsReviewing(true) : setIsAuthModalOpen(true)} className="px-6 py-2.5 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all text-sm">
              Write a Review
            </button>
          )}
        </div>

        {isReviewing && (
          <div className="mb-12 p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
            <h3 className="font-bold mb-4">Share your experience</h3>
            <div className="flex gap-2 mb-6">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={32} className={`cursor-pointer transition-transform active:scale-90 ${userRating >= s ? 'text-amber-400' : 'text-gray-200'}`} fill={userRating >= s ? "currentColor" : "none"} onClick={() => setUserRating(s)} />
              ))}
            </div>
            <textarea className="w-full p-4 border border-gray-200 rounded-xl outline-none mb-4 focus:border-black transition-colors" placeholder="What did you like or dislike?" rows="4" value={userComment} onChange={(e) => setUserComment(e.target.value)} />
            <div className="flex gap-4">
              <button onClick={handleSubmit} disabled={reviewLoading} className="bg-black text-white px-8 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-gray-800 transition-all">
                {reviewLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} Post Review
              </button>
              <button onClick={() => setIsReviewing(false)} className="text-gray-400 font-medium hover:text-black transition-colors">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-10">
          {reviews.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 italic">No reviews yet. Be the first to rate this book!</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div key={rev._id} className="group animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-lg font-bold border border-indigo-100">
                      {rev.user?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{rev.user?.name || "Anonymous"}</p>
                      <div className="flex text-amber-400 mt-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} />)}
                      </div>
                    </div>
                  </div>
                  {isOwner(rev) && (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingId(rev._id); setEditContent(rev.comment); setEditRating(rev.rating); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit3 size={18}/></button>
                      <button
                        onClick={async () => {
                          if (!window.confirm("Delete review?")) return;
                          const ok = await removeReview(rev._id, id);
                          if (ok) await loadFirstPage();
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  )}
                </div>

                {editingId === rev._id ? (
                  <div className="ml-16 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="flex gap-1 mb-4">
                      {[1,2,3,4,5].map(s => <Star key={s} size={20} className={`cursor-pointer ${editRating >= s ? 'text-amber-400' : 'text-gray-200'}`} fill={editRating >= s ? "currentColor" : "none"} onClick={() => setEditRating(s)} />)}
                    </div>
                    <textarea className="w-full p-3 border border-blue-200 rounded-xl bg-white text-sm focus:ring-2 ring-blue-500 outline-none" value={editContent} onChange={e => setEditContent(e.target.value)} />
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => handleUpdate(rev._id)} className="bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-bold shadow-md">Save Changes</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-500 text-xs font-bold px-2">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 leading-relaxed ml-16 bg-white">{rev.comment}</p>
                )}
                <div className="mt-3 border-b border-gray-400"></div>
              </div>
            ))
          )}
        </div>

        {hasMore && (
          <div className="mt-10">
            <button
              onClick={loadMore}
              disabled={pageLoading}
              className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all"
            >
              {pageLoading ? "Loading..." : "See more"}
            </button>
          </div>
        )}
      </div>  
    </div>
  );
};

export default BookRatingPage;
