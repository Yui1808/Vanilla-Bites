'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sparkles, ArrowRight, Lock, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { refreshUser } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed.');
        setLoading(false);
        return;
      }

      await refreshUser();
      router.push(data.redirect || '/');
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  // Quick fill demo credentials
  const fillCredentials = (demoEmail: string, demoPw: string) => {
    setEmail(demoEmail);
    setPassword(demoPw);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-vanilla-cream">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-luxury border border-vanilla-caramel/25 space-y-7">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-vanilla-espresso mx-auto flex items-center justify-center text-vanilla-peach shadow-sm">
            <Sparkles className="w-6 h-6 text-vanilla-peach animate-pulse" />
          </div>
          <h1 className="font-serif text-3xl font-black text-vanilla-espresso">
            Welcome to Haute Dining
          </h1>
          <p className="text-xs text-vanilla-chocolate/75">
            Sign in to access your tasting basket, track orders, or manage your restaurant.
          </p>
        </div>

        {/* Demo Accounts Quick-Fill Panel */}
        <div className="p-4 rounded-2xl bg-vanilla-ivory/60 border border-vanilla-caramel/20 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-vanilla-caramel-dark flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-vanilla-caramel" />
            Quick Demo Credentials (1-Click Fill):
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('sophia@example.com', 'password123')}
              className="px-2 py-1.5 rounded-xl bg-white hover:bg-vanilla-cream text-[11px] font-semibold text-vanilla-espresso border border-vanilla-caramel/20 truncate transition-colors"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('chef.marcus@vanillabites.com', 'password123')}
              className="px-2 py-1.5 rounded-xl bg-white hover:bg-vanilla-cream text-[11px] font-semibold text-amber-800 border border-amber-300 truncate transition-colors"
            >
              Chef Owner
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('admin@vanillabites.com', 'admin123')}
              className="px-2 py-1.5 rounded-xl bg-white hover:bg-vanilla-cream text-[11px] font-semibold text-purple-800 border border-purple-300 truncate transition-colors"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@vanillabites.com"
                className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-2xl pl-10 pr-4 py-3 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-vanilla-espresso">
                Password
              </label>
              <span className="text-[11px] text-vanilla-caramel-dark hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-vanilla-cream/50 border border-vanilla-caramel/25 rounded-2xl pl-10 pr-4 py-3 text-xs text-vanilla-espresso focus:outline-none focus:border-vanilla-caramel"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-vanilla-espresso hover:bg-vanilla-chocolate text-vanilla-cream font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-soft-glow transition-all active:scale-95 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 text-vanilla-peach" />
          </button>
        </form>

        {/* Footer link */}
        <div className="text-center text-xs text-vanilla-chocolate/75 pt-2">
          New to Vanilla Bites?{' '}
          <Link
            href="/register"
            className="font-bold text-vanilla-caramel-dark hover:underline"
          >
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
}

