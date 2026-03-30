import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import BookCard from "./BookCard";

export default function AnimatedBookRow({ books, startIndex }) {
  const [rowRef, rowVisible] = useScrollAnimation();

  return (
    <>
      {books.map((book, index) => (
        <div
          key={book._id}
          ref={index === 0 ? rowRef : null}
          className={`transition-all duration-700 ${
            rowVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: `${index * 100}ms` }}
        >
          <BookCard book={book} />
        </div>
      ))}
    </>
  );
}

