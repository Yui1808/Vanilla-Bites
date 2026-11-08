import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';
import { z } from 'zod';
import { Role } from '@/types';
import { slugify } from '@/lib/utils';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  role: z.enum(['CUSTOMER', 'RESTAURANT_OWNER']).default('CUSTOMER'),
  // Restaurant fields if role is RESTAURANT_OWNER
  restaurantName: z.string().optional(),
  cuisine: z.string().optional(),
  address: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, phone, role, restaurantName, cuisine, address } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create user and if restaurant owner, create restaurant storefront
    let createdRestaurantId: string | null = null;

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        phone: phone || null,
        role,
        emailVerified: true,
      },
    });

    if (role === 'RESTAURANT_OWNER' && restaurantName) {
      const baseSlug = slugify(restaurantName);
      const uniqueSlug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;

      const rest = await prisma.restaurant.create({
        data: {
          name: restaurantName,
          slug: uniqueSlug,
          description: `Artisanal culinary storefront founded by ${name}. Handcrafted daily.`,
          coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&h=600&fit=crop',
          phone: phone || '+91 99000 11222',
          email: email.toLowerCase(),
          address: address || '12 Culinary Boulevard',
          area: 'Central District',
          city: 'Bengaluru',
          pincode: '560001',
          cuisine: cuisine || 'Artisanal Gastronomy',
          deliveryFee: 3500, // ₹35
          minOrder: 20000, // ₹200
          estimatedDeliveryTime: '30-40 min',
          isOpen: true,
          isApproved: true, // auto-approve for testing or admin approved
          ownerId: user.id,
        },
      });
      createdRestaurantId = rest.id;
    }

    const authUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as Role,
      phone: user.phone,
      avatar: user.avatar,
      restaurantId: createdRestaurantId,
    };

    const token = await signToken(authUser);
    setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: authUser,
      redirect: role === 'RESTAURANT_OWNER' ? '/restaurant-dashboard' : '/dashboard',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to create account.' },
      { status: 500 }
    );
  }
}

