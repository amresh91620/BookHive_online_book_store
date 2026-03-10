import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookById } from "@/store/slices/booksSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/slices/wishlistSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import ReviewSection from "@/components/common/ReviewSection";
import { Heart, ShoppingCart, Star, BookOpen, Calendar, Globe, Package } from "lucide-react";
import { formatPrice, shortDate } from "@/utils/format";
import toast from "react-hot-toast";

export default function BookDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selected: book, status } = useSelector((state) => state.books);
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const isInWishlist = wishlistItems?.some((item) => item._id === book?._id);

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    dispatch(addToCart(book._id))
      .unwrap()
      .then(() => toast.success("Added to cart"))
      .catch((err) => toast.error(err));
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      navigate("/login");
      return;
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist(book._id))
        .unwrap()
        .then(() => toast.success("Removed from wishlist"))
        .catch((err) => toast.error(err));
    } else {
      dispatch(addToWishlist(book._id))
        .unwrap()
        .then(() => toast.success("Added to wishlist"))
        .catch((err) => toast.error(err));
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-shell">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Image */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full rounded-lg shadow-lg mb-4"
              />
              <div className="space-y-3">
                <Button
                  className="w-full"
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
                  className="w-full"
                  size="lg"
                  onClick={handleWishlistToggle}
                >
                  <Heart
                    className={`w-5 h-5 mr-2 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`}
                  />
                  {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {/* Title and Badges */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {book.bestseller && <Badge variant="success">Bestseller</Badge>}
                  {book.newArrival && <Badge variant="default">New Arrival</Badge>}
                  {book.featured && <Badge variant="secondary">Featured</Badge>}
                  {book.discount > 0 && (
                    <Badge variant="destructive">{book.discount}% OFF</Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600">by {book.author}</p>
              </div>

              {/* Rating */}
              {book.rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
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
                  <span className="text-lg font-medium">{book.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({book.totalReviews} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-amber-600">
                  {formatPrice(book.price)}
                </span>
                {book.originalPrice && book.originalPrice > book.price && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(book.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>

              {/* Book Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-amber-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Pages</p>
                    <p className="font-medium text-gray-900">{book.pages}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-amber-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Published</p>
                    <p className="font-medium text-gray-900">
                      {shortDate(book.publishedDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-amber-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Language</p>
                    <p className="font-medium text-gray-900">{book.language}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-amber-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Format</p>
                    <p className="font-medium text-gray-900">{book.format}</p>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {book.publisher && (
                    <div>
                      <span className="text-gray-500">Publisher:</span>
                      <span className="ml-2 text-gray-900">{book.publisher}</span>
                    </div>
                  )}
                  {book.isbn && (
                    <div>
                      <span className="text-gray-500">ISBN:</span>
                      <span className="ml-2 text-gray-900">{book.isbn}</span>
                    </div>
                  )}
                  {book.edition && (
                    <div>
                      <span className="text-gray-500">Edition:</span>
                      <span className="ml-2 text-gray-900">{book.edition}</span>
                    </div>
                  )}
                  {book.genre && (
                    <div>
                      <span className="text-gray-500">Genre:</span>
                      <span className="ml-2 text-gray-900">{book.genre}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Category:</span>
                    <span className="ml-2 text-gray-900">{book.categories}</span>
                  </div>
                  {book.ageGroup && (
                    <div>
                      <span className="text-gray-500">Age Group:</span>
                      <span className="ml-2 text-gray-900">{book.ageGroup}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="border-t mt-6 pt-6">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Availability:</span>
                  {book.stock > 0 ? (
                    <Badge variant="success">In Stock ({book.stock} available)</Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
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
