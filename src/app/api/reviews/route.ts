import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { z } from 'zod';

const reviewSchema = z.object({
  restaurantId: z.string(),
  orderId: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, 'Comment must be at least 3 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to post a review.' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { restaurantId, rating, comment } = parsed.data;

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        restaurantId,
        rating,
        comment,
      },
    });

    // Recompute restaurant average rating and total reviews
    const allReviews = await prisma.review.findMany({
      where: { restaurantId },
      select: { rating: true },
    });

    const totalReviews = allReviews.length;
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        totalReviews,
        rating: Math.round(avgRating * 10) / 10,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

