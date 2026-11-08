'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import {
  ChefHat,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  Bike,
  Plus,
  Trash2,
  Edit,
  Phone,
  MapPin,
  Sparkles,
  AlertCircle,
  Eye,
  Settings,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react';

interface Props {
  restaurant: {
    id: string;
    name: string;
    slug: string;
    description: string;
    coverImage: string;
    phone: string;
    email: string;
    address: string;
    area: string;
    city: string;
    openingHours: string;
    deliveryFee: number;
    minOrder: number;
    estimatedDeliveryTime: string;
    cuisine: string;
    rating: number;
    totalReviews: number;
    isOpen: boolean;
  };
  initialOrders: any[];
  initialMenuItems: any[];
  initialStaff: any[];
  categories: Array<{ id: string; name: string }>;
  analytics: {
    totalRevenue: number;
    ordersCount: number;
    pendingCount: number;
    deliveredCount: number;
  };
}

export default function RestaurantDashboardClient({
  restaurant,
  initialOrders,
  initialMenuItems,
  initialStaff,
  categories,
  analytics,
}: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'delivery' | 'analytics'>('overview');
  const [orders, setOrders] = useState(initialOrders);
  const [menuItems, setMenuItems] = useState(initialMenuItems);
  const [staffList, setStaffList] = useState(initialStaff);

  // New Menu Item Form Modal
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('350');
  const [newDishImage, setNewDishImage] = useState('https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop');
  const [newDishVeg, setNewDishVeg] = useState(true);
  const [newDishCat, setNewDishCat] = useState(categories[0]?.id || '');
  const [dishSubmitting, setDishSubmitting] = useState(false);

  // New Staff Modal
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffVehicle, setNewStaffVehicle] = useState('Motorcycle');
  const [staffSubmitting, setStaffSubmitting] = useState(false);

  // Order status transition handler
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: string,
    deliveryStaffId?: string
  ) => {
    try {
      const res = await fetch('/api/restaurant/orders/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          newStatus,
          deliveryStaffId,
        }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => {
            if (o.id === orderId) {
              const assignedStaff = staffList.find((s) => s.id === deliveryStaffId) || o.deliveryStaff;
              return {
                ...o,
                status: newStatus,
                deliveryStaffId: deliveryStaffId || o.deliveryStaffId,
                deliveryStaff: assignedStaff,
              };
            }
            return o;
          })
        );
      }
    } catch {
      // error handling
    }
  };

  // Toggle Menu item availability
  const handleToggleAvailability = async (itemId: string, currentVal: boolean) => {
    const updatedVal = !currentVal;
    setMenuItems((prev) =>
      prev.map((m) => (m.id === itemId ? { ...m, isAvailable: updatedVal } : m))
    );
    await fetch('/api/restaurant/menu', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: itemId, isAvailable: updatedVal }),
    });
  };

  // Delete Menu Item
  const handleDeleteMenuItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to remove this dish from your menu?')) return;
    setMenuItems((prev) => prev.filter((m) => m.id !== itemId));
    await fetch(`/api/restaurant/menu?id=${itemId}`, { method: 'DELETE' });
  };

  // Create Menu Item
  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setDishSubmitting(true);
    try {
      const priceInPaise = Math.round(parseFloat(newDishPrice) * 100);
      const res = await fetch('/api/restaurant/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          categoryId: newDishCat,
          name: newDishName,
          description: newDishDesc,
          image: newDishImage,
          price: priceInPaise,
          isVeg: newDishVeg,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const cat = categories.find((c) => c.id === newDishCat);
        setMenuItems((prev) => [
          ...prev,
          {
            ...data.menuItem,
            categoryName: cat?.name || 'General',
            customizationGroupsCount: 0,
          },
        ]);
        setShowAddMenuModal(false);
        setNewDishName('');
        setNewDishDesc('');
      }
    } finally {
      setDishSubmitting(false);
    }
  };

  // Add Delivery Staff
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffSubmitting(true);
    try {
      const res = await fetch('/api/restaurant/delivery-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          name: newStaffName,
          phone: newStaffPhone,
          vehicleType: newStaffVehicle,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStaffList((prev) => [data.staff, ...prev]);
        setShowAddStaffModal(false);
        setNewStaffName('');
        setNewStaffPhone('');
      }
    } finally {
      setStaffSubmitting(false);
    }
  };

  // Toggle Staff status
  const handleToggleStaff = async (staffId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setStaffList((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, status: nextStatus } : s))
    );
    await fetch('/api/restaurant/delivery-staff', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: staffId, status: nextStatus }),
    });
  };

  return (
    <div className="min-h-screen bg-vanilla-cream py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Storefront Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-vanilla-caramel/25 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-vanilla-ivory flex-shrink-0 border border-vanilla-caramel/30">
              <Image
                src={restaurant.coverImage}
                alt={restaurant.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-vanilla-peach/30 text-vanilla-chocolate">
                  Restaurant Control Suite
                </span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                  ● Active &amp; Accepting Orders
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-vanilla-espresso mt-1">
                {restaurant.name}
              </h1>
              <p className="text-xs text-vanilla-chocolate/75">
                {restaurant.cuisine} • Self-Delivered Fleet ({staffList.length} Couriers)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/restaurants/${restaurant.slug}`}
              target="_blank"
              className="px-4 py-2.5 rounded-full border border-vanilla-caramel/30 hover:bg-vanilla-ivory text-xs font-bold text-vanilla-espresso flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-vanilla-caramel" />
              <span>Live Storefront</span>
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-vanilla-caramel/20 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview & KPIs', icon: TrendingUp },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'menu', label: `Menu (${menuItems.length})`, icon: ChefHat },
            { id: 'delivery', label: `Delivery Staff (${staffList.length})`, icon: Bike },
            { id: 'analytics', label: 'Sales Analytics', icon: Sparkles },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-vanilla-espresso text-vanilla-cream shadow-sm'
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
                  Total Marketplace Revenue
                </span>
                <p className="font-serif text-3xl font-black text-vanilla-espresso">
                  {formatPrice(analytics.totalRevenue)}
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold pt-1">
                  ↑ 18% vs last week
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-vanilla-caramel/20 shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                  Total Orders Placed
                </span>
                <p className="font-serif text-3xl font-black text-vanilla-espresso">
                  {orders.length}
                </p>
                <p className="text-[11px] text-gray-400 pt-1">
                  Lifetime order volume
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-vanilla-caramel/20 shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                  Active Kitchen Orders
                </span>
                <p className="font-serif text-3xl font-black text-amber-600">
                  {orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length}
                </p>
                <p className="text-[11px] text-amber-700 pt-1">
                  Pending or Out for Delivery
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-vanilla-caramel/20 shadow-sm space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                  Dedicated Courier Fleet
                </span>
                <p className="font-serif text-3xl font-black text-vanilla-caramel-dark">
                  {staffList.filter((s) => s.status === 'ACTIVE').length} / {staffList.length}
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold pt-1">
                  Active delivery ambassadors
                </p>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-vanilla-caramel/25 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-vanilla-caramel/15">
                <h3 className="font-serif text-xl font-bold text-vanilla-espresso">
                  Incoming &amp; Recent Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-vanilla-caramel-dark hover:underline"
                >
                  Manage All Orders →
                </button>
              </div>

              {orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl bg-vanilla-cream/50 border border-vanilla-caramel/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-vanilla-espresso">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-vanilla-espresso text-vanilla-peach">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {order.createdAt}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-vanilla-espresso mt-1">
                      {order.customerName} ({order.customerPhone})
                    </p>
                    <p className="text-xs text-vanilla-chocolate/75 truncate max-w-md">
                      {order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-vanilla-espresso">
                      {formatPrice(order.total)}
                    </span>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="px-3 py-1.5 rounded-xl bg-vanilla-espresso text-white text-xs font-bold"
                    >
                      Process
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-vanilla-espresso">
                  Live Kitchen &amp; Delivery Console
                </h2>
                <p className="text-xs text-vanilla-chocolate/75">
                  Advance orders through the culinary lifecycle and assign your delivery staff.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-vanilla-caramel/20 p-8">
                <ShoppingBag className="w-12 h-12 text-vanilla-caramel mx-auto mb-3" />
                <h3 className="font-serif text-lg font-bold">No orders received yet</h3>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-6 border border-vanilla-caramel/20 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-sm text-vanilla-espresso">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            order.status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'OUT_FOR_DELIVERY'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-vanilla-espresso text-vanilla-peach'
                          }`}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-gray-400">
                          {order.createdAt}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-gray-500">
                          {order.paymentMethod} • {order.paymentStatus}
                        </span>
                        <span className="font-mono font-bold text-base text-vanilla-espresso">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </div>

                    {/* Customer & Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="font-bold text-vanilla-espresso">
                          {order.customerName} ({order.customerPhone})
                        </p>
                        <p className="text-vanilla-chocolate/75 mt-0.5">
                          {order.deliveryAddress}
                        </p>
                        {order.deliveryNotes && (
                          <p className="text-[11px] text-gray-500 italic mt-1 bg-vanilla-cream/70 p-1.5 rounded-lg">
                            Note: &ldquo;{order.deliveryNotes}&rdquo;
                          </p>
                        )}
                      </div>

                      {/* Items breakdown */}
                      <div className="bg-vanilla-cream/40 rounded-2xl p-3 border border-vanilla-caramel/15 space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          Kitchen Items:
                        </p>
                        {order.items.map((it: any) => (
                          <div key={it.id} className="flex justify-between text-xs">
                            <span>
                              {it.quantity}x {it.name}
                            </span>
                            <span className="font-mono text-gray-600">
                              {formatPrice(it.itemTotal)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Lifecycle Actions Bar */}
                    <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                      
                      {/* Courier assignment selector */}
                      <div className="flex items-center gap-2 text-xs">
                        <Bike className="w-4 h-4 text-vanilla-caramel" />
                        <span className="font-semibold text-gray-600">Assign Courier:</span>
                        <select
                          value={order.deliveryStaffId || ''}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.id, order.status, e.target.value)
                          }
                          className="bg-vanilla-cream/70 border border-vanilla-caramel/25 rounded-xl px-2.5 py-1 text-xs text-vanilla-espresso focus:outline-none"
                        >
                          <option value="">Select Delivery Ambassador</option>
                          {staffList.map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.name} ({st.vehicleType})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Status advancement buttons */}
                      <div className="flex items-center gap-2">
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'ACCEPTED')}
                            className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                          >
                            Accept Order
                          </button>
                        )}

                        {order.status === 'ACCEPTED' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'PREPARING')}
                            className="px-3.5 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                          >
                            Mark Preparing (Kitchen Flame)
                          </button>
                        )}

                        {order.status === 'PREPARING' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'READY_FOR_PICKUP')}
                            className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                          >
                            Thermal Packed (Ready)
                          </button>
                        )}

                        {order.status === 'READY_FOR_PICKUP' && (
                          <button
                            onClick={() =>
                              handleUpdateOrderStatus(
                                order.id,
                                'OUT_FOR_DELIVERY',
                                order.deliveryStaffId || staffList[0]?.id
                              )
                            }
                            className="px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                          >
                            Dispatch (Out for Delivery)
                          </button>
                        )}

                        {order.status === 'OUT_FOR_DELIVERY' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                            className="px-3.5 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
                          >
                            Mark Handed to Customer (Delivered)
                          </button>
                        )}

                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                            className="px-3 py-1.5 rounded-full border border-red-300 text-red-600 hover:bg-red-50 text-xs font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MENU MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-vanilla-espresso">
                  Storefront Menu Catalog
                </h2>
                <p className="text-xs text-vanilla-chocolate/75">
                  Update dish pricing, availability, and upload photographs.
                </p>
              </div>

              <button
                onClick={() => setShowAddMenuModal(true)}
                className="px-4 py-2.5 rounded-full bg-vanilla-espresso hover:bg-vanilla-chocolate text-vanilla-cream text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-soft-glow"
              >
                <Plus className="w-3.5 h-3.5 text-vanilla-peach" />
                <span>Add New Creation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-white rounded-3xl overflow-hidden border border-vanilla-caramel/20 shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] w-full bg-vanilla-ivory">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {dish.isVeg ? 'Veg' : 'Non-Veg'}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-vanilla-espresso/90 text-white px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
                      {formatPrice(dish.price)}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-vanilla-caramel-dark">
                        {dish.categoryName}
                      </span>
                      <h3 className="font-serif text-base font-bold text-vanilla-espresso mb-1">
                        {dish.name}
                      </h3>
                      <p className="text-xs text-vanilla-chocolate/70 line-clamp-2">
                        {dish.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => handleToggleAvailability(dish.id, dish.isAvailable)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                          dish.isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {dish.isAvailable ? 'In Stock' : 'Sold Out'}
                      </button>

                      <button
                        onClick={() => handleDeleteMenuItem(dish.id)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: DELIVERY STAFF */}
        {activeTab === 'delivery' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-vanilla-espresso">
                  Independent Courier Fleet
                </h2>
                <p className="text-xs text-vanilla-chocolate/75">
                  Register and manage your restaurant&apos;s own delivery staff. Orders are fulfilled exclusively by your team.
                </p>
              </div>

              <button
                onClick={() => setShowAddStaffModal(true)}
                className="px-4 py-2.5 rounded-full bg-vanilla-espresso hover:bg-vanilla-chocolate text-vanilla-cream text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-soft-glow"
              >
                <Plus className="w-3.5 h-3.5 text-vanilla-peach" />
                <span>Register Courier</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {staffList.map((st) => (
                <div
                  key={st.id}
                  className="bg-white rounded-3xl p-6 border border-vanilla-caramel/20 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-vanilla-ivory flex items-center justify-center font-bold text-vanilla-espresso">
                      {st.name.charAt(0)}
                    </div>
                    <button
                      onClick={() => handleToggleStaff(st.id, st.status)}
                      className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        st.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {st.status}
                    </button>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-vanilla-espresso">
                      {st.name}
                    </h3>
                    <p className="text-xs text-vanilla-chocolate/70">
                      Vehicle: {st.vehicleType}
                    </p>
                    <p className="text-xs text-vanilla-caramel-dark font-mono mt-1">
                      {st.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SALES ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="font-serif text-2xl font-bold text-vanilla-espresso">
              Culinary Performance &amp; Analytics
            </h2>

            <div className="bg-white rounded-3xl p-8 border border-vanilla-caramel/25 shadow-sm space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="p-4 rounded-2xl bg-vanilla-cream/60">
                  <span className="text-xs uppercase font-bold text-gray-500">Gross Sales</span>
                  <p className="font-serif text-2xl font-black text-vanilla-espresso mt-1">
                    {formatPrice(analytics.totalRevenue)}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-vanilla-cream/60">
                  <span className="text-xs uppercase font-bold text-gray-500">Average Ticket</span>
                  <p className="font-serif text-2xl font-black text-vanilla-espresso mt-1">
                    {formatPrice(orders.length > 0 ? Math.round(analytics.totalRevenue / orders.length) : 0)}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-vanilla-cream/60">
                  <span className="text-xs uppercase font-bold text-gray-500">Fulfilled Orders</span>
                  <p className="font-serif text-2xl font-black text-emerald-600 mt-1">
                    {analytics.deliveredCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modal: Add Menu Item */}
      {showAddMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vanilla-espresso/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-vanilla-caramel/30 shadow-luxury space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif text-xl font-bold text-vanilla-espresso">
                Add New Dish to Storefront
              </h3>
              <button onClick={() => setShowAddMenuModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMenuItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={newDishName}
                  onChange={(e) => setNewDishName(e.target.value)}
                  placeholder="e.g. Vanilla Bourbon Glazed Brioche"
                  className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Category *</label>
                <select
                  value={newDishCat}
                  onChange={(e) => setNewDishCat(e.target.value)}
                  className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-xl p-2.5"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">Price (₹ INR) *</label>
                <input
                  type="number"
                  required
                  value={newDishPrice}
                  onChange={(e) => setNewDishPrice(e.target.value)}
                  className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDishDesc}
                  onChange={(e) => setNewDishDesc(e.target.value)}
                  placeholder="Detailed culinary ingredients and preparation..."
                  className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Image URL</label>
                <input
                  type="url"
                  value={newDishImage}
                  onChange={(e) => setNewDishImage(e.target.value)}
                  className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-xl p-2.5"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="vegToggle"
                  checked={newDishVeg}
                  onChange={(e) => setNewDishVeg(e.target.checked)}
                  className="rounded text-vanilla-caramel"
                />
                <label htmlFor="vegToggle" className="font-semibold text-xs">Pure Vegetarian</label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMenuModal(false)}
                  className="px-4 py-2 rounded-full border border-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dishSubmitting}
                  className="px-5 py-2 rounded-full bg-vanilla-espresso text-white font-bold disabled:opacity-50"
                >
                  {dishSubmitting ? 'Adding...' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Delivery Staff */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vanilla-espresso/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-vanilla-caramel/30 shadow-luxury space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-serif text-xl font-bold text-vanilla-espresso">
                Register Restaurant Courier
              </h3>
              <button onClick={() => setShowAddStaffModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Staff Member Name *</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Mobile Contact *</label>
                <input
                  type="tel"
                  required
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  placeholder="+91 98111 22334"
                  className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Vehicle Description</label>
                <input
                  type="text"
                  value={newStaffVehicle}
                  onChange={(e) => setNewStaffVehicle(e.target.value)}
                  placeholder="e.g. Ather 450X EV / Royal Enfield"
                  className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-xl p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 rounded-full border border-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={staffSubmitting}
                  className="px-5 py-2 rounded-full bg-vanilla-espresso text-white font-bold disabled:opacity-50"
                >
                  {staffSubmitting ? 'Registering...' : 'Register Courier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

