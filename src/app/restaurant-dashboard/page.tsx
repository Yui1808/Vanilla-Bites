import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import RestaurantDashboardClient from './RestaurantDashboardClient';

export const dynamic = 'force-dynamic';

export default async function RestaurantDashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login?callbackUrl=/restaurant-dashboard');
  }

  // Find restaurant owned by this user, or first restaurant if admin
  let restaurant = await prisma.restaurant.findFirst({
    where: { ownerId: user.id },
    include: {
      deliveryStaff: true,
      menuItems: {
        include: {
          category: true,
          customizationGroups: {
            include: {
              options: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      },
      orders: {
        include: {
          items: true,
          deliveryStaff: true,
          statusHistory: {
            orderBy: { createdAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  // If user is Admin or has no owned restaurant yet, pick the first restaurant for preview
  if (!restaurant) {
    restaurant = await prisma.restaurant.findFirst({
      include: {
        deliveryStaff: true,
        menuItems: {
          include: {
            category: true,
            customizationGroups: {
              include: {
                options: true,
              },
            },
          },
          orderBy: { name: 'asc' },
        },
        orders: {
          include: {
            items: true,
            deliveryStaff: true,
            statusHistory: {
              orderBy: { createdAt: 'desc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-vanilla-cream py-20 text-center">
        <h2 className="font-serif text-2xl font-bold">No Restaurant Found</h2>
        <p className="text-sm mt-2 text-vanilla-chocolate">Please register a restaurant storefront first.</p>
      </div>
    );
  }

  // Categories for menu creation
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
  });

  // Calculate analytics
  const totalRevenue = restaurant.orders
    .filter((o) => o.status !== 'CANCELLED' && o.status !== 'REJECTED')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = restaurant.orders.filter(
    (o) => o.status === 'PENDING' || o.status === 'ACCEPTED' || o.status === 'PREPARING'
  ).length;

  const deliveredCount = restaurant.orders.filter((o) => o.status === 'DELIVERED').length;

  return (
    <RestaurantDashboardClient
      restaurant={{
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
        description: restaurant.description,
        coverImage: restaurant.coverImage,
        phone: restaurant.phone,
        email: restaurant.email,
        address: restaurant.address,
        area: restaurant.area,
        city: restaurant.city,
        openingHours: restaurant.openingHours,
        deliveryFee: restaurant.deliveryFee,
        minOrder: restaurant.minOrder,
        estimatedDeliveryTime: restaurant.estimatedDeliveryTime,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
        totalReviews: restaurant.totalReviews,
        isOpen: restaurant.isOpen,
      }}
      initialOrders={restaurant.orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        status: o.status,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        deliveryAddress: o.deliveryAddress,
        deliveryNotes: o.deliveryNotes,
        subtotal: o.subtotal,
        deliveryFee: o.deliveryFee,
        total: o.total,
        paymentMethod: o.paymentMethod,
        paymentStatus: o.paymentStatus,
        createdAt: o.createdAt.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        deliveryStaffId: o.deliveryStaffId,
        deliveryStaff: o.deliveryStaff,
        items: o.items.map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          itemTotal: i.itemTotal,
          customizations: i.customizations ? JSON.parse(i.customizations) : [],
        })),
      }))}
      initialMenuItems={restaurant.menuItems.map((m) => ({
        id: m.id,
        categoryId: m.categoryId,
        categoryName: m.category?.name || 'General',
        name: m.name,
        description: m.description,
        price: m.price,
        image: m.image,
        isVeg: m.isVeg,
        isAvailable: m.isAvailable,
        preparationTime: m.preparationTime,
        spicyLevel: m.spicyLevel,
        customizationGroupsCount: m.customizationGroups.length,
      }))}
      initialStaff={restaurant.deliveryStaff.map((s) => ({
        id: s.id,
        name: s.name,
        phone: s.phone,
        vehicleType: s.vehicleType,
        status: s.status,
      }))}
      categories={categories.map((c) => ({
        id: c.id,
        name: c.name,
      }))}
      analytics={{
        totalRevenue,
        ordersCount: restaurant.orders.length,
        pendingCount,
        deliveredCount,
      }}
    />
  );
}

