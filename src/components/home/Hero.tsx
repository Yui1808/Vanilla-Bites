'use client';

import React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Sparkles, Star, ShieldCheck, Flame, Compass } from 'lucide-react';

// Dynamic import for Three.js Canvas with fallback
const HeroScene = dynamic(() => import('@/components/3d/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[460px] flex items-center justify-center">
      <div className="w-16 h-16 rounded-full border-4 border-vanilla-caramel/20 border-t-vanilla-caramel animate-spin" />
    </div>
  ),
});

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-vanilla-cream pt-6 pb-16">
      {/* Background ambient radial glow layers */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-vanilla-peach/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-[500px] h-[500px] bg-vanilla-ivory rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Editorial Copy */}
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
            {/* Curated tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vanilla-ivory border border-vanilla-caramel/30 text-xs font-bold uppercase tracking-wider text-vanilla-caramel-dark shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-vanilla-caramel animate-spin-slow" />
              <span>Independent Haute Gastronomy</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl font-black text-vanilla-espresso leading-[0.95] tracking-tight">
              GOOD FOOD. <br />
              <span className="italic font-light text-vanilla-caramel-dark">
                GREAT MOOD.
              </span>
            </h1>

            {/* Supporting Headline */}
            <p className="text-base sm:text-lg text-vanilla-chocolate/85 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Your next favourite meal is just a bite away. Explore Michelin-grade independent restaurants, hand-layered pastries, and wood-fired crusts delivered by restaurants’ own certified culinary fleet.
            </p>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/restaurants"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-vanilla-espresso hover:bg-vanilla-chocolate text-vanilla-cream font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-luxury transition-all active:scale-95 group"
              >
                <span>EXPLORE RESTAURANTS</span>
                <ArrowRight className="w-4 h-4 text-vanilla-peach group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/#categories"
                className="w-full sm:w-auto px-7 py-4 rounded-full border border-vanilla-caramel/40 bg-white/50 hover:bg-vanilla-ivory text-vanilla-espresso font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
              >
                <Compass className="w-4 h-4 text-vanilla-caramel" />
                <span>DISCOVER YOUR NEXT BITE</span>
              </Link>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-6 border-t border-vanilla-caramel/20 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-vanilla-chocolate">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-vanilla-espresso">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Restaurant-Direct Fleet</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Freshly Baked & Charred</span>
              </div>
            </div>
          </div>

          {/* Right 3D Interactive Hero Canvas */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Luxury floating label pills */}
            <div className="absolute top-4 left-6 z-20 hidden sm:flex items-center gap-2 bg-white/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-vanilla-caramel/25 shadow-luxury">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Signature Creation</p>
                <p className="text-xs font-serif font-bold text-vanilla-espresso">Vanilla-Glazed Truffle Burger</p>
              </div>
            </div>

            <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center gap-2 bg-white/85 backdrop-blur-md px-4 py-2 rounded-2xl border border-vanilla-caramel/25 shadow-luxury">
              <div className="w-7 h-7 rounded-full bg-vanilla-peach/40 flex items-center justify-center text-xs font-bold text-vanilla-chocolate">
                ⚡
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Express Courier</p>
                <p className="text-xs font-bold text-vanilla-espresso">25-35 Min Artisanal Dispatch</p>
              </div>
            </div>

            {/* 3D Scene viewport */}
            <div className="w-full h-[460px] lg:h-[580px] relative">
              <HeroScene />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

