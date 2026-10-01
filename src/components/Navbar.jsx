import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Menu,
  X,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { SearchModal } from './SearchBar';
import { CATEGORIES } from '../data/products';

export const Navbar = () => {
  const { totalItemCount, wishlist, user, setIsCartDrawerOpen, cartPulse } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen((prev) => (prev ? false : prev));
    setCategoriesDropdownOpen((prev) => (prev ? false : prev));
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `text-xs uppercase tracking-[0.16em] font-medium transition-colors hover:text-neutral-950 py-1 ${
      isActive ? 'text-neutral-950 font-semibold border-b-2 border-[#c5a880]' : 'text-neutral-500'
    }`;

  const handleCartClick = (e) => {
    e.preventDefault();
    setIsCartDrawerOpen(true);
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-neutral-950 text-stone-300 text-[11px] font-medium tracking-wider text-center py-2 px-4 flex items-center justify-center gap-3 border-b border-neutral-900">
        <span>Complimentary express delivery on orders over ₹4,999</span>
        <span className="hidden sm:inline text-neutral-700">•</span>
        <span className="hidden sm:inline text-white font-semibold">
          Use code: <span className="underline decoration-[#c5a880] font-mono text-[#ecd5b3]">AURELIA10</span> for 10% off
        </span>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white/92 backdrop-blur-md border-stone-200/90 shadow-sm py-3.5'
            : 'bg-[#faf8f5]/95 backdrop-blur-md border-stone-200/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <NavLink to="/shop" className={navLinkClass}>
                Shop
              </NavLink>

              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                onMouseLeave={() => setCategoriesDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                  className="flex items-center gap-1 text-xs uppercase tracking-[0.16em] font-medium text-neutral-500 hover:text-neutral-950 transition-colors py-1 cursor-pointer"
                >
                  Categories
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {categoriesDropdownOpen && (
                  <div className="absolute top-full left-0 w-72 pt-2 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl border border-stone-200/90 p-2.5 space-y-1">
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat.id}
                          to={`/shop?category=${cat.id}`}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-stone-50 text-xs font-medium text-neutral-800 transition-colors group"
                        >
                          <div>
                            <p className="font-semibold text-neutral-950 group-hover:text-neutral-700">
                              {cat.name}
                            </p>
                            <p className="text-[10px] text-neutral-400">{cat.itemCount}</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <NavLink to="/shop?sort=newest" className={navLinkClass}>
                New Arrivals
              </NavLink>
              <a
                href="/#editorial-story"
                className="text-xs uppercase tracking-[0.16em] font-medium text-neutral-500 hover:text-neutral-950 transition-colors py-1"
              >
                Editorial
              </a>
            </nav>

            {/* Mobile Left: Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg text-neutral-800 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Center: Brand Wordmark */}
            <div className="flex-1 lg:flex-initial text-center lg:text-left">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 group focus:outline-none"
              >
                <span className="font-bold text-xl sm:text-2xl tracking-[0.3em] uppercase text-neutral-950 font-serif-or-sans group-hover:opacity-85 transition-opacity">
                  AURELIA
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880] group-hover:scale-125 transition-transform" />
              </Link>
            </div>

            {/* Right: Actions (Search, Wishlist, Account, Cart) */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Quick Search Trigger */}
              <button
                type="button"
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-2 p-2 rounded-lg text-neutral-700 hover:text-neutral-950 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Search products"
                title="Search catalog (/)"
              >
                <Search className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                <span className="hidden xl:inline text-xs text-neutral-400 border border-stone-200 rounded px-1.5 py-0.5 font-mono">
                  /
                </span>
              </button>

              {/* Wishlist Link */}
              <Link
                to="/shop"
                className="hidden sm:flex relative p-2 rounded-lg text-neutral-700 hover:text-neutral-950 hover:bg-stone-100 transition-colors"
                title="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </Link>

              {/* Account / Profile Link */}
              <Link
                to={user ? '/profile' : '/login'}
                className="flex items-center gap-1.5 p-2 rounded-lg text-neutral-700 hover:text-neutral-950 hover:bg-stone-100 transition-colors"
                title={user ? `Signed in as ${user.name}` : 'Sign In'}
              >
                <User className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                {user && (
                  <span className="hidden md:inline text-xs font-medium text-neutral-700 max-w-[80px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={handleCartClick}
                className="relative flex items-center gap-2 bg-neutral-900 text-white hover:bg-neutral-800 transition-all px-3 py-2 rounded-xl text-xs font-medium cursor-pointer shadow-sm hover:shadow"
                aria-label="View shopping bag"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden xs:inline">Bag</span>
                <span
                  className={`flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#c5a880] text-neutral-950 text-[10px] font-bold transition-transform duration-300 ${
                    cartPulse ? 'scale-130' : 'scale-100'
                  }`}
                >
                  {totalItemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-neutral-950/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl z-10 flex flex-col justify-between overflow-y-auto">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between p-5 border-b border-stone-100">
                <Link
                  to="/"
                  className="font-bold text-lg tracking-[0.28em] uppercase text-neutral-950 flex items-center gap-1.5"
                >
                  AURELIA
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:bg-stone-100"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Shortcut */}
              <div className="p-4 border-b border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-stone-100 text-neutral-500 text-xs font-medium cursor-pointer text-left"
                >
                  <Search className="w-4 h-4 text-neutral-400" />
                  <span>Search objects...</span>
                </button>
              </div>

              {/* Links */}
              <div className="p-5 space-y-4">
                <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                  Navigation
                </p>
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/"
                    className="text-base font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    to="/shop"
                    className="text-base font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
                  >
                    All Products
                  </Link>
                  <Link
                    to="/shop?sort=newest"
                    className="text-base font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
                  >
                    New Arrivals
                  </Link>
                  <Link
                    to="/orders"
                    className="text-base font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
                  >
                    My Orders
                  </Link>
                  <Link
                    to={user ? '/profile' : '/login'}
                    className="text-base font-medium text-neutral-900 hover:text-neutral-600 transition-colors"
                  >
                    {user ? 'My Profile' : 'Sign In / Register'}
                  </Link>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-3">
                    Categories
                  </p>
                  <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${cat.id}`}
                        className="flex items-center justify-between text-sm text-neutral-700 py-1 hover:text-neutral-950"
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-neutral-400">{cat.itemCount}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer / Account status */}
            <div className="p-5 border-t border-stone-100 bg-[#faf8f5]">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-neutral-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="text-xs font-medium text-neutral-900 underline ml-2"
                  >
                    Profile
                  </Link>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    className="flex-1 py-2 px-3 text-center text-xs font-semibold rounded-lg bg-neutral-900 text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 py-2 px-3 text-center text-xs font-semibold rounded-lg border border-stone-300 text-neutral-800 bg-white"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
};
