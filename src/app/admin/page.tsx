import React from 'react';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const user = await getSessionUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/login?callbackUrl=/admin');
  }

  const [restaurants, users, orders, coupons, categories] = await Promise.all([
    prisma.restaurant.findMany({
      include: {
        owner: { select: { name: true, email: true } },
        _count: { select: { orders: true, menuItems: true, deliveryStaff: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.findMany({
      include: {
        restaurant: { select: { name: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      include: {
        _count: { select: { menuItems: true } },
      },
      orderBy: { order: 'asc' },
    }),
  ]);

  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED' && o.status !== 'REJECTED')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <AdminDashboardClient
      restaurants={restaurants.map((r) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        cuisine: r.cuisine,
        ownerName: r.owner.name,
        ownerEmail: r.owner.email,
        phone: r.phone,
        rating: r.rating,
        isApproved: r.isApproved,
        isSuspended: r.isSuspended,
        ordersCount: r._count.orders,
        menuCount: r._count.menuItems,
        couriersCount: r._count.deliveryStaff,
      }))}
      users={users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        ordersCount: u._count.orders,
        createdAt: u.createdAt.toLocaleDateString(),
      }))}
      orders={orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        restaurantName: o.restaurant.name,
        customerName: o.customerName,
        total: o.total,
        status: o.status,
        paymentStatus: o.paymentStatus,
        paymentMethod: o.paymentMethod,
        createdAt: o.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }))}
      coupons={coupons.map((c) => ({
        id: c.id,
        code: c.code,
        discountType: c.discountType,
        discountValue: c.discountValue,
        minOrderValue: c.minOrderValue,
        timesUsed: c.timesUsed,
        isActive: c.isActive,
      }))}
      categories={categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        itemsCount: cat._count.menuItems,
      }))}
      stats={{
        totalRevenue,
        totalRestaurants: restaurants.length,
        totalUsers: users.length,
        totalOrders: orders.length,
        activeRestaurants: restaurants.filter((r) => r.isApproved && !r.isSuspended).length,
      }}
    />
  );
}

