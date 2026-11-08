import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import StorefrontClient from './StorefrontClient';

export const revalidate = 30;

export default async function RestaurantStorefrontPage({
  params,
}: {
  params: { slug: string };
}) {
  const restaurant = await prisma.restaurant.findUnique({
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

  if (!restaurant || !restaurant.isApproved || restaurant.isSuspended) {
    notFound();
  }

  // Group menu items by category
  const categoriesMap: Record<
    string,
    { id: string; name: string; items: typeof restaurant.menuItems }
  > = {};

  restaurant.menuItems.forEach((item) => {
    const catName = item.category?.name || 'Chef Specialties';
    const catId = item.category?.id || 'specialties';
    if (!categoriesMap[catId]) {
      categoriesMap[catId] = { id: catId, name: catName, items: [] };
    }
    categoriesMap[catId].items.push(item);
  });

  const menuSections = Object.values(categoriesMap);

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
        address: `${restaurant.address}, ${restaurant.area}, ${restaurant.city} - ${restaurant.pincode}`,
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
        items: sec.items.map((i) => ({
          id: i.id,
          name: i.name,
          slug: i.slug,
          description: i.description,
          image: i.image,
          price: i.price,
          isVeg: i.isVeg,
          isAvailable: i.isAvailable,
          preparationTime: i.preparationTime,
          spicyLevel: i.spicyLevel,
          customizationGroups: i.customizationGroups.map((g) => ({
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
        })),
      }))}
      reviews={restaurant.reviews.map((rev) => ({
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
      }))}
    />
  );
}

