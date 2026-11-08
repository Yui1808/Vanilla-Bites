'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import CustomizationModal, { ModalMenuItem } from '@/components/restaurant/CustomizationModal';
import {
  Star,
  Clock,
  Truck,
  MapPin,
  ShieldCheck,
  Tag,
  Plus,
  Minus,
  Sparkles,
  Phone,
  Flame,
  Check,
} from 'lucide-react';

interface MenuSection {
  id: string;
  name: string;
  items: Array<{
    id: string;
    name: string;
    slug: string;
    description: string;
    image: string;
    price: number;
    isVeg: boolean;
    isAvailable: boolean;
    preparationTime: number;
    spicyLevel: string;
    customizationGroups: any[];
  }>;
}

interface ReviewItem {
  id: string;
  userName: string;
  userAvatar?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Props {
  restaurant: {
    id: string;
    slug: string;
    name: string;
    description: string;
    coverImage: string;
    logo?: string | null;
    phone: string;
    email: string;
    address: string;
    openingHours: string;
    deliveryFee: number;
    minOrder: number;
    estimatedDeliveryTime: string;
    cuisine: string;
    rating: number;
    totalReviews: number;
    isOpen: boolean;
  };
  menuSections: MenuSection[];
  reviews: ReviewItem[];
}

export default function StorefrontClient({ restaurant, menuSections, reviews }: Props) {
  const { items, addItem, updateQuantity } = useCart();
  const [vegOnly, setVegOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState(menuSections[0]?.id || '');
  const [customizingItem, setCustomizingItem] = useState<ModalMenuItem | null>(null);

  const restaurantInfo = {
    id: restaurant.id,
    name: restaurant.name,
    slug: restaurant.slug,
    deliveryFee: restaurant.deliveryFee,
    minOrder: restaurant.minOrder,
  };

  const handleItemClick = (dish: any) => {
    if (dish.customizationGroups && dish.customizationGroups.length > 0) {
      setCustomizingItem(dish);
    } else {
      addItem(
        {
          menuItemId: dish.id,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          name: dish.name,
          image: dish.image,
          price: dish.price,
          quantity: 1,
          isVeg: dish.isVeg,
          customizations: [],
        },
        restaurantInfo
      );
    }
  };

  // Find if an item is already in cart to display count
  const getItemCartQuantity = (dishId: string) => {
    return items
      .filter((i) => i.menuItemId === dishId)
      .reduce((acc, curr) => acc + curr.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-vanilla-cream pb-24">
      {/* 1. RESTAURANT HERO COVER */}
      <div className="relative h-64 sm:h-80 lg:h-96 w-full bg-vanilla-espresso">
        <Image
          src={restaurant.coverImage}
          alt={restaurant.name}
          fill
          priority
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vanilla-cream via-vanilla-espresso/50 to-transparent" />
      </div>

      {/* 2. STOREFRONT IDENTITY CARD */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-10">
        <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-luxury border border-vanilla-caramel/25 flex flex-col lg:flex-row justify-between gap-8">
          
          <div className="space-y-4 max-w-2xl">
            {/* Top row badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-vanilla-peach/30 text-vanilla-chocolate border border-vanilla-caramel/30">
                Independent Culinary Partner
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Self-Delivered Fleet
              </span>
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${restaurant.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {restaurant.isOpen ? 'Open For Orders' : 'Currently Resting'}
              </span>
            </div>

            {/* Title & Cuisine */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-vanilla-espresso leading-tight">
                {restaurant.name}
              </h1>
              <p className="text-sm font-semibold text-vanilla-caramel-dark mt-1">
                {restaurant.cuisine}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-vanilla-chocolate/80 leading-relaxed">
              {restaurant.description}
            </p>

            {/* Address & Hours */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-vanilla-chocolate/75 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-vanilla-caramel" />
                {restaurant.address}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-vanilla-caramel" />
                {restaurant.openingHours}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-vanilla-caramel" />
                {restaurant.phone}
              </span>
            </div>
          </div>

          {/* Right Metrics Box */}
          <div className="flex flex-row lg:flex-col justify-around lg:justify-center items-center lg:items-end gap-4 lg:min-w-[220px] lg:border-l lg:border-vanilla-caramel/20 lg:pl-8">
            {/* Rating pill */}
            <div className="text-center lg:text-right">
              <div className="inline-flex items-center gap-1.5 bg-vanilla-ivory px-3.5 py-1.5 rounded-full border border-vanilla-caramel/30 text-vanilla-espresso font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{restaurant.rating.toFixed(1)}</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                {restaurant.totalReviews} Verified Foodies
              </p>
            </div>

            {/* Delivery time */}
            <div className="text-center lg:text-right">
              <span className="font-serif text-lg font-bold text-vanilla-espresso block">
                {restaurant.estimatedDeliveryTime}
              </span>
              <p className="text-[11px] text-gray-500">
                Delivery Duration
              </p>
            </div>

            {/* Delivery Fee */}
            <div className="text-center lg:text-right">
              <span className="font-serif text-lg font-bold text-vanilla-caramel-dark block">
                {restaurant.deliveryFee === 0 ? 'Free' : formatPrice(restaurant.deliveryFee)}
              </span>
              <p className="text-[11px] text-gray-500">
                Restaurant Dispatch Fee
              </p>
            </div>
          </div>

        </div>

        {/* Special Offer Alert Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-vanilla-espresso text-vanilla-cream flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-vanilla-caramel/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-vanilla-caramel text-vanilla-espresso flex items-center justify-center font-bold">
              <Tag className="w-4 h-4 text-vanilla-espresso" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Exclusive Storefront Tasting Offer
              </p>
              <p className="text-[11px] text-vanilla-peach">
                Get 20% off with code <strong className="font-mono text-white">VANILLA20</strong> on orders over ₹400
              </p>
            </div>
          </div>
          <span className="text-[11px] uppercase font-bold tracking-wider px-3 py-1 bg-vanilla-cream/10 rounded-full border border-vanilla-caramel/30">
            Min Order {formatPrice(restaurant.minOrder)}
          </span>
        </div>

        {/* 3. STICKY CATEGORY NAV & FILTERS */}
        <div className="sticky top-20 z-30 bg-vanilla-cream/95 backdrop-blur-md py-4 my-8 border-y border-vanilla-caramel/20 flex items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none flex-1">
            {menuSections.map((sec) => (
              <a
                key={sec.id}
                href={`#sec-${sec.id}`}
                onClick={() => setActiveCategory(sec.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === sec.id
                    ? 'bg-vanilla-espresso text-vanilla-cream shadow-sm'
                    : 'bg-white/80 hover:bg-vanilla-ivory text-vanilla-chocolate border border-vanilla-caramel/20'
                }`}
              >
                {sec.name} ({sec.items.length})
              </a>
            ))}
          </div>

          {/* Veg Only Toggle */}
          <button
            onClick={() => setVegOnly(!vegOnly)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-colors flex-shrink-0 ${
              vegOnly
                ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="w-3.5 h-3.5 rounded border border-emerald-600 flex items-center justify-center p-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            </div>
            <span>Pure Veg Only</span>
          </button>
        </div>

        {/* 4. MENU ITEMS BY CATEGORY */}
        <div className="space-y-14">
          {menuSections.map((section) => {
            const filteredItems = section.items.filter((item) =>
              vegOnly ? item.isVeg : true
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={section.id} id={`sec-${section.id}`} className="scroll-mt-36">
                <div className="flex items-center justify-between pb-3 mb-6 border-b border-vanilla-caramel/20">
                  <h2 className="font-serif text-2xl font-bold text-vanilla-espresso">
                    {section.name}
                  </h2>
                  <span className="text-xs text-vanilla-chocolate/70">
                    {filteredItems.length} dishes
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredItems.map((dish) => {
                    const cartQty = getItemCartQuantity(dish.id);
                    return (
                      <div
                        key={dish.id}
                        className="bg-white rounded-3xl p-5 border border-vanilla-caramel/20 shadow-sm hover:shadow-luxury transition-all flex justify-between gap-4"
                      >
                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            {/* Veg / Non-veg indicator */}
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-4 h-4 rounded border border-gray-300 p-0.5 flex items-center justify-center">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    dish.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                                  }`}
                                />
                              </div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                {dish.isVeg ? 'Veg' : 'Non-Veg'}
                              </span>
                              {dish.customizationGroups.length > 0 && (
                                <span className="text-[10px] px-2 py-0.2 bg-vanilla-ivory text-vanilla-caramel-dark rounded-full font-bold border border-vanilla-caramel/20">
                                  Customizable
                                </span>
                              )}
                            </div>

                            <h3 className="font-serif text-lg font-bold text-vanilla-espresso mb-1">
                              {dish.name}
                            </h3>

                            <p className="font-mono text-sm font-bold text-vanilla-espresso mb-2">
                              {formatPrice(dish.price)}
                            </p>

                            <p className="text-xs text-vanilla-chocolate/75 line-clamp-2 leading-relaxed">
                              {dish.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-vanilla-caramel" />
                              {dish.preparationTime}m
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Flame className="w-3 h-3 text-amber-600" />
                              {dish.spicyLevel}
                            </span>
                          </div>
                        </div>

                        {/* Image & Add Button */}
                        <div className="relative w-32 sm:w-36 flex-shrink-0 flex flex-col items-center">
                          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-vanilla-ivory shadow-inner">
                            <Image
                              src={dish.image}
                              alt={dish.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Add button overlayed at bottom */}
                          <div className="-mt-4 relative z-10">
                            {cartQty > 0 ? (
                              <div className="flex items-center gap-2 bg-vanilla-espresso text-white rounded-full px-3 py-1.5 shadow-md border border-vanilla-caramel/30 text-xs font-bold">
                                <button
                                  onClick={() => handleItemClick(dish)}
                                  className="hover:text-vanilla-peach transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                                <span className="w-4 text-center">{cartQty}</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleItemClick(dish)}
                                className="px-5 py-2 rounded-full bg-white hover:bg-vanilla-cream text-vanilla-espresso border border-vanilla-caramel/30 font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-1"
                              >
                                <Plus className="w-3.5 h-3.5 text-vanilla-caramel-dark" />
                                <span>{dish.customizationGroups.length > 0 ? 'CUSTOMIZE' : 'ADD'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 5. GUEST REVIEWS */}
        {reviews.length > 0 && (
          <div className="mt-20 pt-10 border-t border-vanilla-caramel/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-vanilla-caramel-dark block mb-1">
                  Gastronomy Testimonials
                </span>
                <h3 className="font-serif text-2xl font-bold text-vanilla-espresso">
                  Guest Reviews &amp; Tasting Notes
                </h3>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-vanilla-caramel/20 text-xs font-bold text-vanilla-espresso">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{restaurant.rating.toFixed(1)} / 5.0</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-3xl p-6 border border-vanilla-caramel/20 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-vanilla-ivory flex items-center justify-center font-bold text-xs text-vanilla-espresso">
                        {rev.userName.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-vanilla-espresso">
                        {rev.userName}
                      </span>
                    </div>
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-vanilla-chocolate/80 italic leading-relaxed">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                  <p className="text-[10px] text-gray-400 text-right">
                    {rev.createdAt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Customization Modal */}
      {customizingItem && (
        <CustomizationModal
          item={customizingItem}
          restaurant={restaurantInfo}
          onClose={() => setCustomizingItem(null)}
        />
      )}
    </div>
  );
}

