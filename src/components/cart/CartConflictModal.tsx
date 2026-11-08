'use client';

import React from 'react';
import { useCart } from '@/lib/cart-context';
import { AlertCircle, Trash2, ArrowRight } from 'lucide-react';

export default function CartConflictModal() {
  const { pendingConflict, resolveConflict } = useCart();

  if (!pendingConflict) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vanilla-espresso/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-vanilla-cream rounded-3xl max-w-md w-full p-7 border border-vanilla-caramel/30 shadow-luxury overflow-hidden relative">
        <div className="w-14 h-14 rounded-2xl bg-vanilla-peach/40 flex items-center justify-center mb-5 text-vanilla-chocolate">
          <AlertCircle className="w-7 h-7 text-vanilla-caramel" />
        </div>

        <h3 className="font-serif text-2xl font-bold text-vanilla-espresso mb-2">
          Start a new basket?
        </h3>

        <p className="text-vanilla-chocolate/80 text-sm leading-relaxed mb-6">
          Your current order contains items from another artisan restaurant. 
          To order from <span className="font-bold text-vanilla-espresso">{pendingConflict.restaurant.name}</span>, your existing cart will be cleared.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => resolveConflict(false)}
            className="flex-1 px-5 py-3 rounded-full border border-vanilla-caramel/40 text-vanilla-chocolate font-medium text-sm hover:bg-vanilla-ivory transition-colors"
          >
            Keep Existing Basket
          </button>
          <button
            onClick={() => resolveConflict(true)}
            className="flex-1 px-5 py-3 rounded-full bg-vanilla-espresso text-vanilla-cream font-medium text-sm hover:bg-vanilla-chocolate shadow-soft-glow flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Trash2 className="w-4 h-4 text-vanilla-peach" />
            <span>Clear & Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

