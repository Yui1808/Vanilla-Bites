'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import CustomizationModal, { ModalMenuItem } from '@/components/restaurant/CustomizationModal';
import { CartRestaurantInfo } from '@/types';
import { Plus, Flame, Clock, Sparkles } from 'lucide-react';

export interface TrendingDishData {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  isVeg: boolean;
  preparationTime: number;
  spicyLevel: string;
  restaurant: CartRestaurantInfo;
  customizationGroups?: any[];
}

interface TrendingDishesProps {
  dishes: TrendingDishData[];
}

export default function TrendingDishes({ dishes }: TrendingDishesProps) {
  const { addItem } = useCart();
  const [activeModalItem, setActiveModalItem] = useState<{
    dish: ModalMenuItem;
    restaurant: CartRestaurantInfo;
  } | null>(null);

  const handleQuickAdd = (dish: TrendingDishData) => {
    // If dish has customizable options, open modal so user can choose
    if (dish.customizationGroups && dish.customizationGroups.length > 0) {
      setActiveModalItem({
        dish: dish as ModalMenuItem,
        restaurant: dish.restaurant,
      });
    } else {
      // Add directly
      addItem(
        {
          menuItemId: dish.id,
          restaurantId: dish.restaurant.id,
          restaurantName: dish.restaurant.name,
          name: dish.name,
          image: dish.image,
          price: dish.price,
          quantity: 1,
          isVeg: dish.isVeg,
          customizations: [],
        },
        dish.restaurant
      );
    }
  };

  return (
    <section className="py-20 bg-vanilla-ivory/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-vanilla-caramel-dark block mb-2">
            Epicurean Highlights
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-vanilla-espresso mb-3">
            Trending Culinary Masterpieces
          </h2>
          <p className="text-xs sm:text-sm text-vanilla-chocolate/75 leading-relaxed">
            The most coveted dishes ordered across our participating independent restaurants this week.
          </p>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="group bg-white rounded-3xl overflow-hidden border border-vanilla-caramel/20 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col"
            >
              {/* Image & indicators */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-vanilla-cream">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Veg / Non-Veg badge */}
                <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm border border-gray-200">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      dish.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                    }`}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
                    {dish.isVeg ? 'Veg' : 'Non-Veg'}
                  </span>
                </div>

                {/* Restaurant Source Pill */}
                <div className="absolute bottom-3 left-3 bg-vanilla-espresso/90 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-semibold truncate max-w-[80%] border border-vanilla-caramel/25">
                  by {dish.restaurant.name}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-vanilla-espresso mb-1 group-hover:text-vanilla-caramel-dark transition-colors">
                    {dish.name}
                  </h3>
                  <p className="text-xs text-vanilla-chocolate/70 line-clamp-2 leading-relaxed mb-4">
                    {dish.description}
                  </p>
                </div>

                {/* Price and CTA */}
                <div className="pt-4 border-t border-vanilla-caramel/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                      Price
                    </span>
                    <span className="font-serif text-lg font-black text-vanilla-espresso">
                      {formatPrice(dish.price)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleQuickAdd(dish)}
                    className="px-4 py-2.5 rounded-full bg-vanilla-espresso hover:bg-vanilla-chocolate text-vanilla-cream font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-soft-glow transition-all active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 text-vanilla-peach" />
                    <span>
                      {dish.customizationGroups && dish.customizationGroups.length > 0
                        ? 'Customize'
                        : 'Add'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Customization Modal */}
      {activeModalItem && (
        <CustomizationModal
          item={activeModalItem.dish}
          restaurant={activeModalItem.restaurant}
          onClose={() => setActiveModalItem(null)}
        />
      )}
    </section>
  );
}

