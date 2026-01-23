import React, { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Send } from "lucide-react";

const BookRatingPage = () => {
  // --- Form State ---
  const [isReviewing, setIsReviewing] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userComment, setUserComment] = useState("");

  // Dummy reviews (15)
  const [allReviews] = useState([
    { id: 1, user: "Alice Johnson", avatar: "https://i.pravatar.cc/150?u=1", message: "A timeless classic! Loved the depth of characters.", rating: 5, date: "Jan 12, 2024" },
    { id: 2, user: "Bob Smith", avatar: "https://i.pravatar.cc/150?u=2", message: "Beautiful story but a bit slow in the middle chapters.", rating: 4, date: "Jan 10, 2024" },
    { id: 15, user: "Olivia Pope", avatar: "https://i.pravatar.cc/150?u=15", message: "Highly atmospheric and dark.", rating: 4, date: "Nov 05, 2023" },
  ]);

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const totalPages = Math.ceil(allReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = allReviews.slice(startIndex, startIndex + reviewsPerPage);

  const ratingData = [
    { label: "5 stars", count: "1,090,501", percentage: 46 },
    { label: "4 stars", count: "723,584", percentage: 31 },
    { label: "3 stars", count: "354,216", percentage: 15 },
    { label: "2 stars", count: "102,298", percentage: 4 },
    { label: "1 star", count: "54,813", percentage: 2 },
  ];

  const handleSubmit = () => {
    if (userRating === 0) return alert("Please select a rating!");
    console.log({ rating: userRating, comment: userComment });
    alert("Review Submitted Successfully!");
    setIsReviewing(false);
    setUserRating(0);
    setUserComment("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12">
      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
        
        {/* BOOK INFO */}
        <div className="lg:col-span-2 flex flex-col sm:flex-row gap-6">
          <img
            src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1557343311i/10210.jpg"
            alt="Jane Eyre"
            className="w-full sm:w-48 h-72 object-cover rounded-lg shadow-lg mx-auto sm:mx-0"
          />

          <div className="flex-1 flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold">Jane Eyre</h1>
            <p className="text-gray-700 text-sm sm:text-lg">
              Charlotte Brontë, Michael Mason <span className="italic text-gray-400">(Introduction)</span>
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <div className="flex text-orange-500">
                {[1, 2, 3, 4].map((i) => (<Star key={i} fill="currentColor" className="w-5 h-5" />))}
                <Star className="text-gray-300 w-5 h-5" />
              </div>
              <span className="text-xl sm:text-2xl font-bold">4.16</span>
              <span className="text-gray-500 text-xs sm:text-sm">2,325,412 ratings · 80,164 reviews</span>
            </div>

            <p className="text-gray-600 text-sm mt-2">532 pages · Paperback</p>
            <p className="text-gray-600 text-sm">First published October 19, 1847</p>

            {/* --- CONDITIONAL RATING FORM --- */}
            <div className="mt-6">
              {!isReviewing ? (
                <button 
                  onClick={() => setIsReviewing(true)}
                  className="w-fit bg-[#387844] text-white px-6 py-2.5 rounded-md hover:bg-green-800 transition font-semibold"
                >
                  Write a Review
                </button>
              ) : (
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Your Rating</p>
                  
                  {/* Interactive Stars */}
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setUserRating(star)}
                        className="transition-transform active:scale-90"
                      >
                        <Star
                          size={28}
                          fill={(hoverRating || userRating) >= star ? "#f97316" : "none"}
                          className={(hoverRating || userRating) >= star ? "text-orange-500" : "text-gray-300"}
                        />
                      </button>
                    ))}
                  </div>

                  <p className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Your Review</p>
                  <textarea
                    rows="3"
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Tell us what you thought about this book..."
                    className="w-full p-3 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-100 focus:border-[#387844] transition-all bg-white"
                  />
                  
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={handleSubmit}
                      className="flex items-center gap-2 bg-[#387844] text-white px-5 py-2 rounded-md hover:bg-green-800 transition font-bold text-sm"
                    >
                      <Send size={16} /> Submit Review
                    </button>
                    <button 
                      onClick={() => setIsReviewing(false)}
                      className="text-gray-500 hover:text-gray-800 text-sm font-medium px-4"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RATING BREAKDOWN (Right Side) */}
        <div className="border-t lg:border-t-0 lg:border-l pt-8 lg:pt-0 lg:pl-8 border-gray-100">
          <h2 className="text-xl font-serif mb-4">Community Reviews</h2>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex text-orange-500">
              {[1, 2, 3, 4].map((i) => (<Star key={i} fill="currentColor" className="w-6 h-6" />))}
              <Star className="text-gray-300 w-6 h-6" />
            </div>
            <span className="text-3xl sm:text-4xl font-light text-gray-800">4.16</span>
          </div>
          <div className="space-y-3">
            {ratingData.map((item, index) => (
              <div key={index} className="flex items-center gap-4 text-sm">
                <span className="w-14 underline cursor-pointer hover:text-orange-600 font-medium">{item.label}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: `${item.percentage}%` }} />
                </div>
                <span className="w-28 text-gray-500 text-xs">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* USER REVIEWS LIST */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-semibold mb-8">Ratings & Reviews</h2>
        <div className="flex flex-col gap-8 min-h-[400px]">
          {currentReviews.map((review) => (
            <div key={review.id} className="flex gap-4 pb-8 border-b last:border-0">
              <img src={review.avatar} alt={review.user} className="w-11 h-11 rounded-full object-cover border" />
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-bold text-gray-900">{review.user}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "#f97316" : "none"} className={i < review.rating ? "text-orange-500" : "text-gray-200"} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-400 text-xs mb-2">{review.date}</p>
                <p className="text-gray-700 leading-relaxed max-w-2xl">{review.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION (Keep same) */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-4">
          <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage === 1} className="flex items-center gap-1 px-4 py-2 border rounded-md disabled:opacity-30">
            <ChevronLeft size={18} /> Previous
          </button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i+1)} className={`w-9 h-9 rounded-md border ${currentPage === i+1 ? "bg-[#387844] text-white" : "hover:bg-gray-50"}`}>
                {i+1}
              </button>
            ))}
          </div>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage === totalPages} className="flex items-center gap-1 px-4 py-2 border rounded-md disabled:opacity-30">
            Next <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookRatingPage;