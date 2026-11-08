'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { X, Plus, Minus, Trash2, ArrowRight, Tag, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function CartDrawer() {
  const {
    items,
    restaurant,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    totalItemsCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    setIsApplying(true);
    setCouponMsg(null);
    const res = await applyCoupon(couponCode);
    setIsApplying(false);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setCouponCode('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-vanilla-espresso/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-vanilla-cream h-full flex flex-col shadow-2xl z-10 border-l border-vanilla-caramel/20">
        {/* Header */}
        <div className="p-6 border-b border-vanilla-caramel/15 flex items-center justify-between bg-vanilla-ivory/50">
          <div>
            <h2 className="font-serif text-2xl font-bold text-vanilla-espresso flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-vanilla-caramel" />
              Your Tasting Basket
            </h2>
            {restaurant && (
              <p className="text-xs text-vanilla-caramel font-semibold uppercase tracking-wider mt-0.5">
                From {restaurant.name}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-9 h-9 rounded-full bg-vanilla-cream hover:bg-vanilla-peach/30 border border-vanilla-caramel/20 flex items-center justify-center text-vanilla-chocolate transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-vanilla-chocolate/60">
              <div className="w-20 h-20 rounded-full bg-vanilla-ivory flex items-center justify-center mb-4 text-vanilla-caramel/40">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-xl font-bold text-vanilla-espresso mb-1">
                Your basket is empty
              </h3>
              <p className="text-sm max-w-xs mb-6">
                Explore our curated selection of Michelin-inspired dining and artisanal bakeries.
              </p>
              <Link
                href="/restaurants"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 rounded-full bg-vanilla-espresso text-vanilla-cream text-sm font-semibold hover:bg-vanilla-chocolate transition-colors"
              >
                Discover Dishes
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white border border-vanilla-caramel/15 shadow-sm hover:shadow-md transition-shadow flex gap-3.5"
              >
                <div className="relative w-18 h-18 w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-vanilla-ivory">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  {/* Veg indicator badge */}
                  <div className="absolute top-1.5 left-1.5 w-4 h-4 rounded bg-white/90 p-0.5 flex items-center justify-center border border-gray-300">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.isVeg ? 'bg-emerald-600' : 'bg-red-600'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-vanilla-espresso truncate">
                      {item.name}
                    </h4>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Customization pills */}
                  {item.customizations && item.customizations.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.customizations.map((c, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-vanilla-cream border border-vanilla-caramel/20 px-2 py-0.5 rounded-full text-vanilla-chocolate truncate max-w-[150px]"
                        >
                          {c.optionName} {c.price > 0 && `(+${formatPrice(c.price)})`}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-sm text-vanilla-espresso">
                      {formatPrice(item.itemTotal)}
                    </span>

                    <div className="flex items-center gap-2 bg-vanilla-ivory rounded-full px-2 py-0.5 border border-vanilla-caramel/20">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-vanilla-chocolate hover:bg-white text-xs transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-vanilla-espresso w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-vanilla-chocolate hover:bg-white text-xs transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer calculations & checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-vanilla-caramel/20 bg-white/80 space-y-4">
            {/* Coupon input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>
                      Coupon <strong className="font-mono">{appliedCoupon.code}</strong> applied (-
                      {formatPrice(discount)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Try code VANILLA20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full bg-vanilla-cream/70 border border-vanilla-caramel/25 rounded-xl pl-8 pr-3 py-2 text-xs uppercase font-medium tracking-wider focus:outline-none focus:border-vanilla-caramel"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying || !couponCode}
                    className="px-4 py-2 bg-vanilla-espresso text-vanilla-cream rounded-xl text-xs font-semibold hover:bg-vanilla-chocolate transition-colors disabled:opacity-50"
                  >
                    {isApplying ? 'Applying...' : 'Apply'}
                  </button>
                </form>
              )}
              {couponMsg && (
                <p
                  className={`text-[11px] mt-1.5 ${
                    couponMsg.isError ? 'text-red-500' : 'text-emerald-600'
                  }`}
                >
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Bill breakdown */}
            <div className="space-y-1.5 text-xs text-vanilla-chocolate/80 pt-2 border-t border-gray-100">
              <div className="flex justify-between">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Restaurant Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (5%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Artisan Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-vanilla-espresso pt-2 border-t border-vanilla-caramel/15">
                <span>To Pay</span>
                <span className="text-base text-vanilla-caramel-dark">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="w-full py-3.5 px-6 rounded-full bg-vanilla-espresso hover:bg-vanilla-chocolate text-vanilla-cream font-semibold text-sm flex items-center justify-between shadow-soft-glow transition-all active:scale-[0.98]"
            >
              <span>Proceed to Checkout</span>
              <span className="flex items-center gap-1.5">
                <span>{formatPrice(total)}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct delivery dispatched by {restaurant?.name || 'restaurant staff'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

