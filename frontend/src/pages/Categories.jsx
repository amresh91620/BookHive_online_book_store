import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, Layers, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useBooks } from "../hooks/useBooks";
import { useReview } from "../hooks/useReview";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { Badge, Button, Card } from "../components/ui";
import SearchBar from "../components/common/SearchBar";
import { BookGrid } from "../components/books";
import toast from "react-hot-toast";

const accentPalette = [
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-fuchsia-500 to-rose-500",
  "from-indigo-500 to-violet-500",
  "from-slate-600 to-slate-900",
];

const Categories = () => {
  const { books, loading } = useBooks();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { fetchAllReviews, getAvgRatingByBook, getReviewCountByBook } = useReview();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const map = new Map();
    books.forEach((book) => {
      const raw = book.categories || "";
      raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .forEach((name) => {
          map.set(name, (map.get(name) || 0) + 1);
        });
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [books]);

  const filteredCategories = useMemo(() => {
    if (!query) return categories;
    const q = query.toLowerCase();
    return categories.filter((cat) => cat.name.toLowerCase().includes(q));
  }, [categories, query]);

  const displayedBooks = useMemo(() => {
    if (!books.length) return [];
    if (selectedCategory === "All") return books.slice(0, 12);
    return books.filter((book) =>
      String(book.categories || "")
        .toLowerCase()
        .split(",")
        .map((item) => item.trim())
        .includes(selectedCategory.toLowerCase()),
    );
  }, [books, selectedCategory]);

  const avgRatings = useMemo(() => {
    const ratings = {};
    displayedBooks.forEach((book) => {
      ratings[book._id] = Number(getAvgRatingByBook(book._id)) || 0;
    });
    return ratings;
  }, [displayedBooks, getAvgRatingByBook]);

  const reviewCounts = useMemo(() => {
    const counts = {};
    displayedBooks.forEach((book) => {
      counts[book._id] = getReviewCountByBook(book._id);
    });
    return counts;
  }, [displayedBooks, getReviewCountByBook]);

  const handleAddToCart = useCallback(
    async (bookId) => {
      if (!user) {
        toast.error("Please login to add items to cart.");
        return;
      }
      try {
        await addToCart(bookId);
        toast.success("Added to cart!");
      } catch (error) {
        toast.error("Failed to add item");
      }
    },
    [user, addToCart],
  );

  useEffect(() => {
    if (displayedBooks.length === 0) return;
    const ids = displayedBooks.slice(0, 24).map((book) => book._id).filter(Boolean);
    if (ids.length > 0) fetchAllReviews(ids);
  }, [displayedBooks, fetchAllReviews]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_55%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-white">
          <Badge variant="secondary" className="bg-white/10 text-white border border-white/20">
            Browse by Category
          </Badge>
          <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Find your next favorite shelf
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/85 max-w-2xl">
            Explore curated collections across genres and themes. Pick a category
            to see matching titles instantly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Card className="bg-white/10 border border-white/20 text-white px-4 py-3 rounded-2xl">
              <div className="text-xs uppercase tracking-[0.3em] text-white/70">Categories</div>
              <div className="text-2xl font-black">{categories.length}</div>
            </Card>
            <Card className="bg-white/10 border border-white/20 text-white px-4 py-3 rounded-2xl flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <Layers size={20} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/70">Titles</div>
                <div className="text-sm font-semibold">{books.length} total</div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Card className="p-5 sm:p-6 bg-white shadow-lg border border-slate-200 rounded-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            <div className="flex-1">
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder="Search categories"
              />
            </div>
            <Button asChild variant="primary" className="lg:w-auto">
              <Link to="/books">
                Explore All Books <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </Card>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Categories</h2>
            <p className="text-sm text-slate-600">
              Choose a category to see matching titles.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "All" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setSelectedCategory("All")}
            >
              All
            </Button>
            <Badge variant="secondary" className="text-xs">
              {categories.length} categories
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredCategories.map((category, index) => {
            const accent = accentPalette[index % accentPalette.length];
            const isSelected = category.name === selectedCategory;
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`text-left group rounded-xl border transition-all ${
                  isSelected
                    ? "border-blue-500 shadow-md shadow-blue-100 bg-blue-50"
                    : "border-slate-200 bg-white hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60"
                }`}
              >
                <div className="p-4">
                  <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center text-white mb-3`}>
                    <BookOpen size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2">{category.name}</h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {category.count} titles available
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 font-semibold">
                    Explore
                    <ArrowRight size={14} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {selectedCategory === "All" ? "Popular Picks" : `${selectedCategory} Picks`}
            </h2>
            <p className="text-sm text-slate-600">
              {selectedCategory === "All"
                ? "Handpicked titles across the store."
                : `Top titles in ${selectedCategory}.`}
            </p>
          </div>
        </div>
        <BookGrid
          books={displayedBooks}
          loading={loading}
          avgRatings={avgRatings}
          reviewCounts={reviewCounts}
          onAddToCart={handleAddToCart}
        />
      </section>
    </div>
  );
};

export default Categories;
