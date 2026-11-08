import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import {
  User,
  ShoppingBag,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  Sparkles,
  Phone,
  Mail,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CustomerDashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login?callbackUrl=/dashboard');
  }

  const [dbUser, orders, favourites] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      include: {
        addresses: true,
      },
    }),
    prisma.order.findMany({
      where: { userId: user.id },
      include: {
        restaurant: {
          select: { name: true, slug: true, coverImage: true },
        },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.favouriteRestaurant.findMany({
      where: { userId: user.id },
      include: {
        restaurant: true,
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-vanilla-cream py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-vanilla-caramel/25 shadow-luxury flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-vanilla-espresso text-vanilla-cream flex items-center justify-center font-bold text-xl shadow-sm">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-vanilla-peach/30 text-vanilla-chocolate">
                  Epicurean Member
                </span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                  Verified Gourmet
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-vanilla-espresso mt-1">
                {user.name}
              </h1>
              <div className="flex items-center gap-4 text-xs text-vanilla-chocolate/75 mt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-vanilla-caramel" />
                  {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-vanilla-caramel" />
                    {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
            <span className="text-xs text-gray-500">Orders Placed</span>
            <span className="font-serif text-2xl font-black text-vanilla-espresso">
              {orders.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Order History */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-vanilla-espresso flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-vanilla-caramel" />
                Tasting Order History
              </h2>
              <span className="text-xs text-vanilla-chocolate/70">
                {orders.length} past orders
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-vanilla-caramel/20 p-8">
                <ShoppingBag className="w-12 h-12 text-vanilla-caramel mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold text-vanilla-espresso mb-1">
                  No orders placed yet
                </h3>
                <p className="text-xs text-vanilla-chocolate/70 max-w-xs mx-auto mb-5">
                  Discover exquisite restaurants and enjoy direct delivery from their kitchen.
                </p>
                <Link
                  href="/restaurants"
                  className="px-5 py-2.5 rounded-full bg-vanilla-espresso text-white text-xs font-bold"
                >
                  Explore Restaurants
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl p-6 border border-vanilla-caramel/20 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-vanilla-espresso">
                            {ord.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              ord.status === 'DELIVERED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ord.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-vanilla-espresso text-vanilla-peach'
                            }`}
                          >
                            {ord.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h3 className="font-serif text-base font-bold text-vanilla-espresso mt-1">
                          {ord.restaurant.name}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-base text-vanilla-espresso">
                          {formatPrice(ord.total)}
                        </span>
                        <p className="text-[11px] text-gray-400">
                          {ord.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-vanilla-chocolate/75">
                      {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">
                        {ord.paymentMethod} • {ord.paymentStatus}
                      </span>

                      <Link
                        href={`/orders/${ord.orderNumber}`}
                        className="px-4 py-1.5 rounded-full bg-vanilla-espresso hover:bg-vanilla-chocolate text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                      >
                        <span>Live Tracking</span>
                        <ArrowRight className="w-3.5 h-3.5 text-vanilla-peach" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Saved Addresses & Curations */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Saved Addresses */}
            <div className="bg-white rounded-3xl p-6 border border-vanilla-caramel/25 shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-bold text-vanilla-espresso flex items-center gap-2">
                <MapPin className="w-4 h-4 text-vanilla-caramel" />
                Saved Delivery Addresses
              </h3>

              {dbUser?.addresses && dbUser.addresses.length > 0 ? (
                <div className="space-y-3">
                  {dbUser.addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-3.5 rounded-2xl bg-vanilla-cream/50 border border-vanilla-caramel/15 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-vanilla-espresso">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-vanilla-chocolate/80 text-[11px] leading-relaxed">
                        {addr.street}, {addr.area}, {addr.city} - {addr.pincode}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  Addresses entered during checkout will be preserved here.
                </p>
              )}
            </div>

            {/* Quality Note */}
            <div className="p-5 rounded-3xl bg-vanilla-espresso text-vanilla-cream border border-vanilla-caramel/30 space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-vanilla-peach flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Restaurant Direct Dispatch
              </span>
              <p className="text-vanilla-cream/80 text-[11px] leading-relaxed">
                Your orders are prepared and transported by the restaurant’s own culinary team, preserving gourmet temperatures and artisan textures.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

