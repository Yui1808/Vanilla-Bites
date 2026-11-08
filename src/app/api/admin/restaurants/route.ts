import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function PATCH(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Super Admin access required.' }, { status: 403 });
    }

    const { restaurantId, action } = await req.json();

    if (!restaurantId || !action) {
      return NextResponse.json({ error: 'Restaurant ID and action required.' }, { status: 400 });
    }

    let updateData: any = {};
    if (action === 'APPROVE') {
      updateData = { isApproved: true, isSuspended: false };
    } else if (action === 'REJECT') {
      updateData = { isApproved: false };
    } else if (action === 'SUSPEND') {
      updateData = { isSuspended: true };
    } else if (action === 'UNSUSPEND') {
      updateData = { isSuspended: false };
    }

    const updated = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: updateData,
    });

    return NextResponse.json({ success: true, restaurant: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

