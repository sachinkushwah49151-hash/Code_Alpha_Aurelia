import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, CornerDownLeft, History, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/products';
import { formatPrice } from '../utils/formatters';

const RECENT_SEARCHES_KEY = 'nova_recent_searches';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      setRecentSearches([]);
    }
  }, [isOpen]);

  const saveRecentSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore localStorage quota errors
    }
  };

  const removeRecentSearch = (e, term) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
      setSelectedIndex(-1);
    } else {
      setQuery('');
      setSelectedIndex(-1);
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Filter products
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.shortDescriptor.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results.length, onClose]);

  const handleSelectProduct = (product) => {
    saveRecentSearch(product.name);
    onClose();
    navigate(`/product/${product.id}`);
  };

  const handleSearchTerm = (term) => {
    saveRecentSearch(term);
    onClose();
    navigate(`/shop?search=${encodeURIComponent(term)}`);
  };

  const handleCategorySelect = (category) => {
    onClose();
    navigate(`/shop?category=${encodeURIComponent(category)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && results[selectedIndex]) {
      handleSelectProduct(results[selectedIndex]);
    } else if (query.trim()) {
      handleSearchTerm(query.trim());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-10"
          >
            {/* Search input form */}
            <form onSubmit={handleSubmit} className="flex items-center px-5 py-4 border-b border-stone-100 bg-stone-50/50">
              <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, categories, styles (e.g. Headphones, Lamp, Wool)..."
                className="w-full bg-transparent text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 mr-2 transition-colors cursor-pointer"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="text-[11px] font-semibold tracking-wider px-2 py-1 rounded bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors cursor-pointer"
              >
                ESC
              </button>
            </form>

            {/* Content Body */}
            <div ref={listRef} className="p-4 max-h-[65vh] overflow-y-auto divide-y divide-stone-100">
              {query.trim() === '' ? (
                <div className="space-y-5 py-2">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between px-2 mb-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          <History className="w-3.5 h-3.5" />
                          <span>Recent Searches</span>
                        </div>
                        <button
                          type="button"
                          onClick={clearAllRecent}
                          className="text-[11px] text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 px-1">
                        {recentSearches.map((term) => (
                          <div
                            key={term}
                            onClick={() => handleSearchTerm(term)}
                            className="group inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-neutral-700 hover:text-neutral-900 transition-colors cursor-pointer"
                          >
                            <span>{term}</span>
                            <span
                              onClick={(e) => removeRecentSearch(e, term)}
                              className="p-0.5 rounded-full hover:bg-stone-300 text-neutral-400 hover:text-neutral-800 transition-colors"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Searches */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 px-2 mb-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Trending Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2 px-1">
                      {[
                        'Aero X1 Headphones',
                        'Lumina Desk Lamp',
                        'Merino Knit Sweater',
                        'Minimal Leather Weekender',
                        'Spatial Audio Soundbar',
                        'Chronos Minimalist Watch',
                      ].map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleSearchTerm(term)}
                          className="text-xs px-3 py-1.5 rounded-full bg-stone-100 text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Browse by Category */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400 px-2 mb-2.5">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Browse Categories</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-1">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategorySelect(cat)}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-100 text-left transition-colors cursor-pointer group"
                        >
                          <span className="text-xs font-medium text-neutral-800 group-hover:text-neutral-950">
                            {cat}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1 pt-2">
                  <div className="flex items-center justify-between px-3 py-1 text-xs uppercase tracking-wider font-semibold text-neutral-400">
                    <span>Products ({results.length})</span>
                    <span className="text-[10px] text-neutral-400 font-normal normal-case">
                      Use ↑ ↓ to navigate, Enter to select
                    </span>
                  </div>

                  {results.map((product, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={product.id}
                        onClick={() => handleSelectProduct(product)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center gap-3.5 p-3 rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-neutral-900 text-white shadow-sm'
                            : 'hover:bg-stone-50 text-neutral-900'
                        }`}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg bg-stone-100 border border-stone-200/60 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium truncate ${
                              isSelected ? 'text-white' : 'text-neutral-900'
                            }`}
                          >
                            {product.name}
                          </p>
                          <p
                            className={`text-xs truncate ${
                              isSelected ? 'text-neutral-300' : 'text-neutral-500'
                            }`}
                          >
                            {product.category} • {product.shortDescriptor}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span
                            className={`text-sm font-semibold ${
                              isSelected ? 'text-white' : 'text-neutral-900'
                            }`}
                          >
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full mt-3 flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-xs font-medium text-neutral-700 transition-colors cursor-pointer border border-stone-200/50"
                  >
                    <span>View all catalog results for &ldquo;{query}&rdquo;</span>
                    <span className="flex items-center gap-1.5 text-neutral-900 font-semibold">
                      Press Enter <CornerDownLeft className="w-3.5 h-3.5" />
                    </span>
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-stone-100 flex items-center justify-center text-neutral-400">
                    <Search className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-neutral-900">
                    No matching products for &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                    Try checking spelling or exploring popular categories like Electronics or Accessories.
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSearchTerm('Headphones')}
                      className="text-xs px-3 py-1.5 rounded-full bg-stone-100 text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
                    >
                      Headphones
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSearchTerm('Lamp')}
                      className="text-xs px-3 py-1.5 rounded-full bg-stone-100 text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
                    >
                      Lamp
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSearchTerm('Leather')}
                      className="text-xs px-3 py-1.5 rounded-full bg-stone-100 text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
                    >
                      Leather
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Quick hint */}
            <div className="px-5 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 font-mono text-[10px] text-neutral-700">↑↓</kbd>
                to navigate
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 font-mono text-[10px] text-neutral-700">↵</kbd>
                to select
              </span>
              <span className="flex items-center gap-2">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-stone-200 font-mono text-[10px] text-neutral-700">ESC</kbd>
                to dismiss
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
