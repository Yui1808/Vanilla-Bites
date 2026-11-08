import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowUpRight, Heart, ShieldCheck, Truck, Utensils } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-vanilla-espresso text-vanilla-cream/90 pt-20 pb-12 border-t border-vanilla-caramel/20 relative overflow-hidden">
      {/* Decorative backdrop glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-vanilla-caramel/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-vanilla-cream/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-vanilla-caramel text-vanilla-espresso flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-vanilla-espresso" />
              </div>
              <span className="font-serif text-2xl font-black tracking-tight text-vanilla-cream">
                VANILLA BITES
              </span>
            </Link>

            <p className="text-vanilla-cream/70 text-sm max-w-sm leading-relaxed">
              An architectural gastronomy marketplace connecting discerning epicures with independent master chefs, artisanal bakeries, and wood-fired pizzerias. Delivered exclusively by restaurants&apos; own trained culinary ambassadors.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-full bg-vanilla-cream/10 text-vanilla-peach text-xs font-medium border border-vanilla-caramel/30 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-vanilla-caramel" />
                Restaurant-Direct Fleets
              </span>
              <span className="px-3 py-1 rounded-full bg-vanilla-cream/10 text-vanilla-peach text-xs font-medium border border-vanilla-caramel/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Kitchens
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-vanilla-cream">
              Curation
            </h4>
            <ul className="space-y-2.5 text-xs text-vanilla-cream/70">
              <li>
                <Link href="/restaurants" className="hover:text-vanilla-caramel transition-colors">
                  Featured Restaurants
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-vanilla-caramel transition-colors">
                  Artisan Pâtisserie
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-vanilla-caramel transition-colors">
                  Gourmet Burgers
                </Link>
              </li>
              <li>
                <Link href="/#categories" className="hover:text-vanilla-caramel transition-colors">
                  Wood-Fired Pizza
                </Link>
              </li>
              <li>
                <Link href="/#offers" className="hover:text-vanilla-caramel transition-colors">
                  Seasonal Tasting Flights
                </Link>
              </li>
            </ul>
          </div>

          {/* For Restaurants */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-vanilla-cream">
              For Restaurateurs
            </h4>
            <ul className="space-y-2.5 text-xs text-vanilla-cream/70">
              <li>
                <Link href="/register?role=RESTAURANT_OWNER" className="hover:text-vanilla-caramel transition-colors flex items-center gap-1">
                  <span>Register Storefront</span>
                  <ArrowUpRight className="w-3 h-3 text-vanilla-caramel" />
                </Link>
              </li>
              <li>
                <Link href="/restaurant-dashboard" className="hover:text-vanilla-caramel transition-colors">
                  Partner Portal
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-vanilla-caramel transition-colors">
                  Self-Delivery Standard
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-vanilla-caramel transition-colors">
                  Marketplace Governance
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-vanilla-cream">
              The Epicurean Gazette
            </h4>
            <p className="text-xs text-vanilla-cream/70 leading-relaxed">
              Secret tasting menus, limited pastry drops, and invitations to intimate chef tables.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-vanilla-cream/10 border border-vanilla-caramel/30 rounded-xl px-3 py-2 text-xs text-vanilla-cream placeholder-vanilla-cream/40 focus:outline-none focus:border-vanilla-caramel flex-1"
              />
              <button className="px-4 py-2 bg-vanilla-caramel hover:bg-vanilla-caramel-dark text-vanilla-espresso font-bold text-xs rounded-xl transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-vanilla-cream/50">
          <p>© {new Date().getFullYear()} VANILLA BITES Haute Gastronomy Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-vanilla-cream cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-vanilla-cream cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-vanilla-cream cursor-pointer transition-colors">Culinary Safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

