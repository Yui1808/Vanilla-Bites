'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Star, Clock, Truck, Tag, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export interface RestaurantCardData {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  logo?: string | null;
  cuisine: string;
  rating: number;
  totalReviews: number;
  deliveryFee: number; // paise
  minOrder: number; // paise
  estimatedDeliveryTime: string;
  isOpen: boolean;
  offers?: string;
}

interface FeaturedRestaurantsProps {
  initialRestaurants: RestaurantCardData[];
}

export default function FeaturedRestaurants({
  initialRestaurants,
}: FeaturedRestaurantsProps) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  const filterOptions = [
    { id: 'ALL', label: 'All Curations' },
    { id: 'RATING_48', label: '⭐ 4.8+ Top Rated' },
    { id: 'FAST', label: '⚡ Under 30 Mins' },
    { id: 'BURGER', label: 'Gourmet Burgers' },
    { id: 'DESSERT', label: 'Artisan Pâtisserie' },
    { id: 'PIZZA', label: 'Wood-Fired Pizza' },
  ];

  const filteredRestaurants = initialRestaurants.filter((rest) => {
    if (selectedFilter === 'RATING_48') return rest.rating >= 4.8;
    if (selectedFilter === 'FAST') {
      const minutes = parseInt(rest.estimatedDeliveryTime, 10);
      return !isNaN(minutes) && minutes <= 30;
    }
    if (selectedFilter === 'BURGER') return rest.cuisine.toLowerCase().includes('burger');
    if (selectedFilter === 'DESSERT') return rest.cuisine.toLowerCase().includes('pâtisserie') || rest.cuisine.toLowerCase().includes('dessert');
    if (selectedFilter === 'PIZZA') return rest.cuisine.toLowerCase().includes('pizza');
    return true;
  });

  return (
    <section className="py-20 bg-vanilla-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-vanilla-caramel-dark block mb-2">
              Bespoke Storefronts
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-vanilla-espresso">
              Discover Participating Restaurants
            </h2>
          </div>
          <Link
            href="/restaurants"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-vanilla-caramel-dark hover:text-vanilla-espresso transition-colors mt-3 md:mt-0"
          >
            <span>View All Curations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === filter.id
                  ? 'bg-vanilla-espresso text-vanilla-cream shadow-sm'
                  : 'bg-white/80 hover:bg-vanilla-ivory text-vanilla-chocolate border border-vanilla-caramel/20'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Restaurant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant) => (
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

                {/* Special Offer Badge */}
                <div className="absolute bottom-4 left-4 bg-vanilla-espresso/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-bold flex items-center gap-1.5 border border-vanilla-caramel/30">
                  <Tag className="w-3 h-3 text-vanilla-peach" />
                  <span>20% OFF with code VANILLA20</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-serif text-xl font-bold text-vanilla-espresso group-hover:text-vanilla-caramel-dark transition-colors truncate">
                      {restaurant.name}
                    </h3>
                  </div>

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

      </div>
    </section>
  );
}

