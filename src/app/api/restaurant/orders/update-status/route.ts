import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'RESTAURANT_OWNER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { orderId, newStatus, deliveryStaffId, notes } = await req.json();

    if (!orderId || !newStatus) {
      return NextResponse.json(
        { error: 'Order ID and new status are required.' },
        { status: 400 }
      );
    }

    // Verify order belongs to this restaurant
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { restaurant: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    if (user.role !== 'ADMIN' && order.restaurant.ownerId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied to this restaurant order.' },
        { status: 403 }
      );
    }

    const updateData: any = {
      status: newStatus,
    };

    if (deliveryStaffId !== undefined) {
      updateData.deliveryStaffId = deliveryStaffId || null;
    }

    // If delivered, mark paymentStatus as PAID if COD
    if (newStatus === 'DELIVERED' && order.paymentMethod === 'COD') {
      updateData.paymentStatus = 'PAID';
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: updateData,
    });

    // Record in OrderStatusHistory
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: newStatus,
        notes: notes || `Order updated to ${newStatus} by ${user.name}.`,
        changedBy: user.name,
      },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

