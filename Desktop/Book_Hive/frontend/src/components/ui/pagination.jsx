import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  const showEllipsisStart = currentPage > 3;
  const showEllipsisEnd = currentPage < totalPages - 2;

  // Always show first page
  pages.push(1);

  // Show ellipsis or pages near start
  if (showEllipsisStart) {
    pages.push("ellipsis-start");
  } else {
    for (let i = 2; i < Math.min(4, totalPages); i++) {
      pages.push(i);
    }
  }

  // Show current page and neighbors
  if (currentPage > 3 && currentPage < totalPages - 2) {
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
  }

  // Show ellipsis or pages near end
  if (showEllipsisEnd) {
    pages.push("ellipsis-end");
  } else {
    for (let i = Math.max(totalPages - 2, 4); i < totalPages; i++) {
      if (i > 1) {
        pages.push(i);
      }
    }
  }

  // Always show last page if more than 1 page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  // Remove duplicates
  const uniquePages = pages.filter((page, index, self) => 
    self.indexOf(page) === index
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {uniquePages.map((page, index) => {
        if (typeof page === "string") {
          return (
            <Button key={page} variant="ghost" size="sm" disabled>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          );
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={currentPage === page ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
