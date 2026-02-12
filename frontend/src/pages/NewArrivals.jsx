import React, { useCallback } from "react";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { BookCollectionPage } from "../components/books";

const NewArrivals = () => {
  const filterBooks = useCallback((items = []) => {
    const flagged = items.filter((book) => book.newArrival);
    if (flagged.length > 0) return flagged;
    return [...items]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 24);
  }, []);

  return (
    <BookCollectionPage
      kicker="Fresh Drops"
      title="New Arrivals"
      description="Be the first to explore the latest releases and newly added titles."
      icon={Sparkles}
      accent="from-emerald-500 via-teal-500 to-cyan-500"
      filterBooks={filterBooks}
      emptyTitle="No new arrivals yet"
      emptyDescription="Mark books as new arrivals in the admin panel to highlight them here."
      cta={<Link to="/books">Browse All Books</Link>}
    />
  );
};

export default NewArrivals;
