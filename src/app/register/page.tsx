'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sparkles, ArrowRight, User, Mail, Lock, Phone, UtensilsCrossed, ShieldAlert } from 'lucide-react';

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'RESTAURANT_OWNER' ? 'RESTAURANT_OWNER' : 'CUSTOMER';

  const [role, setRole] = useState<'CUSTOMER' | 'RESTAURANT_OWNER'>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Restaurant owner fields
  const [restaurantName, setRestaurantName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [address, setAddress] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: any = {
        name,
        email,
        password,
        phone: phone || undefined,
        role,
      };

      if (role === 'RESTAURANT_OWNER') {
        payload.restaurantName = restaurantName;
        payload.cuisine = cuisine;
        payload.address = address;
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      await refreshUser();
      router.push(data.redirect || '/dashboard');
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 shadow-luxury border border-vanilla-caramel/25 space-y-7">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-vanilla-espresso mx-auto flex items-center justify-center text-vanilla-peach shadow-sm">
          <Sparkles className="w-6 h-6 text-vanilla-peach" />
        </div>
        <h1 className="font-serif text-3xl font-black text-vanilla-espresso">
          Join Vanilla Bites
        </h1>
        <p className="text-xs text-vanilla-chocolate/75">
          Register to enjoy bespoke culinary dining or establish your restaurant storefront.
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-vanilla-ivory/80 border border-vanilla-caramel/20">
        <button
          type="button"
          onClick={() => setRole('CUSTOMER')}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${role === 'CUSTOMER'
              ? 'bg-vanilla-espresso text-vanilla-cream shadow-sm'
              : 'text-vanilla-chocolate hover:text-vanilla-espresso'
            }`}
        >
          I&apos;m a Food Lover
        </button>
        <button
          type="button"
          onClick={() => setRole('RESTAURANT_OWNER')}
          className={`py-2 text-xs font-bold rounded-xl transition-all ${role === 'RESTAURANT_OWNER'
              ? 'bg-vanilla-espresso text-vanilla-cream shadow-sm'
              : 'text-vanilla-chocolate hover:text-vanilla-espresso'
            }`}
        >
          I&apos;m a Restaurateur
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sophia Montgomery"
              className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso mb-1">
            Password (min. 6 characters)
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
            />
          </div>
        </div>

        {/* Additional fields for Restaurant Owner */}
        {role === 'RESTAURANT_OWNER' && (
          <div className="pt-3 border-t border-vanilla-caramel/20 space-y-3">
            <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700" />
              Storefront Profile Details
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso mb-1">
                Restaurant Brand Name
              </label>
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. Maison de Vanilla Pâtisserie"
                className="w-full bg-amber-50/50 border border-amber-300 rounded-2xl px-4 py-2.5 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso mb-1">
                Cuisine Specialties
              </label>
              <input
                type="text"
                required
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="e.g. French Patisserie, Artisanal Viennoiserie"
                className="w-full bg-amber-50/50 border border-amber-300 rounded-2xl px-4 py-2.5 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso mb-1">
                Physical Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 18 Lavelle Road, Bengaluru"
                className="w-full bg-amber-50/50 border border-amber-300 rounded-2xl px-4 py-2.5 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
              />
            </div>

            <div className="p-3 rounded-xl bg-vanilla-cream text-[11px] text-vanilla-chocolate border border-vanilla-caramel/25">
              <strong>Notice:</strong> Your restaurant will deliver orders with its own courier team. You will register and manage your delivery staff inside your restaurant dashboard.
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-full bg-vanilla-espresso hover:bg-vanilla-chocolate text-vanilla-cream font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-soft-glow transition-all active:scale-95 disabled:opacity-50 mt-2"
        >
          <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
          <ArrowRight className="w-4 h-4 text-vanilla-peach" />
        </button>
      </form>

      <div className="text-center text-xs text-vanilla-chocolate/75 pt-2">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-bold text-vanilla-caramel-dark hover:underline"
        >
          Sign In Instead
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-vanilla-cream">
      <Suspense fallback={<div className="text-xs text-gray-500">Loading registration form...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
