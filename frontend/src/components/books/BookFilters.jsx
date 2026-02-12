import React from 'react';
import SearchBar from '../common/SearchBar';
import Select from '../ui/Select';
import { BookOpen } from 'lucide-react';

const BookFilters = ({
  searchValue,
  onSearchChange,
  categoryValue,
  onCategoryChange,
  categories = [],
  totalBooks = 0,
  sticky = true,
  className = '',
}) => {
  const categoryOptions = categories.map((cat) => ({
    value: cat,
    label: cat === 'all' ? 'All Genres' : cat,
  }));
  
  const wrapperClasses = sticky
    ? "sticky top-[88px] z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200"
    : "w-full bg-white border border-slate-200 rounded-2xl shadow-sm";

  return (
    <div className={`${wrapperClasses} ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Title Section */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="bg-slate-900 p-1.5 rounded-lg">
                <BookOpen className="text-white" size={18} />
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">
                The Library
              </h1>
            </div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
              {totalBooks} Editions in{' '}
              <span className="text-amber-600 underline decoration-2 underline-offset-4">
                {categoryValue}
              </span>
            </p>
          </div>

          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <SearchBar
              value={searchValue}
              onChange={onSearchChange}
              placeholder="Find your next read..."
              className="w-full sm:w-72"
            />

            <Select
              value={categoryValue}
              onChange={(e) => onCategoryChange(e.target.value)}
              options={categoryOptions}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookFilters;
