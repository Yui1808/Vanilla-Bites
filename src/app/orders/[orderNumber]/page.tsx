import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import OrderTrackerClient from './OrderTrackerClient';

export const dynamic = 'force-dynamic';

export default async function OrderPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const order = await prisma.order.findUnique({
    where: { orderNumber: params.orderNumber },
    include: {
      restaurant: {
        select: {
          id: true,
          name: true,
          slug: true,
          phone: true,
          address: true,
          coverImage: true,
        },
      },
      deliveryStaff: {
        select: {
          id: true,
          name: true,
          phone: true,
          vehicleType: true,
          status: true,
        },
      },
      items: true,
      statusHistory: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      payments: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <OrderTrackerClient
      order={{
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        subtotal: order.subtotal,
        deliveryFee: order.deliveryFee,
        tax: order.tax,
        discount: order.discount,
        total: order.total,
        deliveryAddress: order.deliveryAddress,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        deliveryNotes: order.deliveryNotes,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        restaurant: order.restaurant,
        deliveryStaff: order.deliveryStaff,
        items: order.items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          customizations: i.customizations ? JSON.parse(i.customizations) : [],
          itemTotal: i.itemTotal,
        })),
        statusHistory: order.statusHistory.map((h) => ({
          id: h.id,
          status: h.status,
          notes: h.notes,
          changedBy: h.changedBy,
          time: h.createdAt.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
        })),
      }}
    />
  );
}

