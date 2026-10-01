import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  Search,
  X,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { FilterPanel } from '../components/FilterPanel';
import { ProductGridSkeleton } from '../components/LoadingState';
import { Modal } from '../components/Modal';

export const Shop = () => {
  useDocumentTitle('Shop');

  const [searchParams, setSearchParams] = useSearchParams();

  // URL state as single source of truth
  const category = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'featured';

  // Filter states
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minRating, setMinRating] = useState('');

  // Data & loading states
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch products via centralized API layer
  useEffect(() => {
    let isMounted = true;

    const params = {
      category: category !== 'all' ? category : undefined,
      search: searchQuery || undefined,
      sort,
      priceMin: priceRange.min || undefined,
      priceMax: priceRange.max || undefined,
      rating: minRating || undefined,
    };

    api
      .getProducts(params)
      .then((data) => {
        if (isMounted) {
          setProducts(data.results || []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [category, searchQuery, priceRange, minRating, sort]);

  const hasActiveFilters =
    category !== 'all' ||
    searchQuery.trim() !== '' ||
    priceRange.min !== '' ||
    priceRange.max !== '' ||
    minRating !== '' ||
    sort !== 'featured';

  const handleResetFilters = () => {
    setIsLoading(true);
    setPriceRange({ min: '', max: '' });
    setMinRating('');
    setSearchParams({});
  };

  const handleRemoveSearch = () => {
    setIsLoading(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const handleCategoryChange = (newCat) => {
    setIsLoading(true);
    const newParams = new URLSearchParams(searchParams);
    if (newCat && newCat !== 'all') {
      newParams.set('category', newCat);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  const [searchTerm, setSearchTerm] = useState(searchQuery);

  // Sync local searchTerm when URL changes
  useEffect(() => {
    setSearchTerm(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      newParams.set('search', searchTerm.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    handleRemoveSearch();
  };

  const handleSortChange = (newSort) => {
    setIsLoading(true);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', newSort);
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header */}
      <div className="border-b border-stone-200/90 pb-8 mb-8">
        <div className="max-w-2xl">
          <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500">
            Catalog & Archives
          </span>
          <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-neutral-950 mt-1">
            Shop <span className="font-semibold">All</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 font-normal leading-relaxed">
            Every object in our permanent collection is designed with uncompromised material honesty,
            tactile satisfaction, and enduring utility.
          </p>
        </div>

        {/* Search, Filter Toggle & Sort Controls Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-6 border-t border-stone-100">
          {/* Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by keyword (press Enter)..."
              className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-9 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Right Controls: Sort & Mobile Filter Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs font-medium text-neutral-800 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <span className="text-xs text-neutral-400 mr-2 hidden md:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-white border border-stone-200 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-stone-100">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Active:
            </span>

            {category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-neutral-800 text-xs font-medium border border-stone-200">
                Category: {category}
                <button
                  onClick={() => handleCategoryChange('all')}
                  className="hover:text-rose-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-neutral-800 text-xs font-medium border border-stone-200">
                Search: &ldquo;{searchQuery}&rdquo;
                <button
                  onClick={handleRemoveSearch}
                  className="hover:text-rose-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(priceRange.min || priceRange.max) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-neutral-800 text-xs font-medium border border-stone-200">
                Price: {priceRange.min ? `₹${priceRange.min}` : '₹0'} –{' '}
                {priceRange.max ? `₹${priceRange.max}` : 'Max'}
                <button
                  onClick={() => setPriceRange({ min: '', max: '' })}
                  className="hover:text-rose-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {minRating && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-neutral-800 text-xs font-medium border border-stone-200">
                Rating: {minRating}★+
                <button
                  onClick={() => setMinRating('')}
                  className="hover:text-rose-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-xs text-neutral-500 hover:text-neutral-900 underline font-medium ml-1 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Layout: Desktop Sidebar Filters + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 sticky top-28 bg-white rounded-2xl border border-stone-200/90 p-5 shadow-sm">
          <FilterPanel
            category={category}
            setCategory={handleCategoryChange}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minRating={minRating}
            setMinRating={setMinRating}
            sort={sort}
            setSort={handleSortChange}
            onReset={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </aside>

        {/* Products Section */}
        <div className="lg:col-span-3">
          {/* Results count indicator */}
          <div className="flex items-center justify-between mb-5 text-xs text-neutral-500">
            <span>
              Showing <span className="font-semibold text-neutral-900">{products.length}</span>{' '}
              {products.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty Search / Filter State */
            <div className="py-20 px-4 text-center rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-neutral-900">
                  No matching products found
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1">
                  We couldn&apos;t find any objects matching your active criteria. Try broadening
                  your search or resetting the active filters.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <Modal
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        title="Filter & Refine"
        subtitle="Narrow down products by category, price, and specs"
      >
        <FilterPanel
          category={category}
          setCategory={(cat) => {
            handleCategoryChange(cat);
            setMobileFilterOpen(false);
          }}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minRating={minRating}
          setMinRating={setMinRating}
          sort={sort}
          setSort={handleSortChange}
          onReset={() => {
            handleResetFilters();
            setMobileFilterOpen(false);
          }}
          hasActiveFilters={hasActiveFilters}
        />
        <div className="mt-6 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(false)}
            className="w-full py-3 rounded-xl bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider"
          >
            Show {products.length} Results
          </button>
        </div>
      </Modal>
    </div>
  );
};
