import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useState, useEffect } from "react";

/**
 * Reusable search filter component with debouncing
 * @param {string} placeholder - Input placeholder text
 * @param {Function} onSearch - Callback function when search value changes
 * @param {number} delay - Debounce delay in ms (default: 500)
 */
export function SearchFilter({ placeholder = "Search...", onSearch, delay = 500 }) {
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, delay);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
