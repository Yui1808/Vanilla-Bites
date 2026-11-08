import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, signToken, setAuthCookie } from '@/lib/auth';
import { z } from 'zod';
import { Role } from '@/types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        restaurants: {
          select: { id: true },
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials. User not found.' },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const authUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      phone: user.phone,
      avatar: user.avatar,
      restaurantId: user.restaurants[0]?.id || null,
    };

    const token = await signToken(authUser);
    setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: authUser,
      redirect:
        user.role === 'ADMIN'
          ? '/admin'
          : user.role === 'RESTAURANT_OWNER'
          ? '/restaurant-dashboard'
          : '/dashboard',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Authentication error occurred.' },
      { status: 500 }
    );
  }
}

