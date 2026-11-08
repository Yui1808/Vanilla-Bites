import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'RESTAURANT_OWNER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId') || user.restaurantId;

    if (!restaurantId) {
      return NextResponse.json({ staff: [] });
    }

    const staff = await prisma.deliveryStaff.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ staff });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'RESTAURANT_OWNER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const body = await req.json();
    const { restaurantId, name, phone, vehicleType } = body;

    const targetRestaurantId = restaurantId || user.restaurantId;
    if (!targetRestaurantId || !name || !phone) {
      return NextResponse.json(
        { error: 'Name, phone, and restaurant are required.' },
        { status: 400 }
      );
    }

    const newStaff = await prisma.deliveryStaff.create({
      data: {
        restaurantId: targetRestaurantId,
        name,
        phone,
        vehicleType: vehicleType || 'Motorcycle',
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ success: true, staff: newStaff });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'RESTAURANT_OWNER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { id, status } = await req.json();

    const updated = await prisma.deliveryStaff.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, staff: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

