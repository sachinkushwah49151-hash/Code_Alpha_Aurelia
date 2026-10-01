import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { formatPrice } from '../utils/formatters';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Keyboard shortcut ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.shortDescriptor.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSelectProduct = (productId) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  const handleSearchAll = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search input form */}
        <form onSubmit={handleSearchAll} className="flex items-center px-5 py-4 border-b border-stone-100">
          <Search className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search audio, lighting, apparel, accessories..."
            className="w-full bg-transparent text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 mr-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 rounded bg-stone-100 text-stone-600 hover:bg-stone-200 cursor-pointer"
          >
            ESC
          </button>
        </form>

        {/* Results / Suggestions */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="py-6 px-2">
              <p className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {['Wireless Headphones', 'Desk Lamp', 'Merino Wool', 'Leather Bag', 'Atmos Soundbar', 'Minimal Watch'].map(
                  (term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="text-xs px-3 py-1.5 rounded-full bg-stone-100 text-neutral-700 hover:bg-neutral-900 hover:text-white transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider font-semibold text-neutral-400 px-3 py-1.5">
                Products ({results.length})
              </p>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg bg-stone-100 border border-stone-200/60 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate group-hover:text-neutral-700">
                      {product.name}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {product.category} • {product.shortDescriptor}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-semibold text-neutral-900">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleSearchAll}
                className="w-full mt-3 flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-xs font-medium text-neutral-700 transition-colors cursor-pointer"
              >
                <span>View all results for &ldquo;{query}&rdquo;</span>
                <span className="flex items-center gap-1 text-neutral-900 font-semibold">
                  Press Enter <CornerDownLeft className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-sm font-medium text-neutral-800">
                No matching products found
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Try searching with a different term like &ldquo;Headphones&rdquo; or &ldquo;Lamp&rdquo;.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
