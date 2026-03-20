import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useBookDetails, useBooksList } from "@/hooks/api/useBooks";
import { useAddToCart } from "@/hooks/api/useCart";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/api/useWishlist";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import ReviewSection from "@/components/common/ReviewSection";
import BookCard from "@/components/common/BookCard";
import {
  Heart,
  ShoppingCart,
  Star,
  BookOpen,
  Calendar,
  Globe,
  Package,
  User,
  Share2,
  Truck,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  Zap,
  Trophy,
  Minus,
  Plus,
  ShieldCheck,
  Clock,
  CreditCard,
  ArrowUp,
  X,
  Maximize2,
} from "lucide-react";
import { formatPrice, shortDate } from "@/utils/format";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Helper: scroll to top
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const mainImageRef = useRef(null);

  // Fetch book details
  const { data: book, isLoading, isError } = useBookDetails(id);

  // Fetch related books only when book is loaded
  const { data: relatedBooks = [] } = useBooksList(
    {
      limit: 6,
      category: book?.categories,
      author: book?.author, // add author for better recommendations
    },
    { enabled: !!book } // Only run when book exists
  );

  // Wishlist
  const { data: wishlistItems = [] } = useWishlist();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isInWishlist = wishlistItems?.some((item) => item._id === book?._id);

  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle quantity change
  const incrementQuantity = () => {
    if (book && quantity < book.stock) {
      setQuantity((prev) => prev + 1);
    } else {
      toast.error(`Only ${book?.stock} items available`);
    }
  };
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  // Add to cart with quantity
  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }
    if (book.stock === 0) {
      toast.error("This book is out of stock");
      return;
    }
    addToCart.mutate(
      { bookId: book._id, quantity },
      {
        onSuccess: () => toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart`),
        onError: (err) =>
          toast.error(err?.response?.data?.msg || "Failed to add to cart"),
      }
    );
  };

  // Buy now: add to cart and redirect to checkout
  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login to proceed");
      navigate("/login");
      return;
    }
    if (book.stock === 0) {
      toast.error("This book is out of stock");
      return;
    }
    addToCart.mutate(
      { bookId: book._id, quantity },
      {
        onSuccess: () => {
          toast.success("Added to cart! Redirecting to checkout...");
          navigate("/checkout");
        },
        onError: (err) =>
          toast.error(err?.response?.data?.msg || "Failed to process"),
      }
    );
  };

  // Wishlist toggle
  const handleWishlistToggle = () => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      navigate("/login");
      return;
    }
    if (isInWishlist) {
      removeFromWishlist.mutate(book._id, {
        onSuccess: () => toast.success("Removed from wishlist"),
        onError: (err) =>
          toast.error(err?.response?.data?.msg || "Failed to remove"),
      });
    } else {
      addToWishlist.mutate(book._id, {
        onSuccess: () => toast.success("Added to wishlist"),
        onError: (err) =>
          toast.error(err?.response?.data?.msg || "Failed to add"),
      });
    }
  };

  // Share
  const handleShare = async () => {
    const shareData = {
      title: book.title,
      text: `Check out "${book.title}" by ${book.author} – a must-read!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") toast.error("Error sharing");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  // Mock additional images (if the API provides more images, replace with actual)
  const productImages = book?.images ? [book.coverImage, ...book.images] : [book?.coverImage];

  if (isLoading) {
    return <BookDetailSkeleton />;
  }

  if (isError || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md mx-auto p-6 sm:p-8 bg-white rounded-2xl shadow-xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Book Not Found
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/books")} className="bg-yellow-500 hover:bg-yellow-600 text-sm sm:text-base">
            Browse Books
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="container-shell py-8 sm:py-12 ">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
          
          {/* Left Column - Images (2 columns) */}
          <div className="lg:col-span-2 space-y-4 flex flex-col items-center lg:items-start">
            {/* Main Image with 3D Effect */}
            <motion.div
              ref={mainImageRef}
              className="relative w-full max-w-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* 3D Shadow Circle */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-gradient-to-r from-transparent via-black/30 to-transparent rounded-full blur-xl"></div>
              
              {/* 3D Book Container */}
              <div className="relative mx-auto w-full transition-transform duration-300 hover:scale-105">
                <div 
                  className="relative aspect-[3/4] rounded-sm shadow-2xl transition-transform duration-300 cursor-zoom-in"
                  style={{ 
                    transform: 'perspective(1200px) rotateY(-15deg)',
                    boxShadow: '15px 15px 40px rgba(0,0,0,0.35), -5px 0 15px rgba(0,0,0,0.2)'
                  }}
                  onClick={() => setLightboxOpen(true)}
                >
                  {/* Book Cover */}
                  <img
                    src={productImages[selectedImage]}
                    alt={book.title}
                    className="h-full w-full rounded-sm object-cover"
                  />
                  
                  {/* Book Spine Shadow */}
                  <div className="absolute left-0 top-0 h-full w-4 sm:w-6 bg-gradient-to-r from-black/50 via-black/20 to-transparent rounded-l-sm" />
                  
                  {/* Book Edge Highlight */}
                  <div className="absolute right-0 top-0 h-full w-1 sm:w-2 bg-gradient-to-l from-white/40 to-transparent rounded-r-sm" />
                  
                  {/* Book Pages Effect - Right Side */}
                  <div className="absolute -right-1 sm:-right-2 top-2 h-[calc(100%-16px)] w-2 sm:w-3 rounded-r-sm bg-white shadow-md" />
                  <div className="absolute -right-2 sm:-right-4 top-4 h-[calc(100%-32px)] w-2 sm:w-3 rounded-r-sm bg-gray-100 shadow-md" />
                  <div className="absolute -right-3 sm:-right-6 top-6 h-[calc(100%-48px)] w-2 sm:w-3 rounded-r-sm bg-gray-200 shadow-sm" />
                
                  {/* Discount Badge */}
                  {book.discount > 0 && (
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg z-10">
                      -{book.discount}% OFF
                    </div>
                  )}

                  {/* Wishlist Icon - Top Right */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlistToggle();
                    }}
                    className="absolute top-3 sm:top-4 right-3 sm:right-4 w-9 h-9 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all flex items-center justify-center z-10 group"
                  >
                    <Heart
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${
                        isInWishlist 
                          ? "fill-red-500 text-red-500" 
                          : "text-gray-700 group-hover:text-red-500"
                      }`}
                    />
                  </button>

                  {/* Share Icon - Below Wishlist */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    className="absolute top-[3.5rem] sm:top-[4.5rem] right-3 sm:right-4 w-9 h-9 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all flex items-center justify-center z-10 group"
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-blue-500 transition-colors" />
                  </button>

                  {/* Zoom Icon - Bottom Right */}
                  <button
                    className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-white/90 backdrop-blur-sm p-2 sm:p-2.5 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxOpen(true);
                    }}
                  >
                    <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 w-full max-w-sm">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-yellow-500 shadow-md scale-105"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            
          </div>

          {/* Right Column - Details (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title & Author */}
            <div>
              {book.bestseller && (
                <Badge className="mb-2 sm:mb-3 bg-yellow-500 text-white text-xs sm:text-sm font-semibold px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  🏆 Bestseller
                </Badge>
              )}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {book.title}
              </h1>
              <Link
                to={`/books?author=${encodeURIComponent(book.author)}`}
                className="text-sm sm:text-base md:text-lg text-yellow-600 hover:text-yellow-700 font-medium mt-2 inline-block"
              >
                by {book.author}
              </Link>
            </div>

            {/* Rating */}
            {book.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < Math.floor(book.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm sm:text-base text-gray-700 font-semibold ml-1">
                  {book.rating.toFixed(1)}
                </span>
                <span className="text-gray-500 text-xs sm:text-sm">
                  ({book.totalReviews} reviews)
                </span>
              </div>
            )}

            {/* Price & Stock */}
            <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-600">
                {formatPrice(book.price)}
              </span>
              {book.originalPrice && book.originalPrice > book.price && (
                <span className="text-base sm:text-lg md:text-xl text-gray-400 line-through">
                  {formatPrice(book.originalPrice)}
                </span>
              )}
              {book.discount > 0 && (
                <span className="bg-green-100 text-green-700 text-xs sm:text-sm font-semibold px-2 py-1 rounded-full">
                  Save {formatPrice(book.originalPrice - book.price)}
                </span>
              )}
            </div>

            {/* Stock & Delivery */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                {book.stock > 0 ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 font-medium">
                      In Stock ({book.stock} available)
                    </span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  </>
                )}
              </div>
              {book.stock > 0 && book.stock <= 10 && (
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-yellow-500 h-1.5 rounded-full"
                    style={{ width: `${(book.stock / 10) * 100}%` }}
                  ></div>
                </div>
              )}
              <p className="text-gray-500 text-xs sm:text-sm flex items-center gap-1">
                <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                Free delivery by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
            </div>

            {/* Quantity Selector */}
            {book.stock > 0 && (
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-sm sm:text-base text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                  <button
                    onClick={decrementQuantity}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 transition disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <span className="w-10 sm:w-12 text-center text-sm sm:text-base font-semibold">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 transition disabled:opacity-50"
                    disabled={quantity >= book.stock}
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Button
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm sm:text-base font-bold py-4 sm:py-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                onClick={handleAddToCart}
                disabled={book.stock === 0}
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm sm:text-base font-bold py-4 sm:py-6 rounded-xl shadow-md hover:shadow-lg transition-all"
                onClick={handleBuyNow}
                disabled={book.stock === 0}
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Buy Now
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 border-t border-gray-200">
              {[
                { icon: ShieldCheck, label: "Authentic", color: "green" },
                { icon: Truck, label: "Free Shipping", color: "blue" },
                { icon: RotateCcw, label: "Easy Returns", color: "purple" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="text-center p-1.5 sm:p-2 rounded-lg hover:bg-gray-50 transition cursor-help"
                    title={item.label}
                  >
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-${item.color}-500`} />
                    <p className="text-[10px] sm:text-xs text-gray-600">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-12 sm:mt-16 border-t border-gray-200 pt-8 sm:pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* About Book */}
            <div className="md:col-span-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                About the Book
              </h2>
              <div className="prose max-w-none text-sm sm:text-base text-gray-700 leading-relaxed">
                {book.aboutBook || "No description available."}
              </div>
            </div>

            {/* Book Specs */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Details</h2>
              <div className="space-y-2.5 sm:space-y-3 text-sm sm:text-base text-gray-700">
                {[
                  { label: "Pages", value: book.pages, icon: BookOpen },
                  { label: "Published", value: shortDate(book.publishedDate), icon: Calendar },
                  { label: "Language", value: book.language, icon: Globe },
                  { label: "Format", value: book.format, icon: Package },
                  { label: "Publisher", value: book.publisher, icon: User },
                  { label: "ISBN", value: book.isbn, icon: BookOpen },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 sm:gap-3">
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5" />
                    <div>
                      <span className="font-semibold">{item.label}:</span>{" "}
                      <span>{item.value || "—"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* About Author */}
          {book.aboutAuthor && (
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                About the Author
              </h2>
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 text-sm sm:text-base text-gray-700 leading-relaxed">
                {book.aboutAuthor}
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200">
          <ReviewSection bookId={book._id} />
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {relatedBooks.slice(0, 4).map((relatedBook) => (
                <BookCard key={relatedBook._id} book={relatedBook} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Add-to-Cart Bar */}
      <AnimatePresence>
        {book.stock > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-3 sm:p-4 md:hidden z-40"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-gray-500">Total price</p>
                <p className="text-lg sm:text-xl font-bold text-yellow-600">
                  {formatPrice(book.price * quantity)}
                </p>
              </div>
              <Button
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs sm:text-sm font-bold py-2.5 sm:py-3 rounded-xl"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Button
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm font-bold py-2.5 sm:py-3 rounded-xl"
                onClick={handleBuyNow}
              >
                Buy Now
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-yellow-500 text-white p-3 rounded-full shadow-lg hover:bg-yellow-600 transition-all z-40"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={productImages[selectedImage]}
              alt={book.title}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {productImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 rounded-full p-2">
                {productImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === selectedImage ? "bg-white w-4" : "bg-white/50"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(idx);
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Skeleton Loader Component
function BookDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-[3/4] rounded-2xl" />
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-lg" />
              ))}
            </div>
          </div>
          {/* Details Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex gap-4">
              <Skeleton className="h-12 flex-1 rounded-xl" />
              <Skeleton className="h-12 flex-1 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}