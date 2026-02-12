import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Edit3,
  Heart,
  Send,
  ShoppingCart,
  Star,
  Tag,
  Trash2,
  Zap,
} from "lucide-react";
import { useBooks } from "../hooks/useBooks";
import { useAuth } from "../hooks/useAuth";
import { useReview } from "../hooks/useReview";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import AuthModal from "../components/AuthModal";
import toast from "react-hot-toast";
import { Badge, Button, Card, Spinner, Textarea } from "../components/ui";

const BookRatingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books } = useBooks();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const {
    addNewReview,
    fetchReviewsPage,
    removeReview,
    editReview,
    loading: reviewLoading,
  } = useReview();
  const { toggleWishlist, wishlistIds } = useWishlist();

  const book = books.find((b) => String(b._id) === String(id));

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
  const [isAdding, setIsAdding] = useState(false);
  const [stats, setStats] = useState({
    avgRating: "0.0",
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    totalRatings: 0,
  });

  const isWishlisted = wishlistIds?.has(String(id));

  const loadFirstPage = useCallback(async () => {
    if (!id) return null;
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
      return res;
    } catch (error) {
      setReviews([]);
      setNextCursor(null);
      setHasMore(false);
      setStats({
        avgRating: "0.0",
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        totalRatings: 0,
      });
      return null;
    } finally {
      setPageLoading(false);
    }
  }, [id, fetchReviewsPage]);

  const loadMore = useCallback(async () => {
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
  }, [id, hasMore, pageLoading, nextCursor, fetchReviewsPage]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  const { avgRating, ratingDistribution, totalRatings } = useMemo(() => {
    return {
      avgRating: stats.avgRating,
      ratingDistribution: stats.ratingDistribution,
      totalRatings: stats.totalRatings,
    };
  }, [stats]);

  const ratingValue = Number(avgRating) || 0;
  const roundedRating = Math.round(ratingValue);

  const handleAddToCart = useCallback(
    async (goToCart = false) => {
      if (!user) {
        toast.error("Please login to continue.");
        setAuthType("login");
        setIsAuthModalOpen(true);
        return;
      }
      if (!id) return;
      try {
        setIsAdding(true);
        await addToCart(id);
        toast.success("Added to cart!");
        if (goToCart) navigate("/cart");
      } catch (err) {
        toast.error("Failed to add item");
      } finally {
        setIsAdding(false);
      }
    },
    [user, id, addToCart, navigate],
  );

  const handleBuyNow = () => {
    handleAddToCart(true);
  };

  const handleWishlist = () => {
    if (!user) {
      setAuthType("login");
      setIsAuthModalOpen(true);
      return;
    }
    toggleWishlist(id);
  };

  const handleSubmit = async () => {
    if (!user) {
      setAuthType("login");
      setIsAuthModalOpen(true);
      return;
    }
    if (userRating === 0 || !userComment.trim()) {
      return toast.error("Rating and comment required!");
    }
    const result = await addNewReview({
      bookId: id,
      rating: userRating,
      comment: userComment,
    });
    if (result?.ok) {
      setIsReviewing(false);
      setUserRating(0);
      setUserComment("");
      await loadFirstPage();
      return;
    }
    if (result?.errorMsg?.toLowerCase().includes("already reviewed")) {
      const res = await loadFirstPage();
      const list = res?.reviews || reviews;
      const myReview = list.find((r) => {
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
    const success = await editReview(reviewId, id, {
      rating: editRating,
      comment: editContent,
    });
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

  if (!book) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const publishedYear = book.publishedDate
    ? new Date(book.publishedDate).getFullYear()
    : "N/A";

  const categoryList = (book.categories || "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50">
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        type={authType}
        setType={setAuthType}
      />

      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="mt-6 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
            <Card className="p-0 overflow-hidden border-slate-200 shadow-sm">
              <img
                src={book.coverImage}
                className="w-full h-full object-cover"
                alt={book.title}
              />
            </Card>

            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                {categoryList.map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-[10px] uppercase tracking-widest">
                    {cat}
                  </Badge>
                ))}
                {book.format && (
                  <Badge variant="primary" className="text-[10px] uppercase tracking-widest">
                    {book.format}
                  </Badge>
                )}
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
                  {book.title}
                </h1>
                <p className="text-lg text-slate-500 italic mt-1">
                  by {book.author}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 w-fit">
                <span className="text-2xl font-black text-slate-900">
                  {avgRating}
                </span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < roundedRating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-slate-400 text-sm font-semibold">
                  ({totalRatings} reviews)
                </span>
              </div>

              <div>
                <p className="text-xs font-bold uppercase text-slate-400 mb-2 tracking-widest">
                  Description
                </p>
                <p className="text-slate-600 leading-relaxed">
                  {book.description || "No description available for this book."}
                </p>
              </div>
            </div>

            <Card variant="elevated" padding="lg" className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  Price
                </p>
                <p className="text-3xl font-black text-slate-900">₹{book.price}</p>
              </div>
              <div className="space-y-3">
                <Button
                  variant="primary"
                  onClick={() => handleAddToCart(false)}
                  loading={isAdding}
                  icon={ShoppingCart}
                >
                  Add to Cart
                </Button>
                <Button variant="secondary" onClick={handleBuyNow} icon={Zap}>
                  Buy Now
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWishlist}
                  className={`${
                    isWishlisted
                      ? "border-rose-500 text-rose-500 hover:bg-rose-50"
                      : "border-slate-300 text-slate-700 hover:border-rose-500 hover:text-rose-500"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Heart
                      size={14}
                      className={isWishlisted ? "fill-current" : ""}
                    />
                    {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                  </span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Customer Feedback
              </h2>
              {!isReviewing && (
                <Button
                  variant="primary"
                  onClick={() => {
                    if (user) {
                      setIsReviewing(true);
                    } else {
                      setAuthType("login");
                      setIsAuthModalOpen(true);
                    }
                  }}
                >
                  Write a Review
                </Button>
              )}
            </div>

            {isReviewing && (
              <Card className="border-dashed border-2 border-slate-200">
                <Card.Header>
                  <Card.Title>Share your experience</Card.Title>
                  <Card.Description>Rate the book and leave a quick note.</Card.Description>
                </Card.Header>
                <Card.Content className="space-y-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={28}
                        className={`cursor-pointer transition-transform active:scale-90 ${
                          userRating >= s ? "text-amber-400" : "text-slate-200"
                        }`}
                        fill={userRating >= s ? "currentColor" : "none"}
                        onClick={() => setUserRating(s)}
                      />
                    ))}
                  </div>
                  <Textarea
                    name="review"
                    placeholder="What did you like or dislike?"
                    rows={4}
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      loading={reviewLoading}
                      icon={Send}
                    >
                      Post Review
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setIsReviewing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            )}

            <div className="space-y-6">
              {pageLoading && reviews.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                  <Spinner size="lg" />
                </div>
              ) : reviews.length === 0 ? (
                <Card variant="flat" className="text-center py-12">
                  <p className="text-slate-500 italic">
                    No reviews yet. Be the first to rate this book!
                  </p>
                </Card>
              ) : (
                reviews.map((rev) => (
                  <Card key={rev._id} className="border border-slate-200">
                    <Card.Content className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-lg font-bold border border-amber-100">
                            {(rev.user?.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {rev.user?.name || "Anonymous"}
                            </p>
                            <div className="flex text-amber-400 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  fill={i < rev.rating ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        {isOwner(rev) && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingId(rev._id);
                                setEditContent(rev.comment);
                                setEditRating(rev.rating);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={async () => {
                                if (!window.confirm("Delete review?")) return;
                                const ok = await removeReview(rev._id, id);
                                if (ok) await loadFirstPage();
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </div>

                      {editingId === rev._id ? (
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                size={20}
                                className={`cursor-pointer ${
                                  editRating >= s ? "text-amber-400" : "text-slate-200"
                                }`}
                                fill={editRating >= s ? "currentColor" : "none"}
                                onClick={() => setEditRating(s)}
                              />
                            ))}
                          </div>
                          <Textarea
                            name={`edit-${rev._id}`}
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                          />
                          <div className="flex flex-wrap gap-3">
                            <Button
                              variant="primary"
                              onClick={() => handleUpdate(rev._id)}
                            >
                              Save Changes
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-600 leading-relaxed">
                          {rev.comment}
                        </p>
                      )}
                    </Card.Content>
                  </Card>
                ))
              )}
            </div>

            {hasMore && (
              <div>
                <Button
                  variant="outline"
                  onClick={loadMore}
                  loading={pageLoading}
                >
                  See more
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <Card.Header>
                <Card.Title>Specifications</Card.Title>
                <Card.Description>Quick facts about the book.</Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <Tag size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Category
                    </p>
                    <p className="font-semibold text-slate-900">
                      {book.categories || "General"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BookOpen size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Pages
                    </p>
                    <p className="font-semibold text-slate-900">
                      {book.pages || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Calendar size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Published
                    </p>
                    <p className="font-semibold text-slate-900">
                      {publishedYear}
                    </p>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Rating Breakdown</Card.Title>
                <Card.Description>How readers rated this book.</Card.Description>
              </Card.Header>
              <Card.Content className="space-y-3">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center gap-4 text-xs">
                    <span className="w-10 text-slate-500 font-bold">
                      {star} Star
                    </span>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{
                          width: `${
                            totalRatings
                              ? (ratingDistribution[star] / totalRatings) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="w-10 text-right text-slate-400">
                      {totalRatings
                        ? Math.round((ratingDistribution[star] / totalRatings) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                ))}
              </Card.Content>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookRatingPage;
