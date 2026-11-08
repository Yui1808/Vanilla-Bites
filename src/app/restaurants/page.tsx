import React from 'react';
import { prisma } from '@/lib/prisma';
import RestaurantListClient from './RestaurantListClient';

export const revalidate = 30;

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams: { search?: string; cuisine?: string };
}) {
  const allRestaurants = await prisma.restaurant.findMany({
    where: {
      isApproved: true,
      isSuspended: false,
    },
    include: {
      menuItems: {
        select: {
          id: true,
          isVeg: true,
        },
      },
    },
    orderBy: {
      rating: 'desc',
    },
  });

  const formatted = allRestaurants.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description,
    coverImage: r.coverImage,
    logo: r.logo,
    cuisine: r.cuisine,
    rating: r.rating,
    totalReviews: r.totalReviews,
    deliveryFee: r.deliveryFee,
    minOrder: r.minOrder,
    estimatedDeliveryTime: r.estimatedDeliveryTime,
    isOpen: r.isOpen,
    hasVegOnly: r.menuItems.length > 0 && r.menuItems.every((item) => item.isVeg),
  }));

  return (
    <div className="min-h-screen bg-vanilla-cream py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-vanilla-caramel-dark block mb-2">
            Epicurean Directory
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-vanilla-espresso">
            All Participating Restaurants
          </h1>
          <p className="text-xs sm:text-sm text-vanilla-chocolate/75 max-w-xl mt-2 leading-relaxed">
            Every storefront operates independently, crafting bespoke culinary fare and delivering directly with its own trusted fleet.
          </p>
        </div>

        {/* Client Interactive Filter & Search Component */}
        <RestaurantListClient
          restaurants={formatted}
          initialSearch={searchParams.search || ''}
          initialCuisine={searchParams.cuisine || ''}
        />
      </div>
    </div>
  );
}

