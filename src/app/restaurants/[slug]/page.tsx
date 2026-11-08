import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import StorefrontClient from './StorefrontClient';
import { FALLBACK_RESTAURANTS, FALLBACK_TRENDING_DISHES } from '@/lib/data-fallback';

export const revalidate = 30;

export default async function RestaurantStorefrontPage({
  params,
}: {
  params: { slug: string };
}) {
  let restaurant: any = null;
  let menuSections: any[] = [];
  let reviews: any[] = [];

  try {
    const dbRest = await prisma.restaurant.findUnique({
      where: { slug: params.slug },
      include: {
        menuItems: {
          include: {
            category: true,
            customizationGroups: {
              include: {
                options: true,
              },
            },
          },
          orderBy: {
            name: 'asc',
          },
        },
        reviews: {
          include: {
            user: {
              select: { name: true, avatar: true },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });

    if (dbRest) {
      restaurant = dbRest;
      const categoriesMap: Record<string, { id: string; name: string; items: any[] }> = {};
      dbRest.menuItems.forEach((item) => {
        const catName = item.category?.name || 'Chef Specialties';
        const catId = item.category?.id || 'specialties';
        if (!categoriesMap[catId]) {
          categoriesMap[catId] = { id: catId, name: catName, items: [] };
        }
        categoriesMap[catId].items.push(item);
      });
      menuSections = Object.values(categoriesMap);
      reviews = dbRest.reviews.map((rev) => ({
        id: rev.id,
        userName: rev.user.name,
        userAvatar: rev.user.avatar,
        rating: rev.rating,
        comment: rev.comment,
        createdAt: rev.createdAt.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      }));
    }
  } catch (error) {
    console.warn('Prisma query fallback for storefront:', error);
  }

  // Fallback if DB is disconnected
  if (!restaurant) {
    const fallback = FALLBACK_RESTAURANTS.find((r) => r.slug === params.slug) || FALLBACK_RESTAURANTS[0];
    restaurant = fallback;
    const relevantDishes = FALLBACK_TRENDING_DISHES.filter((d) => d.restaurant.slug === fallback.slug);
    menuSections = [
      {
        id: 'specialties',
        name: 'Chef Tasting Specialties',
        items: relevantDishes.length > 0 ? relevantDishes : FALLBACK_TRENDING_DISHES,
      },
    ];
    reviews = [
      {
        id: 'rev-1',
        userName: 'Sophia Montgomery',
        rating: 5,
        comment: 'Exquisite attention to flavor profiles. Arrived at the precise promised serving temperature.',
        createdAt: 'Oct 24, 2026',
      },
    ];
  }

  return (
    <StorefrontClient
      restaurant={{
        id: restaurant.id,
        slug: restaurant.slug,
        name: restaurant.name,
        description: restaurant.description,
        coverImage: restaurant.coverImage,
        logo: restaurant.logo,
        phone: restaurant.phone,
        email: restaurant.email,
        address: restaurant.address,
        openingHours: restaurant.openingHours,
        deliveryFee: restaurant.deliveryFee,
        minOrder: restaurant.minOrder,
        estimatedDeliveryTime: restaurant.estimatedDeliveryTime,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
        totalReviews: restaurant.totalReviews,
        isOpen: restaurant.isOpen,
      }}
      menuSections={menuSections.map((sec) => ({
        id: sec.id,
        name: sec.name,
        items: sec.items.map((i: any) => ({
          id: i.id,
          name: i.name,
          slug: i.slug || i.name.toLowerCase().replace(/\s+/g, '-'),
          description: i.description,
          image: i.image,
          price: i.price,
          isVeg: i.isVeg,
          isAvailable: i.isAvailable ?? true,
          preparationTime: i.preparationTime ?? 20,
          spicyLevel: i.spicyLevel ?? 'Medium',
          customizationGroups: i.customizationGroups?.map((g: any) => ({
            id: g.id,
            name: g.name,
            minSelections: g.minSelections,
            maxSelections: g.maxSelections,
            isRequired: g.isRequired,
            options: g.options.map((o: any) => ({
              id: o.id,
              name: o.name,
              price: o.price,
              isDefault: o.isDefault,
            })),
          })) || [],
        })),
      }))}
      reviews={reviews}
    />
  );
}
