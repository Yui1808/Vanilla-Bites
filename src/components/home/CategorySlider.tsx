'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: string;
}

const categories: CategoryItem[] = [
  {
    id: '1',
    name: 'Artisan Pâtisserie',
    slug: 'desserts',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop',
    count: '18 Creations',
  },
  {
    id: '2',
    name: 'Gourmet Burgers',
    slug: 'burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop',
    count: '14 Varieties',
  },
  {
    id: '3',
    name: 'Wood-Fired Pizza',
    slug: 'italian',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=600&fit=crop',
    count: '12 Pies',
  },
  {
    id: '4',
    name: 'Pan-Asian & Dim Sum',
    slug: 'chinese',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&h=600&fit=crop',
    count: '22 Dishes',
  },
  {
    id: '5',
    name: 'Botanical Elixirs',
    slug: 'beverages',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&h=600&fit=crop',
    count: '9 Brews',
  },
  {
    id: '6',
    name: 'Royal Mughlai & Indian',
    slug: 'indian',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=600&fit=crop',
    count: '16 Specialties',
  },
];

export default function CategorySlider() {
  return (
    <section id="categories" className="py-20 bg-vanilla-ivory/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-vanilla-caramel-dark block mb-2">
              Culinary Archetypes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-black text-vanilla-espresso">
              Curated Gastronomy Categories
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-vanilla-chocolate/70 max-w-md mt-3 md:mt-0 leading-relaxed">
            From hand-laminated Bourbon vanilla doughs to 48-hour slow-fermented Neapolitan sourdough.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/restaurants?cuisine=${cat.slug}`}
              className="group relative rounded-3xl overflow-hidden bg-white border border-vanilla-caramel/20 shadow-sm hover:shadow-luxury transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Image container */}
              <div className="relative aspect-square w-full overflow-hidden bg-vanilla-cream">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-vanilla-espresso/80 via-vanilla-espresso/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                
                <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/80 group-hover:bg-vanilla-caramel text-vanilla-espresso group-hover:text-white flex items-center justify-center transition-colors shadow-sm">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-vanilla-peach">
                    {cat.count}
                  </p>
                  <h3 className="font-serif text-sm font-bold leading-tight drop-shadow-sm">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

