import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useBookDetails } from "@/hooks/api/useBooks";
import { useAddToCart } from "@/hooks/api/useCart";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/api/useWishlist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import ReviewSection from "@/components/common/ReviewSection";
import { Heart, ShoppingCart, Star, BookOpen, Calendar, Globe, Package, User } from "lucide-react";
import { formatPrice, shortDate } from "@/utils/format";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const { data: book, isLoading } = useBookDetails(id);
  const { data: wishlistItems = [] } = useWishlist();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isInWishlist = wishlistItems?.some((item) => item._id === book?._id);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    addToCart.mutate(book._id, {
      onSuccess: () => toast.success("Added to cart"),
      onError: (err) => toast.error(err?.response?.data?.msg || "Failed to add to cart"),
    });
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      navigate("/login");
      return;
    }
    if (isInWishlist) {
      removeFromWishlist.mutate(book._id, {
        onSuccess: () => toast.success("Removed from wishlist"),
        onError: (err) => toast.error(err?.response?.data?.msg || "Failed to remove"),
      });
    } else {
      addToWishlist.mutate(book._id, {
        onSuccess: () => toast.success("Added to wishlist"),
        onError: (err) => toast.error(err?.response?.data?.msg || "Failed to add"),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container-shell">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Image Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <Skeleton className="aspect-[3/4] w-full rounded-lg mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full rounded-md" />
                  <Skeleton className="h-12 w-full rounded-md" />
                </div>
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="space-y-4 mb-8">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-6 w-1/4" />
                </div>

                <div className="flex gap-2 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-5 w-5 rounded-full" />
                  ))}
                  <Skeleton className="h-6 w-16" />
                </div>

                <Skeleton className="h-24 w-full mb-8" />

                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book not found</h2>
          <Button onClick={() => navigate("/books")}>Browse Books</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container-shell">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/books" className="hover:text-amber-600 transition-colors">Books</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{book.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Image & Actions */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20 shadow-lg border-0">
              {/* Book Cover */}
              <div className="relative mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                <img
                  src={book.coverImage}
                  alt={book.title}
                  loading="lazy"
                  className="w-full rounded-lg shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-300"
                />
                {book.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {book.discount}% OFF
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="mb-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-amber-600">
                    {formatPrice(book.price)}
                  </span>
                  {book.originalPrice && book.originalPrice > book.price && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(book.originalPrice)}
                    </span>
                  )}
                </div>
                {book.discount > 0 && (
                  <p className="text-sm text-green-600 font-medium">
                    You save {formatPrice(book.originalPrice - book.price)}!
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                >
                  {book.stock === 0 ? (
                    "Out of Stock"
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 text-base font-semibold border-2 hover:bg-red-50 hover:border-red-300 transition-all"
                  size="lg"
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    className={`w-5 h-5 mr-2 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`}
                  />
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>

              {/* Stock Status */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Availability:</span>
                  {book.stock > 0 ? (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      In Stock ({book.stock} available)
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6 border-0">
              {/* Title and Author */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                {book.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                by <span className="text-amber-600 font-semibold">{book.author}</span>
              </p>

              {/* Badges */}
              {(book.bestseller || book.newArrival || book.featured) && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {book.bestseller && (
                    <Badge className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1">
                      Bestseller
                    </Badge>
                  )}
                  {book.newArrival && (
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1">
                      New Arrival
                    </Badge>
                  )}
                  {book.featured && (
                    <Badge className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1">
                      Featured
                    </Badge>
                  )}
                </div>
              )}

              {/* Rating */}
              {book.rating > 0 && (
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(book.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {book.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500">({book.totalReviews} reviews)</span>
                </div>
              )}

              {/* About Book */}
              {book.aboutBook && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-amber-600" />
                    About the Book
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                      {book.aboutBook}
                    </p>
                  </div>
                </div>
              )}

              {/* About Author */}
              {book.aboutAuthor && (
                <div className="mb-8 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-6 h-6 text-amber-600" />
                    About the Author
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                      {book.aboutAuthor}
                    </p>
                  </div>
                </div>
              )}

              {/* Fallback to description */}
              {!book.aboutBook && book.description && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
              )}

              {/* Book Details Grid */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Pages</p>
                      <p className="font-semibold text-gray-900">{book.pages}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Published</p>
                      <p className="font-semibold text-gray-900">
                        {shortDate(book.publishedDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Language</p>
                      <p className="font-semibold text-gray-900">{book.language}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Format</p>
                      <p className="font-semibold text-gray-900">{book.format}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {book.publisher && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium">Publisher:</span>
                      <span className="text-gray-900">{book.publisher}</span>
                    </div>
                  )}
                  {book.isbn && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium">ISBN:</span>
                      <span className="text-gray-900 font-mono text-xs">{book.isbn}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium">Category:</span>
                    <span className="text-gray-900">{book.categories}</span>
                  </div>
                  {book.ageGroup && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-medium">Age Group:</span>
                      <span className="text-gray-900">{book.ageGroup}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <ReviewSection bookId={book._id} />
          </div>
        </div>
      </div>
    </div>
  );
}
