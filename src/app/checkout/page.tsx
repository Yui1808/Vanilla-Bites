'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { formatPrice } from '@/lib/utils';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  MapPin,
  Phone,
  User,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Lock,
  Tag,
  AlertCircle,
  Truck,
} from 'lucide-react';

export default function CheckoutPage() {
  const {
    items,
    restaurant,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    appliedCoupon,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('Indiranagar');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560038');
  const [landmark, setLandmark] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('RAZORPAY');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync user info if available
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 rounded-full bg-vanilla-ivory flex items-center justify-center mb-4 text-vanilla-caramel">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-serif text-3xl font-black text-vanilla-espresso mb-2">
          Your Tasting Basket is Empty
        </h2>
        <p className="text-xs text-vanilla-chocolate/75 max-w-sm mb-6">
          Please select culinary delicacies from one of our artisan restaurants to proceed with checkout.
        </p>
        <Link
          href="/restaurants"
          className="px-6 py-3 rounded-full bg-vanilla-espresso text-vanilla-cream font-bold text-xs uppercase tracking-wider hover:bg-vanilla-chocolate shadow-soft-glow"
        >
          Explore Restaurants
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || !customerPhone.trim() || !street.trim() || !pincode.trim()) {
      setErrorMsg('Please complete all mandatory delivery address fields.');
      return;
    }

    setSubmitting(true);

    try {
      const fullAddress = `${street}, ${area}, ${city} - ${pincode}${landmark ? ` (Landmark: ${landmark})` : ''}`;

      // 1. Create order on server
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: restaurant!.id,
          items: items.map((i) => ({
            menuItemId: i.menuItemId,
            quantity: i.quantity,
            customizations: i.customizations,
            specialInstructions: i.specialInstructions,
          })),
          customerName,
          customerPhone,
          deliveryAddress: fullAddress,
          deliveryNotes,
          paymentMethod,
          couponCode: appliedCoupon?.code,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to initialize order.');
        setSubmitting(false);
        return;
      }

      const { orderNumber } = data.order;

      // 2. If Payment is RAZORPAY
      if (paymentMethod === 'RAZORPAY') {
        // Trigger server payment verification for test flow
        const verifyRes = await fetch('/api/payments/razorpay-verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderNumber,
            razorpay_order_id: `order_test_${Date.now()}`,
            razorpay_payment_id: `pay_test_${Math.floor(10000000 + Math.random() * 90000000)}`,
            razorpay_signature: 'test_verified_sig_vanilla_bites',
          }),
        });

        if (!verifyRes.ok) {
          setErrorMsg('Payment verification failed. Please try again.');
          setSubmitting(false);
          return;
        }
      }

      // Clear cart
      clearCart();

      // Redirect to Order tracking page
      router.push(`/orders/${orderNumber}`);
    } catch {
      setErrorMsg('An unexpected error occurred while placing your order.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-vanilla-cream py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Title */}
        <div className="mb-8">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-vanilla-caramel-dark block mb-2">
            Artisan Concierge Checkout
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-vanilla-espresso">
            Finalize Your Tasting Order
          </h1>
          <p className="text-xs sm:text-sm text-vanilla-chocolate/75 mt-1">
            Ordering from <strong className="text-vanilla-espresso">{restaurant?.name}</strong> • Dispatched by dedicated in-house courier
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Form: Delivery Address & Details */}
          <div className="lg:col-span-7 space-y-6">
            
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Customer Contact */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-vanilla-caramel/25 shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-bold text-vanilla-espresso flex items-center gap-2">
                <User className="w-5 h-5 text-vanilla-caramel" />
                Guest Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Sophia Montgomery"
                    className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-2xl px-4 py-2.5 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso mb-1">
                    Mobile Phone (For courier) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-2xl px-4 py-2.5 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-vanilla-caramel/25 shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-bold text-vanilla-espresso flex items-center gap-2">
                <MapPin className="w-5 h-5 text-vanilla-caramel" />
                Delivery Address &amp; Destination
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso mb-1">
                    Flat / House No. / Building / Street *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. 702, The Heritage Boulevard, 100ft Road"
                    className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-2xl px-4 py-2.5 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso mb-1">
                      Area / Neighborhood
                    </label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      placeholder="Indiranagar"
                      className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-2xl px-4 py-2.5 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bengaluru"
                      className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-2xl px-4 py-2.5 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="560038"
                      className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-2xl px-4 py-2.5 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Opposite Cinnamon Oak Club"
                    className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-2xl px-4 py-2.5 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso mb-1">
                    Delivery Instructions to Courier
                  </label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Leave with security concierge, ring bell twice"
                    className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-2xl px-4 py-2.5 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
                  />
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-vanilla-caramel/25 shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-bold text-vanilla-espresso flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-vanilla-caramel" />
                Payment Method
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Razorpay Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('RAZORPAY')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'RAZORPAY'
                      ? 'border-vanilla-caramel bg-vanilla-ivory/60 shadow-sm'
                      : 'border-gray-200 bg-white hover:bg-vanilla-cream/50'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center mt-0.5">
                    {paymentMethod === 'RAZORPAY' && (
                      <div className="w-3 h-3 rounded-full bg-vanilla-caramel" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-vanilla-espresso block">
                      Razorpay (Cards / UPI / NetBanking)
                    </span>
                    <span className="text-[11px] text-vanilla-chocolate/70 block mt-0.5">
                      Secured 256-bit instant authorization (Test Mode)
                    </span>
                  </div>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-vanilla-caramel bg-vanilla-ivory/60 shadow-sm'
                      : 'border-gray-200 bg-white hover:bg-vanilla-cream/50'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center mt-0.5">
                    {paymentMethod === 'COD' && (
                      <div className="w-3 h-3 rounded-full bg-vanilla-caramel" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-vanilla-espresso block">
                      Cash on Delivery
                    </span>
                    <span className="text-[11px] text-vanilla-chocolate/70 block mt-0.5">
                      Pay cash or UPI upon handover to courier
                    </span>
                  </div>
                </button>

              </div>
            </div>

          </div>

          {/* Right Summary Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-vanilla-caramel/25 shadow-luxury sticky top-24 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-vanilla-caramel/15">
                <div>
                  <h3 className="font-serif text-xl font-bold text-vanilla-espresso">
                    Order Summary
                  </h3>
                  <p className="text-xs text-vanilla-caramel-dark font-medium">
                    {restaurant?.name}
                  </p>
                </div>
                <span className="text-xs bg-vanilla-ivory px-2.5 py-1 rounded-full font-bold text-vanilla-chocolate">
                  {items.length} items
                </span>
              </div>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-bold text-vanilla-espresso w-4 text-center">
                        {item.quantity}x
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-vanilla-espresso truncate">
                          {item.name}
                        </p>
                        {item.customizations && item.customizations.length > 0 && (
                          <p className="text-[10px] text-gray-500 truncate">
                            {item.customizations.map((c) => c.optionName).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-vanilla-espresso flex-shrink-0">
                      {formatPrice(item.itemTotal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div className="space-y-2 text-xs text-vanilla-chocolate/80 pt-4 border-t border-vanilla-caramel/15">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Direct Courier Dispatch Fee</span>
                  <span>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5% Tax)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-vanilla-espresso pt-3 border-t border-vanilla-caramel/20">
                  <span>Grand Total</span>
                  <span className="text-lg text-vanilla-caramel-dark font-mono">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-full bg-vanilla-espresso hover:bg-vanilla-chocolate text-vanilla-cream font-bold text-xs uppercase tracking-widest flex items-center justify-between shadow-soft-glow transition-all active:scale-95 disabled:opacity-50"
              >
                <span>{submitting ? 'Confirming Order...' : 'Authorize & Place Order'}</span>
                <span className="flex items-center gap-1.5 font-mono">
                  <span>{formatPrice(total)}</span>
                  <ArrowRight className="w-4 h-4 text-vanilla-peach" />
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero third-party couriers. Direct restaurant dispatch.</span>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
}

