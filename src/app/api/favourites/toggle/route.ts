import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to save favourites.' }, { status: 401 });
    }

    const { restaurantId } = await req.json();
    if (!restaurantId) {
      return NextResponse.json({ error: 'Restaurant ID required.' }, { status: 400 });
    }

    const existing = await prisma.favouriteRestaurant.findUnique({
      where: {
        userId_restaurantId: {
          userId: user.id,
          restaurantId,
        },
      },
    });

    if (existing) {
      await prisma.favouriteRestaurant.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ favourited: false });
    } else {
      await prisma.favouriteRestaurant.create({
        data: {
          userId: user.id,
          restaurantId,
        },
      });
      return NextResponse.json({ favourited: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

