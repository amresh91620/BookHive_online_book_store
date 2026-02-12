import React from 'react';
import BookCard from './BookCard';
import { SkeletonGrid } from '../common/SkeletonCard';
import EmptyState from '../common/EmptyState';
import { BookOpen } from 'lucide-react';

const BookGrid = ({
  books = [],
  loading = false,
  avgRatings = {},
  reviewCounts = {},
  onAddToCart,
  className = "",
}) => {
  const gridClassName = `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-8 sm:gap-y-10 md:gap-y-12 lg:gap-y-16 ${className}`;

  if (loading && books.length === 0) {
    return <SkeletonGrid count={8} variant="book" className={className} />;
  }
  
  if (books.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No Titles Found"
        description="Try adjusting your filters or search terms to find what you're looking for."
      />
    );
  }
  
  return (
    <div className={gridClassName}>
      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
          avgRating={avgRatings[book._id] || 0}
          reviewCount={reviewCounts[book._id] || 0}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default BookGrid;
