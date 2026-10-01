import React from 'react';
import { Loader2 } from 'lucide-react';

export const ProductCardSkeleton = () => (
  <div className="flex flex-col gap-3 animate-pulse">
    <div className="w-full aspect-[4/5] bg-stone-200/70 rounded-xl" />
    <div className="space-y-2 pt-1">
      <div className="h-3 w-1/4 bg-stone-200 rounded" />
      <div className="h-4 w-3/4 bg-stone-200 rounded" />
      <div className="h-3 w-1/2 bg-stone-200 rounded" />
      <div className="h-4 w-1/3 bg-stone-200 rounded mt-2" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const LoadingSpinner = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <Loader2 className="w-8 h-8 animate-spin text-neutral-900 mb-3" />
    <p className="text-sm text-neutral-500 font-medium tracking-wide">{text}</p>
  </div>
);
