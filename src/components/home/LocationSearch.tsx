'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ArrowRight, Sparkles } from 'lucide-react';

export default function LocationSearch() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Indiranagar, Bengaluru');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/restaurants?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/restaurants');
    }
  };

  const trendingTags = [
    'Truffle Burger',
    'Vanilla Mille-Feuille',
    'Burrata Pizza',
    'Tahitian Cruffin',
    'Truffle Frites',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-30">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-luxury border border-vanilla-caramel/30">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          
          {/* Location picker */}
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-vanilla-cream/70 border border-vanilla-caramel/20 md:w-1/3">
            <MapPin className="w-4 h-4 text-vanilla-caramel-dark flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-500">
                Delivery Area
              </span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-vanilla-espresso focus:outline-none truncate"
                placeholder="Enter area..."
              />
            </div>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-vanilla-cream/70 border border-vanilla-caramel/20 flex-1">
            <Search className="w-4 h-4 text-vanilla-caramel flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-500">
                Search Haute Cuisine
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Dishes, artisanal bakeries, wood-fired..."
                className="w-full bg-transparent text-xs font-semibold text-vanilla-espresso placeholder-gray-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-vanilla-espresso hover:bg-vanilla-chocolate text-vanilla-cream font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-soft-glow transition-all active:scale-95"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4 text-vanilla-peach" />
          </button>
        </form>

        {/* Quick Trending tags */}
        <div className="mt-3.5 pt-3 border-t border-vanilla-caramel/15 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-vanilla-caramel-dark flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-vanilla-caramel" />
            Popular:
          </span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => router.push(`/restaurants?search=${encodeURIComponent(tag)}`)}
              className="text-xs bg-vanilla-cream/80 hover:bg-vanilla-ivory px-3 py-1 rounded-full border border-vanilla-caramel/20 text-vanilla-chocolate font-medium transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

