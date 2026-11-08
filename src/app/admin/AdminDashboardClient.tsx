'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import {
  Shield,
  UtensilsCrossed,
  Users,
  ShoppingBag,
  Sparkles,
  Tag,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Eye,
  Check,
  Ban,
  ArrowRight,
} from 'lucide-react';

interface Props {
  restaurants: any[];
  users: any[];
  orders: any[];
  coupons: any[];
  categories: any[];
  stats: {
    totalRevenue: number;
    totalRestaurants: number;
    totalUsers: number;
    totalOrders: number;
    activeRestaurants: number;
  };
}

export default function AdminDashboardClient({
  restaurants,
  users,
  orders,
  coupons,
  categories,
  stats,
}: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'restaurants' | 'users' | 'orders' | 'coupons'>('overview');
  const [restList, setRestList] = useState(restaurants);

  const handleRestaurantAction = async (restaurantId: string, action: string) => {
    try {
      const res = await fetch('/api/admin/restaurants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restaurantId, action }),
      });

      if (res.ok) {
        setRestList((prev) =>
          prev.map((r) => {
            if (r.id === restaurantId) {
              if (action === 'APPROVE') return { ...r, isApproved: true, isSuspended: false };
              if (action === 'REJECT') return { ...r, isApproved: false };
              if (action === 'SUSPEND') return { ...r, isSuspended: true };
              if (action === 'UNSUSPEND') return { ...r, isSuspended: false };
            }
            return r;
          })
        );
      }
    } catch {
      // error
    }
  };

  return (
    <div className="min-h-screen bg-vanilla-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-vanilla-caramel/25 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-900 text-purple-200 flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
                  Super Administrator
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  Platform Marketplace Governance
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-vanilla-espresso mt-0.5">
                Vanilla Bites Global Admin
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              ● All Systems Operational
            </span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-vanilla-caramel/20 scrollbar-none">
          {[
            { id: 'overview', label: 'Platform KPIs', icon: Sparkles },
            { id: 'restaurants', label: `Restaurants (${restList.length})`, icon: UtensilsCrossed },
            { id: 'users', label: `Users (${users.length})`, icon: Users },
            { id: 'orders', label: `Platform Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-950 text-white shadow-sm'
                    : 'bg-white/80 hover:bg-vanilla-ivory text-vanilla-chocolate border border-vanilla-caramel/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-vanilla-caramel/20 shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                  Gross Marketplace Volume (GMV)
                </span>
                <p className="font-serif text-3xl font-black text-vanilla-espresso">
                  {formatPrice(stats.totalRevenue)}
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold pt-1">
                  Across all independent storefronts
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-vanilla-caramel/20 shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                  Active Restaurants
                </span>
                <p className="font-serif text-3xl font-black text-purple-900">
                  {stats.activeRestaurants} / {stats.totalRestaurants}
                </p>
                <p className="text-[11px] text-gray-400 pt-1">
                  Operating dedicated courier staff
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-vanilla-caramel/20 shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                  Total Users Registered
                </span>
                <p className="font-serif text-3xl font-black text-vanilla-espresso">
                  {stats.totalUsers}
                </p>
                <p className="text-[11px] text-purple-700 font-semibold pt-1">
                  Customers &amp; Chef merchants
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-vanilla-caramel/20 shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                  Marketplace Orders Processed
                </span>
                <p className="font-serif text-3xl font-black text-emerald-600">
                  {stats.totalOrders}
                </p>
                <p className="text-[11px] text-emerald-700 pt-1">
                  Zero central delivery bottlenecks
                </p>
              </div>
            </div>

            {/* Quick Overview Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Restaurants Overview */}
              <div className="bg-white rounded-3xl p-6 border border-vanilla-caramel/20 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h3 className="font-serif text-lg font-bold text-vanilla-espresso">
                    Independent Culinary Partners
                  </h3>
                  <button onClick={() => setActiveTab('restaurants')} className="text-xs text-purple-700 font-bold hover:underline">
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {restList.slice(0, 4).map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-2xl bg-vanilla-cream/50 text-xs">
                      <div>
                        <p className="font-bold text-vanilla-espresso">{r.name}</p>
                        <p className="text-[11px] text-gray-500">{r.cuisine} • Owner: {r.ownerName}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${r.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {r.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-3xl p-6 border border-vanilla-caramel/20 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h3 className="font-serif text-lg font-bold text-vanilla-espresso">
                    Global Order Stream
                  </h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-purple-700 font-bold hover:underline">
                    View All →
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 4).map((o) => (
                    <div key={o.id} className="flex items-center justify-between p-3 rounded-2xl bg-vanilla-cream/50 text-xs">
                      <div>
                        <p className="font-mono font-bold text-vanilla-espresso">{o.orderNumber}</p>
                        <p className="text-[11px] text-gray-500">{o.restaurantName} • {o.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold">{formatPrice(o.total)}</p>
                        <span className="text-[10px] uppercase font-bold text-gray-500">{o.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: RESTAURANT GOVERNANCE */}
        {activeTab === 'restaurants' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="font-serif text-2xl font-bold text-vanilla-espresso">
              Restaurant Approval &amp; Suspension Governance
            </h2>

            <div className="bg-white rounded-3xl overflow-hidden border border-vanilla-caramel/20 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-vanilla-ivory/60 text-vanilla-caramel-dark font-bold uppercase tracking-wider text-[10px] border-b border-vanilla-caramel/20">
                    <tr>
                      <th className="p-4">Storefront</th>
                      <th className="p-4">Restaurateur</th>
                      <th className="p-4">Cuisine</th>
                      <th className="p-4">Staff &amp; Menu</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Governance Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {restList.map((rest) => (
                      <tr key={rest.id} className="hover:bg-vanilla-cream/30 transition-colors">
                        <td className="p-4">
                          <Link
                            href={`/restaurants/${rest.slug}`}
                            target="_blank"
                            className="font-bold text-vanilla-espresso hover:underline flex items-center gap-1.5"
                          >
                            <span>{rest.name}</span>
                            <Eye className="w-3.5 h-3.5 text-gray-400" />
                          </Link>
                          <span className="text-[11px] text-gray-400 font-mono">{rest.slug}</span>
                        </td>
                        <td className="p-4">
                          <p className="font-semibold text-vanilla-espresso">{rest.ownerName}</p>
                          <p className="text-[11px] text-gray-500">{rest.ownerEmail}</p>
                        </td>
                        <td className="p-4 text-vanilla-chocolate font-medium">
                          {rest.cuisine}
                        </td>
                        <td className="p-4 text-gray-600">
                          {rest.menuCount} dishes • {rest.couriersCount} couriers
                        </td>
                        <td className="p-4">
                          {rest.isSuspended ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                              Suspended
                            </span>
                          ) : rest.isApproved ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Approved
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              Pending Review
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {!rest.isApproved && (
                            <button
                              onClick={() => handleRestaurantAction(rest.id, 'APPROVE')}
                              className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 shadow-sm"
                            >
                              Approve
                            </button>
                          )}

                          {rest.isSuspended ? (
                            <button
                              onClick={() => handleRestaurantAction(rest.id, 'UNSUSPEND')}
                              className="px-3 py-1 rounded-full bg-gray-800 text-white font-bold text-[11px]"
                            >
                              Reactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRestaurantAction(rest.id, 'SUSPEND')}
                              className="px-3 py-1 rounded-full border border-red-300 text-red-600 hover:bg-red-50 font-bold text-[11px]"
                            >
                              Suspend
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="font-serif text-2xl font-bold text-vanilla-espresso">
              Registered Marketplace Users
            </h2>

            <div className="bg-white rounded-3xl overflow-hidden border border-vanilla-caramel/20 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-vanilla-ivory/60 text-vanilla-caramel-dark font-bold uppercase tracking-wider text-[10px] border-b border-vanilla-caramel/20">
                    <tr>
                      <th className="p-4">User</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Orders Placed</th>
                      <th className="p-4">Member Since</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-vanilla-cream/30">
                        <td className="p-4">
                          <p className="font-bold text-vanilla-espresso">{u.name}</p>
                          <p className="text-[11px] text-gray-500">{u.email}</p>
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.role === 'ADMIN'
                                ? 'bg-purple-100 text-purple-900'
                                : u.role === 'RESTAURANT_OWNER'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{u.phone || '—'}</td>
                        <td className="p-4 font-mono font-bold">{u.ordersCount}</td>
                        <td className="p-4 text-gray-500">{u.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="font-serif text-2xl font-bold text-vanilla-espresso">
              Marketplace Transaction Stream
            </h2>

            <div className="bg-white rounded-3xl overflow-hidden border border-vanilla-caramel/20 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-vanilla-ivory/60 text-vanilla-caramel-dark font-bold uppercase tracking-wider text-[10px] border-b border-vanilla-caramel/20">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Restaurant</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-vanilla-cream/30">
                        <td className="p-4 font-mono font-bold text-vanilla-espresso">
                          {o.orderNumber}
                        </td>
                        <td className="p-4 font-semibold">{o.restaurantName}</td>
                        <td className="p-4 text-gray-600">{o.customerName}</td>
                        <td className="p-4 font-mono font-bold text-vanilla-espresso">
                          {formatPrice(o.total)}
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100">
                            {o.paymentMethod} • {o.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-vanilla-espresso text-vanilla-peach">
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            href={`/orders/${o.orderNumber}`}
                            target="_blank"
                            className="text-xs font-bold text-purple-700 hover:underline"
                          >
                            Live Track
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="font-serif text-2xl font-bold text-vanilla-espresso">
              Platform Promotional Coupons
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coupons.map((c) => (
                <div key={c.id} className="bg-white rounded-3xl p-6 border border-vanilla-caramel/20 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-black text-vanilla-espresso bg-vanilla-ivory px-3 py-1 rounded-xl border border-vanilla-caramel/25">
                      {c.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      {c.timesUsed} Redemptions
                    </span>
                  </div>
                  <p className="text-xs text-vanilla-chocolate">
                    {c.discountType === 'PERCENTAGE'
                      ? `${c.discountValue}% instant discount`
                      : `${formatPrice(c.discountValue)} flat discount`}
                    {c.minOrderValue > 0 && ` on orders above ${formatPrice(c.minOrderValue)}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

