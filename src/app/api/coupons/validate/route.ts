import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code')?.toUpperCase();
    const subtotal = parseInt(searchParams.get('subtotal') || '0', 10);
    const restaurantId = searchParams.get('restaurantId');

    if (!code) {
      return NextResponse.json({ valid: false, message: 'Please provide a coupon code.' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ valid: false, message: 'Invalid or inactive coupon code.' }, { status: 404 });
    }

    if (new Date() > new Date(coupon.validUntil)) {
      return NextResponse.json({ valid: false, message: 'This coupon has expired.' }, { status: 400 });
    }

    if (coupon.restaurantId && restaurantId && coupon.restaurantId !== restaurantId) {
      return NextResponse.json({ valid: false, message: 'This coupon is not valid for this restaurant.' }, { status: 400 });
    }

    if (subtotal < coupon.minOrderValue) {
      const minInRupees = coupon.minOrderValue / 100;
      return NextResponse.json({
        valid: false,
        message: `Order must be at least ₹${minInRupees} to redeem this code.`,
      }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount,
    });
  } catch (error: any) {
    return NextResponse.json({ valid: false, message: error.message }, { status: 500 });
  }
}

