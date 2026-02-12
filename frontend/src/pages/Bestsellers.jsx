import React, { useCallback } from "react";
import { Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { BookCollectionPage } from "../components/books";

const Bestsellers = () => {
  const filterBooks = useCallback((items = []) => {
    const flagged = items.filter((book) => book.bestseller);
    if (flagged.length > 0) return flagged;
    return [...items]
      .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
      .slice(0, 24);
  }, []);

  return (
    <BookCollectionPage
      kicker="Top of the Hive"
      title="Bestsellers"
      description="Explore the books everyone is talking about. These titles lead the charts for a reason."
      icon={Flame}
      accent="from-amber-500 via-orange-500 to-rose-500"
      filterBooks={filterBooks}
      emptyTitle="No bestsellers yet"
      emptyDescription="Add bestseller flags to books in the admin panel to feature them here."
      cta={<Link to="/books">Browse All Books</Link>}
    />
  );
};

export default Bestsellers;
