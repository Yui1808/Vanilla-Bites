import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { generateOrderNumber } from '@/lib/utils';
import { z } from 'zod';

const createOrderSchema = z.object({
  restaurantId: z.string(),
  items: z.array(
    z.object({
      menuItemId: z.string(),
      quantity: z.number().int().positive(),
      customizations: z.array(
        z.object({
          groupId: z.string(),
          groupName: z.string(),
          optionId: z.string(),
          optionName: z.string(),
          price: z.number(),
        })
      ).optional().default([]),
      specialInstructions: z.string().optional(),
    })
  ).min(1, 'At least 1 item is required'),
  customerName: z.string().min(2),
  customerPhone: z.string().min(8),
  deliveryAddress: z.string().min(5),
  deliveryNotes: z.string().optional(),
  paymentMethod: z.enum(['COD', 'RAZORPAY']),
  couponCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    const body = await req.json();
    const validation = createOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      restaurantId,
      items: rawItems,
      customerName,
      customerPhone,
      deliveryAddress,
      deliveryNotes,
      paymentMethod,
      couponCode,
    } = validation.data;

    // 1. Verify restaurant exists and is active
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant || !restaurant.isApproved || restaurant.isSuspended) {
      return NextResponse.json(
        { error: 'Restaurant is currently unavailable.' },
        { status: 400 }
      );
    }

    // 2. Server-side recalculation of menu items and prices
    const itemIds = rawItems.map((i) => i.menuItemId);
    const dbMenuItems = await prisma.menuItem.findMany({
      where: {
        id: { in: itemIds },
        restaurantId: restaurant.id,
        isAvailable: true,
      },
      include: {
        customizationGroups: {
          include: {
            options: true,
          },
        },
      },
    });

    if (dbMenuItems.length !== itemIds.length) {
      return NextResponse.json(
        { error: 'One or more items in your basket are unavailable or invalid.' },
        { status: 400 }
      );
    }

    let calculatedSubtotal = 0;
    const verifiedOrderItems: Array<{
      menuItemId: string;
      name: string;
      price: number;
      quantity: number;
      customizations: string;
      itemTotal: number;
    }> = [];

    for (const rawItem of rawItems) {
      const dbItem = dbMenuItems.find((i) => i.id === rawItem.menuItemId);
      if (!dbItem) continue;

      let verifiedAddOnsCost = 0;
      const verifiedCustomizations = [];

      for (const custom of rawItem.customizations) {
        const group = dbItem.customizationGroups.find((g) => g.id === custom.groupId);
        if (group) {
          const opt = group.options.find((o) => o.id === custom.optionId);
          if (opt) {
            verifiedAddOnsCost += opt.price;
            verifiedCustomizations.push({
              groupId: group.id,
              groupName: group.name,
              optionId: opt.id,
              optionName: opt.name,
              price: opt.price,
            });
          }
        }
      }

      const itemTotal = (dbItem.price + verifiedAddOnsCost) * rawItem.quantity;
      calculatedSubtotal += itemTotal;

      verifiedOrderItems.push({
        menuItemId: dbItem.id,
        name: dbItem.name,
        price: dbItem.price,
        quantity: rawItem.quantity,
        customizations: JSON.stringify(verifiedCustomizations),
        itemTotal,
      });
    }

    // Check minimum order
    if (calculatedSubtotal < restaurant.minOrder) {
      return NextResponse.json(
        {
          error: `Minimum order for ${restaurant.name} is ₹${
            restaurant.minOrder / 100
          }.`,
        },
        { status: 400 }
      );
    }

    // 3. Delivery fee and tax calculation
    const calculatedDeliveryFee = restaurant.deliveryFee;
    const calculatedTax = Math.round(calculatedSubtotal * 0.05); // 5% GST

    // 4. Coupon calculation
    let calculatedDiscount = 0;
    let appliedCouponId: string | null = null;

    if (couponCode) {
      const dbCoupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase() },
      });

      if (
        dbCoupon &&
        dbCoupon.isActive &&
        new Date() <= new Date(dbCoupon.validUntil) &&
        calculatedSubtotal >= dbCoupon.minOrderValue
      ) {
        appliedCouponId = dbCoupon.id;
        if (dbCoupon.discountType === 'PERCENTAGE') {
          calculatedDiscount = Math.round(
            (calculatedSubtotal * dbCoupon.discountValue) / 100
          );
          if (dbCoupon.maxDiscount && calculatedDiscount > dbCoupon.maxDiscount) {
            calculatedDiscount = dbCoupon.maxDiscount;
          }
        } else {
          calculatedDiscount = dbCoupon.discountValue;
        }
        calculatedDiscount = Math.min(calculatedDiscount, calculatedSubtotal);
      }
    }

    const calculatedTotal = Math.max(
      0,
      calculatedSubtotal + calculatedDeliveryFee + calculatedTax - calculatedDiscount
    );

    // 5. User association
    let orderUserId = sessionUser?.id;
    if (!orderUserId) {
      // If guest checkout, find or create guest user
      const existing = await prisma.user.findFirst({
        where: { email: 'guest@vanillabites.com' },
      });
      if (existing) {
        orderUserId = existing.id;
      } else {
        const guest = await prisma.user.create({
          data: {
            name: customerName,
            email: 'guest@vanillabites.com',
            passwordHash: 'guest-no-pw',
            role: 'CUSTOMER',
            phone: customerPhone,
          },
        });
        orderUserId = guest.id;
      }
    }

    // 6. Generate order number
    const orderNumber = generateOrderNumber();

    // 7. Create Order in Database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: orderUserId,
        restaurantId: restaurant.id,
        status: 'PENDING',
        subtotal: calculatedSubtotal,
        deliveryFee: calculatedDeliveryFee,
        tax: calculatedTax,
        discount: calculatedDiscount,
        total: calculatedTotal,
        deliveryAddress,
        customerName,
        customerPhone,
        deliveryNotes: deliveryNotes || null,
        couponId: appliedCouponId,
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
        items: {
          create: verifiedOrderItems,
        },
        statusHistory: {
          create: [
            {
              status: 'PENDING',
              notes: `Order placed via ${paymentMethod}. Awaiting restaurant confirmation.`,
              changedBy: customerName,
            },
          ],
        },
        payments: {
          create: [
            {
              amount: calculatedTotal,
              currency: 'INR',
              provider: paymentMethod === 'COD' ? 'COD' : 'RAZORPAY',
              status: 'PENDING',
            },
          ],
        },
      },
    });

    // If coupon was used, increment usage count
    if (appliedCouponId) {
      await prisma.coupon.update({
        where: { id: appliedCouponId },
        data: { timesUsed: { increment: 1 } },
      });
      await prisma.couponRedemption.create({
        data: {
          couponId: appliedCouponId,
          userId: orderUserId,
          orderId: order.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: order.paymentMethod,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to place order.' },
      { status: 500 }
    );
  }
}

