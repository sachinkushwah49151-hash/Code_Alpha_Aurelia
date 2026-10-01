import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { formatPrice, calculateDiscountPercent } from '../utils/formatters';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingState';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'features' | 'shipping'
  const [isAdding, setIsAdding] = useState(false);

  useDocumentTitle(product ? product.name : 'Product Details');

  const isWishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setQuantity(1);

    api
      .getProductById(id)
      .then((data) => {
        if (isMounted) {
          setProduct(data);
          setSelectedImage(data.image);
          if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0].name);
          }
          setIsLoading(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      })
      .catch((err) => {
        console.error('Failed to load product details:', err);
        if (isMounted) {
          setProduct(null);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner text="Loading product specifications..." />;
  }

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">Object Not Found</h2>
        <p className="text-sm text-neutral-500">
          The requested product may have been archived or is temporarily unavailable.
        </p>
        <Link to="/shop">
          <Button variant="primary">Return to Catalog</Button>
        </Link>
      </div>
    );
  }

  const discount = calculateDiscountPercent(product.price, product.originalPrice);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity, selectedColor);
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    navigate('/checkout');
  };

  const galleryImages = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-stone-500 mb-8 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-neutral-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <Link to="/shop" className="hover:text-neutral-900 transition-colors">
          Shop
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <Link
          to={`/shop?category=${product.categoryId || product.category.toLowerCase()}`}
          className="hover:text-neutral-900 transition-colors capitalize"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        <span className="text-neutral-900 font-medium truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* LEFT COLUMN: Gallery (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Hero Image */}
          <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-sm">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-500"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badge && (
                <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded bg-neutral-900 text-white backdrop-blur-md shadow-sm">
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded bg-amber-500 text-white shadow-sm">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Floating Wishlist Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md backdrop-blur-sm ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-white/90 text-stone-600 hover:text-neutral-900 hover:bg-white'
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>
          </div>

          {/* Thumbnail Gallery Strip */}
          {galleryImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-stone-100 ${
                    selectedImage === img
                      ? 'border-neutral-900 shadow-sm ring-1 ring-neutral-900'
                      : 'border-transparent hover:border-stone-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Product Details & Purchase Form (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Title */}
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
              <span className="uppercase tracking-[0.2em] font-semibold text-stone-500">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-xs text-neutral-900">{product.rating}</span>
                <span className="text-stone-400 text-[11px]">({product.reviews} reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-neutral-950 tracking-tight leading-tight">
              {product.name}
            </h1>

            {product.shortDescriptor && (
              <p className="text-xs sm:text-sm text-stone-500 font-normal mt-1">
                {product.shortDescriptor}
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-stone-200">
            <span className="text-2xl sm:text-3xl font-bold text-neutral-950">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm sm:text-base text-stone-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              In Stock & Ready to Ship
            </span>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Available Colors / Finishes Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold uppercase tracking-wider text-neutral-900">
                  Finish: <span className="font-normal text-stone-600">{selectedColor}</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`group relative flex items-center gap-2 p-1.5 rounded-full border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-neutral-900 ring-2 ring-neutral-900/10'
                          : 'border-transparent hover:border-stone-300'
                      }`}
                      title={color.name}
                    >
                      <span
                        className="w-6 h-6 rounded-full border border-stone-300 shadow-inner flex items-center justify-center"
                        style={{ backgroundColor: color.hex }}
                      >
                        {isSelected && (
                          <Check
                            className={`w-3 h-3 ${
                              ['#ffffff', '#f4f4f5', '#ded6c9', '#f0ece1', '#e2d9cc'].includes(
                                color.hex.toLowerCase()
                              )
                                ? 'text-neutral-900'
                                : 'text-white'
                            }`}
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector & CTAs */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-900">
                Quantity
              </span>
              <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-xs font-semibold text-neutral-900 select-none">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  disabled={quantity >= (product.stock || 10)}
                  className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[11px] text-stone-400">
                Max {product.stock || 10} units per order
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                isLoading={isAdding}
                fullWidth
                icon={ShoppingBag}
              >
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleBuyNow}
                fullWidth
                className="bg-stone-100 hover:bg-stone-200"
              >
                Buy Now
              </Button>
            </div>
          </div>

          {/* Trust Value Props (Minimal) */}
          <div className="space-y-3 pt-4 border-t border-stone-200 text-xs text-neutral-600">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-stone-500 shrink-0" />
              <span>Complimentary insured shipping on this item</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-stone-500 shrink-0" />
              <span>30-Day risk-free trial with pre-paid return label</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-stone-500 shrink-0" />
              <span>2-Year comprehensive manufacturer warranty included</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          ACCORDION / TABBED SECTION: Specs, Features, Delivery
      ======================================================== */}
      <div className="mt-16 sm:mt-24 border-t border-stone-200 pt-10">
        <div className="flex border-b border-stone-200 gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-3 text-xs sm:text-sm uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
              activeTab === 'specs'
                ? 'border-b-2 border-neutral-900 text-neutral-950'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Technical Specifications
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('features')}
            className={`pb-3 text-xs sm:text-sm uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
              activeTab === 'features'
                ? 'border-b-2 border-neutral-900 text-neutral-950'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Design Highlights
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 text-xs sm:text-sm uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
              activeTab === 'shipping'
                ? 'border-b-2 border-neutral-900 text-neutral-950'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            Shipping & Returns
          </button>
        </div>

        <div className="py-8">
          {activeTab === 'specs' && product.specifications && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 max-w-3xl">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-stone-100 text-xs sm:text-sm">
                  <span className="text-neutral-500 font-medium">{key}</span>
                  <span className="text-neutral-900 font-semibold text-right">{value}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'features' && product.features && (
            <div className="space-y-3 max-w-2xl">
              {product.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-700">
                  <span className="p-1 rounded-full bg-stone-100 text-neutral-900 mt-0.5 shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-2xl text-xs sm:text-sm text-neutral-600 leading-relaxed">
              <p>
                All orders are dispatched from our climate-controlled fulfillment centers within 24
                hours of confirmation. Delivery times range between 2 to 4 business days across all
                major Indian metropolitan hubs.
              </p>
              <p>
                We offer a 30-day trial period on all NOVA hardware and accessories. If the product
                does not meet your exacting standards, initiate a return from your Account Dashboard
                for a complimentary courier doorstep collection and full refund.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          CUSTOMER REVIEWS SECTION
      ======================================================== */}
      <div className="mt-16 border-t border-stone-200 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-light text-neutral-950">
              Customer <span className="font-semibold">Reviews</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Verified feedback from discerning collectors and studio owners
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-bold text-neutral-900">{product.rating} out of 5</span>
          </div>
        </div>

        {product.reviewsList && product.reviewsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviewsList.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-900">{rev.author}</span>
                  <span className="text-[11px] text-stone-400">{rev.date}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                  {rev.verified && (
                    <span className="ml-2 text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-semibold text-neutral-900 pt-1">{rev.title}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-neutral-400 italic">
            Be the first collector to review this release.
          </p>
        )}
      </div>

      {/* ========================================================
          RELATED PRODUCTS SECTION
      ======================================================== */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="mt-20 border-t border-stone-200 pt-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl sm:text-2xl font-light text-neutral-950">
              You might <span className="font-semibold">also appreciate</span>
            </h3>
            <Link
              to={`/shop?category=${product.category.toLowerCase()}`}
              className="text-xs font-semibold uppercase tracking-wider text-neutral-900 hover:text-neutral-600 flex items-center gap-1"
            >
              <span>More in {product.category}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {product.relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
