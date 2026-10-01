import React from 'react';
import { CATEGORIES } from '../data/products';
import { RotateCcw, Check } from 'lucide-react';

export const FilterPanel = ({
  category,
  setCategory,
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  inStockOnly = false,
  setInStockOnly = () => {},
  onReset,
  hasActiveFilters,
  className = '',
}) => {
  const priceOptions = [
    { label: 'All Prices', min: '', max: '' },
    { label: 'Under ₹3,000', min: '', max: '3000' },
    { label: '₹3,000 – ₹8,000', min: '3000', max: '8000' },
    { label: '₹8,000 – ₹15,000', min: '8000', max: '15000' },
    { label: 'Above ₹15,000', min: '15000', max: '' },
  ];

  const ratingOptions = [
    { label: 'All Ratings', value: '' },
    { label: '4.8★ & above', value: '4.8' },
    { label: '4.5★ & above', value: '4.5' },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Active Filter Header & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-200">
        <span className="text-xs uppercase tracking-wider font-bold text-neutral-900">
          Filters
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-950 font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset all
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2.5">
          Category
        </h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`w-full flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer ${
              category === 'all'
                ? 'bg-neutral-900 text-white font-medium'
                : 'text-neutral-600 hover:bg-stone-100 hover:text-neutral-900'
            }`}
          >
            <span>All Categories</span>
            {category === 'all' && <Check className="w-3.5 h-3.5" />}
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = category.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`w-full flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white font-medium'
                    : 'text-neutral-600 hover:bg-stone-100 hover:text-neutral-900'
                }`}
              >
                <span>{cat.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2.5">
          Price Range
        </h4>
        <div className="space-y-1">
          {priceOptions.map((opt, idx) => {
            const isSelected =
              priceRange.min === opt.min && priceRange.max === opt.max;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setPriceRange({ min: opt.min, max: opt.max })}
                className={`w-full flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white font-medium'
                    : 'text-neutral-600 hover:bg-stone-100 hover:text-neutral-900'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 className="text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2.5">
          Rating
        </h4>
        <div className="space-y-1">
          {ratingOptions.map((opt, idx) => {
            const isSelected = minRating === opt.value;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setMinRating(opt.value)}
                className={`w-full flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white font-medium'
                    : 'text-neutral-600 hover:bg-stone-100 hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <h4 className="text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2.5">
          Availability
        </h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setInStockOnly(false)}
            className={`w-full flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer ${
              !inStockOnly
                ? 'bg-neutral-900 text-white font-medium'
                : 'text-neutral-600 hover:bg-stone-100 hover:text-neutral-900'
            }`}
          >
            <span>All Items</span>
            {!inStockOnly && <Check className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setInStockOnly(true)}
            className={`w-full flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer ${
              inStockOnly
                ? 'bg-neutral-900 text-white font-medium'
                : 'text-neutral-600 hover:bg-stone-100 hover:text-neutral-900'
            }`}
          >
            <span>In Stock Only</span>
            {inStockOnly && <Check className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
