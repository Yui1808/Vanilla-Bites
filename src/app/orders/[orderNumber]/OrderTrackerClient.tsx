'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  PackageCheck,
  Bike,
  Sparkles,
  Phone,
  MapPin,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Star,
  X,
  MessageSquare,
} from 'lucide-react';

interface Props {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    subtotal: number;
    deliveryFee: number;
    tax: number;
    discount: number;
    total: number;
    deliveryAddress: string;
    customerName: string;
    customerPhone: string;
    deliveryNotes?: string | null;
    paymentMethod: string;
    paymentStatus: string;
    createdAt: string;
    restaurant: {
      id: string;
      name: string;
      slug: string;
      phone: string;
      address: string;
      coverImage: string;
    };
    deliveryStaff?: {
      id: string;
      name: string;
      phone: string;
      vehicleType: string;
      status: string;
    } | null;
    items: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      customizations: any[];
      itemTotal: number;
    }>;
    statusHistory: Array<{
      id: string;
      status: string;
      notes?: string | null;
      changedBy?: string | null;
      time: string;
    }>;
  };
}

const STEPS = [
  { key: 'PENDING', label: 'Order Received', icon: Clock },
  { key: 'ACCEPTED', label: 'Confirmed by Chef', icon: ChefHat },
  { key: 'PREPARING', label: 'Kitchen Preparation', icon: Sparkles },
  { key: 'READY_FOR_PICKUP', label: 'Thermal Packed', icon: PackageCheck },
  { key: 'OUT_FOR_DELIVERY', label: 'En Route', icon: Bike },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

export default function OrderTrackerClient({ order }: Props) {
  const [currentOrder, setCurrentOrder] = useState(order);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Poll for live status update every 8 seconds
  useEffect(() => {
    if (currentOrder.status === 'DELIVERED' || currentOrder.status === 'CANCELLED') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/status?orderNumber=${currentOrder.orderNumber}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            setCurrentOrder(data.order);
          }
        }
      } catch {
        // silent poll failure
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [currentOrder.orderNumber, currentOrder.status]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/orders/status?orderNumber=${currentOrder.orderNumber}`);
      if (res.ok) {
        const data = await res.json();
        if (data.order) setCurrentOrder(data.order);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: currentOrder.restaurant.id,
          orderId: currentOrder.id,
          rating,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        setReviewSubmitted(true);
        setTimeout(() => setShowReviewModal(false), 2000);
      }
    } finally {
      setReviewSubmitting(false);
    }
  };

  const getStepIndex = (status: string) => {
    return STEPS.findIndex((s) => s.key === status);
  };

  const currentStepIdx = getStepIndex(currentOrder.status);
  const isCancelled = currentOrder.status === 'CANCELLED' || currentOrder.status === 'REJECTED';

  return (
    <div className="min-h-screen bg-vanilla-cream py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-vanilla-caramel/25 shadow-luxury flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-vanilla-peach/30 text-vanilla-chocolate">
                Order Tracking
              </span>
              <span className="text-xs font-mono font-bold text-vanilla-caramel-dark">
                {currentOrder.orderNumber}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-vanilla-espresso">
              {currentOrder.restaurant.name}
            </h1>
            <p className="text-xs text-vanilla-chocolate/70 mt-1">
              Placed at {currentOrder.createdAt} • Direct delivery by restaurant staff
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 rounded-full border border-vanilla-caramel/30 bg-vanilla-ivory/60 hover:bg-vanilla-ivory text-xs font-bold text-vanilla-espresso flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-vanilla-caramel ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>
            <Link
              href={`/restaurants/${currentOrder.restaurant.slug}`}
              className="px-4 py-2 rounded-full bg-vanilla-espresso text-vanilla-cream text-xs font-bold hover:bg-vanilla-chocolate"
            >
              Storefront
            </Link>
          </div>
        </div>

        {/* Delivered Review Trigger Card */}
        {currentOrder.status === 'DELIVERED' && (
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-luxury flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-emerald-700/40">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span className="font-bold text-base">Your Tasting Meal Has Arrived</span>
              </div>
              <p className="text-xs text-emerald-100 max-w-lg">
                Delivered in temperature-controlled packaging by {currentOrder.restaurant.name}’s ambassador. How was your culinary experience?
              </p>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="px-6 py-3 rounded-full bg-white text-emerald-950 font-bold text-xs uppercase tracking-wider hover:bg-emerald-50 transition-all shadow-md flex items-center gap-2"
            >
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>Leave Tasting Review</span>
            </button>
          </div>
        )}

        {/* Cancelled Banner if applicable */}
        {isCancelled && (
          <div className="p-5 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-xs">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Order {currentOrder.status}</p>
              <p className="mt-0.5">This order could not be fulfilled. If you paid online, your refund will be automatically credited.</p>
            </div>
          </div>
        )}

        {/* Live Stepper Visualization */}
        {!isCancelled && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-vanilla-caramel/25 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-vanilla-caramel-dark block mb-1">
                  Culinary Lifecycle
                </span>
                <h2 className="font-serif text-2xl font-bold text-vanilla-espresso">
                  {currentOrder.status === 'DELIVERED'
                    ? 'Order Successfully Delivered'
                    : 'Estimated Delivery in 25-35 Minutes'}
                </h2>
              </div>
              <span className={`text-xs px-3 py-1 font-bold rounded-full ${currentOrder.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {currentOrder.status === 'DELIVERED' ? 'Completed' : 'Active & On Track'}
              </span>
            </div>

            {/* Stepper bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div
                    key={step.key}
                    className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                      isCurrent
                        ? 'bg-vanilla-espresso text-vanilla-cream border-vanilla-caramel shadow-md scale-105'
                        : isCompleted
                        ? 'bg-vanilla-ivory/80 text-vanilla-espresso border-vanilla-caramel/30'
                        : 'bg-white/60 text-gray-400 border-gray-200'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        isCurrent
                          ? 'bg-vanilla-peach text-vanilla-espresso animate-pulse'
                          : isCompleted
                          ? 'bg-vanilla-caramel text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold leading-tight">
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] uppercase font-bold tracking-wider text-vanilla-peach">
                        In Progress
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Courier Staff & Destination Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Dedicated Restaurant Delivery Courier */}
          <div className="bg-white rounded-3xl p-6 border border-vanilla-caramel/25 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-vanilla-caramel/15">
              <span className="text-xs font-serif font-bold text-vanilla-espresso flex items-center gap-2">
                <Bike className="w-4 h-4 text-vanilla-caramel" />
                Restaurant Dedicated Delivery Staff
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                In-House Fleet
              </span>
            </div>

            {currentOrder.deliveryStaff ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-vanilla-ivory flex items-center justify-center font-bold text-sm text-vanilla-espresso border border-vanilla-caramel/25">
                    {currentOrder.deliveryStaff.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-vanilla-espresso">
                      {currentOrder.deliveryStaff.name}
                    </h3>
                    <p className="text-xs text-vanilla-chocolate/75">
                      Vehicle: {currentOrder.deliveryStaff.vehicleType}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      Status: {currentOrder.deliveryStaff.status}
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${currentOrder.deliveryStaff.phone}`}
                  className="w-10 h-10 rounded-full bg-vanilla-espresso hover:bg-vanilla-chocolate text-vanilla-cream flex items-center justify-center shadow-sm transition-transform active:scale-95"
                  title="Call Courier"
                >
                  <Phone className="w-4 h-4 text-vanilla-peach" />
                </a>
              </div>
            ) : (
              <div className="py-4 text-xs text-vanilla-chocolate/70 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-vanilla-cream flex items-center justify-center text-vanilla-caramel">
                  <Bike className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <p className="font-semibold text-vanilla-espresso">
                    Restaurant Dispatch Pending
                  </p>
                  <p className="text-[11px]">
                    The kitchen is assigning an in-house delivery ambassador once packaging is complete.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Delivery Destination */}
          <div className="bg-white rounded-3xl p-6 border border-vanilla-caramel/25 shadow-sm space-y-3">
            <span className="text-xs font-serif font-bold text-vanilla-espresso flex items-center gap-2 pb-2 border-b border-vanilla-caramel/15">
              <MapPin className="w-4 h-4 text-vanilla-caramel" />
              Delivery Address Snapshot
            </span>
            <p className="text-xs font-bold text-vanilla-espresso">
              {currentOrder.customerName} ({currentOrder.customerPhone})
            </p>
            <p className="text-xs text-vanilla-chocolate/80 leading-relaxed">
              {currentOrder.deliveryAddress}
            </p>
            {currentOrder.deliveryNotes && (
              <p className="text-[11px] text-gray-500 italic bg-vanilla-cream/70 p-2 rounded-xl border border-vanilla-caramel/15">
                Note: &ldquo;{currentOrder.deliveryNotes}&rdquo;
              </p>
            )}
          </div>

        </div>

        {/* Timestamped Status History & Receipt Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Status Timeline */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-vanilla-caramel/25 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-vanilla-espresso pb-2 border-b border-vanilla-caramel/15">
              Kitchen &amp; Dispatch Timeline
            </h3>

            <div className="space-y-4 pl-2">
              {currentOrder.statusHistory.map((hist, idx) => (
                <div key={hist.id} className="relative flex gap-3 text-xs">
                  {idx !== currentOrder.statusHistory.length - 1 && (
                    <div className="absolute left-2 top-4 bottom-0 w-0.5 bg-vanilla-caramel/20 -translate-x-1/2" />
                  )}
                  <div className="w-4 h-4 rounded-full bg-vanilla-caramel text-white flex items-center justify-center flex-shrink-0 z-10 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-vanilla-espresso">
                        {hist.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {hist.time}
                      </span>
                    </div>
                    {hist.notes && (
                      <p className="text-vanilla-chocolate/75 text-[11px] mt-0.5">
                        {hist.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Receipt Breakdown */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-vanilla-caramel/25 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-vanilla-caramel/15">
              <h3 className="font-serif text-lg font-bold text-vanilla-espresso">
                Artisan Receipt
              </h3>
              <span className="text-[11px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded">
                {currentOrder.paymentMethod} • {currentOrder.paymentStatus}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {currentOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-2">
                  <div>
                    <span className="font-semibold text-vanilla-espresso">
                      {item.quantity}x {item.name}
                    </span>
                    {item.customizations && item.customizations.length > 0 && (
                      <p className="text-[10px] text-gray-500">
                        {item.customizations.map((c: any) => c.optionName).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-mono font-bold text-vanilla-espresso">
                    {formatPrice(item.itemTotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-vanilla-caramel/15 space-y-1.5 text-xs text-vanilla-chocolate/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(currentOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Courier Fee</span>
                <span>{currentOrder.deliveryFee === 0 ? 'Free' : formatPrice(currentOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>{formatPrice(currentOrder.tax)}</span>
              </div>
              {currentOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Privilege Rebate</span>
                  <span>-{formatPrice(currentOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-vanilla-espresso pt-2 border-t border-vanilla-caramel/20">
                <span>Total Paid / Payable</span>
                <span className="text-base font-mono text-vanilla-caramel-dark">
                  {formatPrice(currentOrder.total)}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vanilla-espresso/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-vanilla-caramel/30 shadow-luxury space-y-4">
            
            {reviewSubmitted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-vanilla-espresso">
                  Tasting Note Published!
                </h3>
                <p className="text-xs text-vanilla-chocolate/80">
                  Thank you for contributing to the culinary reputation of {currentOrder.restaurant.name}.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <h3 className="font-serif text-xl font-bold text-vanilla-espresso">
                    Leave a Tasting Review
                  </h3>
                  <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1.5 text-vanilla-espresso">
                      Your Rating (1 to 5 Stars)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1.5 text-vanilla-espresso">
                      Your Culinary Comments &amp; Notes
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Describe the aroma, texture, freshness, and courier dispatch quality..."
                      className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-2xl p-3 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      className="px-4 py-2 rounded-full border border-gray-300 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reviewSubmitting || !reviewComment.trim()}
                      className="px-5 py-2.5 rounded-full bg-vanilla-espresso hover:bg-vanilla-chocolate text-white font-bold disabled:opacity-50"
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Post Review'}
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
