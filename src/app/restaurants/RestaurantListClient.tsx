'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import {
  Search,
  Star,
  Clock,
  Truck,
  Filter,
  Check,
  Tag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface RestaurantItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  logo?: string | null;
  cuisine: string;
  rating: number;
  totalReviews: number;
  deliveryFee: number;
  minOrder: number;
  estimatedDeliveryTime: string;
  isOpen: boolean;
  hasVegOnly: boolean;
}

interface Props {
  restaurants: RestaurantItem[];
  initialSearch?: string;
  initialCuisine?: string;
}

export default function RestaurantListClient({
  restaurants,
  initialSearch = '',
  initialCuisine = '',
}: Props) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [under30Min, setUnder30Min] = useState(false);
  const [maxFee, setMaxFee] = useState<number | null>(null);

  const cuisineOptions = [
    { label: 'All Cuisines', value: '' },
    { label: 'Gourmet Burgers', value: 'burger' },
    { label: 'Artisan Pâtisserie', value: 'dessert' },
    { label: 'Wood-Fired Pizza', value: 'pizza' },
    { label: 'Pan-Asian & Dim Sum', value: 'asian' },
    { label: 'Botanical Elixirs', value: 'coffee' },
  ];

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      // Search matching name, cuisine or description
      if (search.trim()) {
        const query = search.toLowerCase();
        const matches =
          r.name.toLowerCase().includes(query) ||
          r.cuisine.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Cuisine filter
      if (selectedCuisine) {
        if (!r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase())) {
          return false;
        }
      }

      // Rating filter
      if (minRating !== null && r.rating < minRating) {
        return false;
      }

      // Only open
      if (onlyOpen && !r.isOpen) {
        return false;
      }

      // Under 30 min
      if (under30Min) {
        const minVal = parseInt(r.estimatedDeliveryTime, 10);
        if (isNaN(minVal) || minVal > 30) return false;
      }

      // Max fee
      if (maxFee !== null && r.deliveryFee > maxFee) {
        return false;
      }

      return true;
    });
  }, [restaurants, search, selectedCuisine, minRating, onlyOpen, under30Min, maxFee]);

  return (
    <div className="space-y-8">
      {/* Top Filter Bar */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-vanilla-caramel/25 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by restaurant name, cuisine or dish..."
              className="w-full bg-vanilla-cream/70 border border-vanilla-caramel/25 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-vanilla-espresso placeholder-gray-400 focus:outline-none focus:border-vanilla-caramel"
            />
          </div>

          {/* Cuisine selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {cuisineOptions.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedCuisine(c.value)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCuisine === c.value
                    ? 'bg-vanilla-espresso text-vanilla-cream'
                    : 'bg-vanilla-cream/60 hover:bg-vanilla-ivory text-vanilla-chocolate border border-vanilla-caramel/20'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Toggles */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-gray-100 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-vanilla-caramel-dark mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-vanilla-caramel" />
            Quick Filters:
          </span>

          <button
            onClick={() => setMinRating((prev) => (prev === 4.8 ? null : 4.8))}
            className={`px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1 ${
              minRating === 4.8
                ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                : 'bg-vanilla-cream/60 border-vanilla-caramel/20 text-vanilla-chocolate hover:bg-white'
            }`}
          >
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>4.8+ Rated</span>
          </button>

          <button
            onClick={() => setUnder30Min((prev) => !prev)}
            className={`px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1 ${
              under30Min
                ? 'bg-vanilla-espresso text-vanilla-cream font-bold'
                : 'bg-vanilla-cream/60 border-vanilla-caramel/20 text-vanilla-chocolate hover:bg-white'
            }`}
          >
            <Clock className="w-3 h-3 text-vanilla-caramel" />
            <span>⚡ &lt;30 Mins Express</span>
          </button>

          <button
            onClick={() => setOnlyOpen((prev) => !prev)}
            className={`px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1 ${
              onlyOpen
                ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                : 'bg-vanilla-cream/60 border-vanilla-caramel/20 text-vanilla-chocolate hover:bg-white'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Open Now</span>
          </button>

          {(search || selectedCuisine || minRating || onlyOpen || under30Min) && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCuisine('');
                setMinRating(null);
                setOnlyOpen(false);
                setUnder30Min(false);
                setMaxFee(null);
              }}
              className="text-xs text-red-500 hover:underline font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-vanilla-chocolate/75 px-1">
        <span>
          Showing <strong>{filtered.length}</strong> artisan restaurants
        </span>
        <span className="text-[11px] text-gray-500">
          Sorted by Michelin & Guest Rating
        </span>
      </div>

      {/* Restaurant Cards Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white/60 rounded-3xl border border-vanilla-caramel/20 p-8">
          <div className="w-16 h-16 rounded-full bg-vanilla-ivory flex items-center justify-center mx-auto mb-4 text-vanilla-caramel">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-vanilla-espresso mb-1">
            No matching culinary storefronts found
          </h3>
          <p className="text-xs text-vanilla-chocolate/70 max-w-sm mx-auto mb-5">
            Try adjusting your cuisine filters or search term to discover other kitchens.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCuisine('');
              setMinRating(null);
              setOnlyOpen(false);
              setUnder30Min(false);
            }}
            className="px-5 py-2.5 rounded-full bg-vanilla-espresso text-vanilla-cream text-xs font-semibold hover:bg-vanilla-chocolate"
          >
            View All Curations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.slug}`}
              className="group rounded-3xl overflow-hidden bg-white border border-vanilla-caramel/20 shadow-sm hover:shadow-luxury transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Cover Image & Badges */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-vanilla-ivory">
                <Image
                  src={restaurant.coverImage}
                  alt={restaurant.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-vanilla-espresso shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{restaurant.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-gray-400 font-normal">
                    ({restaurant.totalReviews})
                  </span>
                </div>

                {/* Open/Closed Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-vanilla-espresso">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      restaurant.isOpen ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                  />
                  <span>{restaurant.isOpen ? 'Open Now' : 'Closed'}</span>
                </div>

                {/* Offer Pill */}
                <div className="absolute bottom-4 left-4 bg-vanilla-espresso/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1.5 border border-vanilla-caramel/30">
                  <Tag className="w-3 h-3 text-vanilla-peach" />
                  <span>Code: VANILLA20 (20% OFF)</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-vanilla-espresso group-hover:text-vanilla-caramel-dark transition-colors mb-1 truncate">
                    {restaurant.name}
                  </h3>

                  <p className="text-xs text-vanilla-caramel-dark font-medium mb-3">
                    {restaurant.cuisine}
                  </p>

                  <p className="text-xs text-vanilla-chocolate/75 line-clamp-2 leading-relaxed mb-4">
                    {restaurant.description}
                  </p>
                </div>

                {/* Footer Metrics */}
                <div className="pt-4 border-t border-vanilla-caramel/15 flex items-center justify-between text-xs text-vanilla-chocolate/80">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-vanilla-caramel" />
                    <span>{restaurant.estimatedDeliveryTime}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-vanilla-caramel" />
                    <span>
                      {restaurant.deliveryFee === 0
                        ? 'Free Dispatch'
                        : `${formatPrice(restaurant.deliveryFee)} Dispatch`}
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold text-gray-500">
                    Min {formatPrice(restaurant.minOrder)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

