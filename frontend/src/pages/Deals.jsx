import React, { useCallback } from "react";
import { Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { BookCollectionPage } from "../components/books";

const Deals = () => {
  const filterBooks = useCallback((items = []) => {
    return items.filter((book) => {
      const discount = Number(book.discount) || 0;
      const hasOriginal = Number(book.originalPrice) > Number(book.price);
      return discount > 0 || hasOriginal;
    });
  }, []);

  return (
    <BookCollectionPage
      kicker="Limited Offers"
      title="Deals & Discounts"
      description="Grab limited-time offers on select titles and build your collection for less."
      icon={Tag}
      accent="from-fuchsia-500 via-rose-500 to-orange-400"
      filterBooks={filterBooks}
      emptyTitle="No deals right now"
      emptyDescription="Add discounts or original prices to books to feature them here."
      cta={<Link to="/books">Browse All Books</Link>}
    />
  );
};

export default Deals;
