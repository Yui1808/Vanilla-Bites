'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import {
  ShoppingBag,
  MapPin,
  Search,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  LogOut,
  UtensilsCrossed,
  Shield,
  Clock,
} from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Indiranagar, Bengaluru');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { user, logout } = useAuth();
  const { setIsOpen: setCartOpen, totalItemsCount } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const locations = [
    'Indiranagar, Bengaluru',
    'Koramangala, Bengaluru',
    'Lavelle Road, Bengaluru',
    'Bandra West, Mumbai',
    'Juhu, Mumbai',
    'Connaught Place, New Delhi',
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-vanilla-cream/90 backdrop-blur-md shadow-sm border-b border-vanilla-caramel/20 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-vanilla-espresso flex items-center justify-center text-vanilla-peach shadow-sm group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-vanilla-peach animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-black tracking-tight text-vanilla-espresso leading-none">
                VANILLA BITES
              </span>
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-vanilla-caramel-dark mt-0.5">
                Haute Gastronomy
              </span>
            </div>
          </Link>

          {/* Location Selector */}
          <div className="hidden lg:relative lg:block">
            <button
              onClick={() => setLocationOpen(!locationOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-vanilla-ivory/80 hover:bg-vanilla-ivory border border-vanilla-caramel/25 text-xs font-medium text-vanilla-espresso transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-vanilla-caramel-dark" />
              <span>{currentLocation}</span>
              <ChevronDown className="w-3 h-3 text-gray-500" />
            </button>

            {locationOpen && (
              <div className="absolute top-full left-0 mt-2 w-60 bg-white rounded-2xl shadow-luxury border border-vanilla-caramel/20 py-2 z-50">
                <div className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-vanilla-caramel-dark border-b border-gray-100">
                  Select Delivery Zone
                </div>
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setCurrentLocation(loc);
                      setLocationOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-vanilla-cream/70 transition-colors ${
                      currentLocation === loc
                        ? 'font-bold text-vanilla-espresso bg-vanilla-peach/10'
                        : 'text-vanilla-chocolate'
                    }`}
                  >
                    <span>{loc}</span>
                    {currentLocation === loc && (
                      <span className="w-1.5 h-1.5 rounded-full bg-vanilla-caramel" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              pathname === '/'
                ? 'text-vanilla-caramel-dark'
                : 'text-vanilla-espresso hover:text-vanilla-caramel'
            }`}
          >
            Discover
          </Link>
          <Link
            href="/restaurants"
            className={`text-sm font-semibold tracking-wide transition-colors ${
              pathname === '/restaurants'
                ? 'text-vanilla-caramel-dark'
                : 'text-vanilla-espresso hover:text-vanilla-caramel'
            }`}
          >
            Restaurants
          </Link>
          <Link
            href="/#categories"
            className="text-sm font-semibold tracking-wide text-vanilla-espresso hover:text-vanilla-caramel transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/#offers"
            className="text-sm font-semibold tracking-wide text-vanilla-espresso hover:text-vanilla-caramel transition-colors flex items-center gap-1"
          >
            <span>Offers</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-vanilla-caramel text-white rounded-full font-bold">
              20%
            </span>
          </Link>
        </nav>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <Link
            href="/restaurants"
            className="w-10 h-10 rounded-full flex items-center justify-center text-vanilla-chocolate hover:text-vanilla-espresso hover:bg-vanilla-ivory/80 transition-colors"
            title="Search dishes & restaurants"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative px-4 py-2 rounded-full bg-vanilla-espresso hover:bg-vanilla-chocolate text-vanilla-cream flex items-center gap-2 text-xs font-bold tracking-wider transition-all active:scale-95 shadow-soft-glow"
          >
            <ShoppingBag className="w-4 h-4 text-vanilla-peach" />
            <span className="hidden sm:inline">CART</span>
            {totalItemsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-vanilla-caramel text-white text-[11px] font-bold flex items-center justify-center ml-0.5">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* User Account / Auth */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-vanilla-ivory hover:bg-vanilla-peach/30 border border-vanilla-caramel/30 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-vanilla-espresso text-vanilla-cream flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-vanilla-espresso hidden sm:inline max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-luxury border border-vanilla-caramel/20 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-vanilla-espresso truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-vanilla-peach/30 text-vanilla-chocolate font-semibold uppercase">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-vanilla-espresso hover:bg-vanilla-cream/70 transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-vanilla-caramel" />
                    <span>Customer Dashboard</span>
                  </Link>

                  {user.role === 'RESTAURANT_OWNER' && (
                    <Link
                      href="/restaurant-dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-vanilla-espresso hover:bg-vanilla-cream/70 transition-colors font-medium text-amber-700"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5 text-vanilla-caramel" />
                      <span>Restaurant Portal</span>
                    </Link>
                  )}

                  {user.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-vanilla-espresso hover:bg-vanilla-cream/70 transition-colors font-medium text-purple-700"
                    >
                      <Shield className="w-3.5 h-3.5 text-purple-600" />
                      <span>Admin Console</span>
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-semibold text-vanilla-espresso hover:text-vanilla-caramel transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="hidden sm:inline-block px-4 py-2 rounded-full border border-vanilla-espresso/80 text-vanilla-espresso hover:bg-vanilla-espresso hover:text-vanilla-cream text-xs font-semibold transition-all"
              >
                Join
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-vanilla-espresso hover:bg-vanilla-ivory"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-vanilla-cream border-b border-vanilla-caramel/20 px-6 py-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-vanilla-caramel/15 text-xs text-vanilla-espresso">
            <MapPin className="w-4 h-4 text-vanilla-caramel" />
            <span className="font-semibold">{currentLocation}</span>
          </div>

          <div className="flex flex-col space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-serif font-bold text-vanilla-espresso"
            >
              Discover
            </Link>
            <Link
              href="/restaurants"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-serif font-bold text-vanilla-espresso"
            >
              Restaurants
            </Link>
            <Link
              href="/#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-serif font-bold text-vanilla-espresso"
            >
              Categories
            </Link>
            <Link
              href="/#offers"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-serif font-bold text-vanilla-espresso"
            >
              Special Offers
            </Link>
            {user ? (
              <div className="pt-3 border-t border-vanilla-caramel/15 flex flex-col space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-vanilla-espresso"
                >
                  Customer Dashboard
                </Link>
                {user.role === 'RESTAURANT_OWNER' && (
                  <Link
                    href="/restaurant-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-semibold text-amber-700"
                  >
                    Restaurant Portal
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="text-left text-sm font-semibold text-red-600 pt-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-vanilla-caramel/15 flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center rounded-full border border-vanilla-espresso text-sm font-semibold text-vanilla-espresso"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 text-center rounded-full bg-vanilla-espresso text-sm font-semibold text-vanilla-cream"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

