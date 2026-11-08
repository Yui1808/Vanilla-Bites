import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'RESTAURANT_OWNER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const {
      restaurantId,
      description,
      phone,
      openingHours,
      deliveryFee,
      minOrder,
      estimatedDeliveryTime,
      isOpen,
    } = await req.json();

    const targetId = restaurantId || user.restaurantId;
    if (!targetId) {
      return NextResponse.json({ error: 'Restaurant ID required.' }, { status: 400 });
    }

    const updateData: any = {};
    if (description !== undefined) updateData.description = description;
    if (phone !== undefined) updateData.phone = phone;
    if (openingHours !== undefined) updateData.openingHours = openingHours;
    if (deliveryFee !== undefined) updateData.deliveryFee = Number(deliveryFee);
    if (minOrder !== undefined) updateData.minOrder = Number(minOrder);
    if (estimatedDeliveryTime !== undefined) updateData.estimatedDeliveryTime = estimatedDeliveryTime;
    if (isOpen !== undefined) updateData.isOpen = Boolean(isOpen);

    const updated = await prisma.restaurant.update({
      where: { id: targetId },
      data: updateData,
    });

    return NextResponse.json({ success: true, restaurant: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

