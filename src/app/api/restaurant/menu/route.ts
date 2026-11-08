import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'RESTAURANT_OWNER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const {
      restaurantId,
      categoryId,
      name,
      description,
      image,
      price, // in paise
      isVeg,
      preparationTime,
      spicyLevel,
    } = await req.json();

    const targetRestId = restaurantId || user.restaurantId;
    if (!targetRestId || !name || !price) {
      return NextResponse.json(
        { error: 'Name, price and category are required.' },
        { status: 400 }
      );
    }

    // Default category if not chosen
    let effectiveCatId = categoryId;
    if (!effectiveCatId) {
      const firstCat = await prisma.category.findFirst();
      effectiveCatId = firstCat?.id;
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        restaurantId: targetRestId,
        categoryId: effectiveCatId,
        name,
        slug: `${slugify(name)}-${Date.now().toString().slice(-4)}`,
        description: description || 'Artisanal culinary preparation.',
        image: image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop',
        price: Number(price),
        isVeg: Boolean(isVeg),
        preparationTime: Number(preparationTime) || 20,
        spicyLevel: spicyLevel || 'Medium',
        isAvailable: true,
      },
    });

    return NextResponse.json({ success: true, menuItem });
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

    const { id, isAvailable, price } = await req.json();

    const updateData: any = {};
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;
    if (price !== undefined) updateData.price = Number(price);

    const updated = await prisma.menuItem.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, menuItem: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'RESTAURANT_OWNER' && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID required.' }, { status: 400 });
    }

    await prisma.menuItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

