import React from 'react';
import Hero from '@/components/home/Hero';
import LocationSearch from '@/components/home/LocationSearch';
import CategorySlider from '@/components/home/CategorySlider';
import FeaturedRestaurants from '@/components/home/FeaturedRestaurants';
import TrendingDishes from '@/components/home/TrendingDishes';
import OffersBanner from '@/components/home/OffersBanner';
import HowItWorks from '@/components/home/HowItWorks';
import { prisma } from '@/lib/prisma';

export const revalidate = 60; // Incremental Static Regeneration every 60s

export default async function HomePage() {
  // Fetch real restaurants from Prisma
  const dbRestaurants = await prisma.restaurant.findMany({
    where: {
      isApproved: true,
      isSuspended: false,
    },
    orderBy: {
      rating: 'desc',
    },
    take: 6,
  });

  const restaurantCardData = dbRestaurants.map((r) => ({
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
  }));

  // Fetch trending menu items with customization groups
  const dbMenuItems = await prisma.menuItem.findMany({
    where: {
      isAvailable: true,
    },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          slug: true,
          deliveryFee: true,
          minOrder: true,
        },
      },
      customizationGroups: {
        include: {
          options: true,
        },
      },
    },
    take: 6,
  });

  const trendingDishesData = dbMenuItems.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    image: item.image,
    price: item.price,
    isVeg: item.isVeg,
    preparationTime: item.preparationTime,
    spicyLevel: item.spicyLevel,
    restaurant: {
      id: item.restaurant.id,
      name: item.restaurant.name,
      slug: item.restaurant.slug,
      deliveryFee: item.restaurant.deliveryFee,
      minOrder: item.restaurant.minOrder,
    },
    customizationGroups: item.customizationGroups.map((g) => ({
      id: g.id,
      name: g.name,
      minSelections: g.minSelections,
      maxSelections: g.maxSelections,
      isRequired: g.isRequired,
      options: g.options.map((o) => ({
        id: o.id,
        name: o.name,
        price: o.price,
        isDefault: o.isDefault,
      })),
    })),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <LocationSearch />
      <FeaturedRestaurants initialRestaurants={restaurantCardData} />
      <CategorySlider />
      <TrendingDishes dishes={trendingDishesData} />
      <OffersBanner />
      <HowItWorks />
    </div>
  );
}

