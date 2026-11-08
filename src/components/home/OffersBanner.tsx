'use client';

import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, Percent } from 'lucide-react';

export default function OffersBanner() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="offers" className="py-20 bg-vanilla-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-vanilla-espresso via-vanilla-chocolate to-vanilla-espresso rounded-[2.5rem] p-8 sm:p-12 lg:p-16 text-vanilla-cream relative overflow-hidden shadow-2xl border border-vanilla-caramel/30">
          
          {/* Subtle gold decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-vanilla-caramel/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left copy */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-vanilla-cream/10 border border-vanilla-caramel/30 text-xs font-bold uppercase tracking-wider text-vanilla-peach">
                <Sparkles className="w-3.5 h-3.5 text-vanilla-caramel" />
                <span>Private Tasting Incentives</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                Indulge with bespoke <br />
                artisan privileges.
              </h2>

              <p className="text-xs sm:text-sm text-vanilla-cream/80 max-w-lg leading-relaxed">
                Apply exclusive marketplace codes at checkout to unlock savings across all independent kitchen partners.
              </p>
            </div>

            {/* Right Coupon Cards */}
            <div className="lg:col-span-5 space-y-3.5">
              
              {/* Coupon 1 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-vanilla-caramel/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-vanilla-caramel/20 flex items-center justify-center text-vanilla-peach flex-shrink-0">
                    <Percent className="w-5 h-5 text-vanilla-peach" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-white tracking-wider">
                        VANILLA20
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-vanilla-caramel text-vanilla-espresso">
                        20% OFF
                      </span>
                    </div>
                    <p className="text-[11px] text-vanilla-cream/70 mt-0.5">
                      On luxury orders above ₹400
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard('VANILLA20')}
                  className="px-3.5 py-1.5 rounded-full bg-vanilla-cream/20 hover:bg-vanilla-cream/30 text-xs font-bold flex items-center gap-1.5 transition-colors text-white"
                >
                  {copiedCode === 'VANILLA20' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Coupon 2 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-vanilla-caramel/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-vanilla-caramel/20 flex items-center justify-center text-vanilla-peach flex-shrink-0">
                    <Tag className="w-5 h-5 text-vanilla-peach" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-white tracking-wider">
                        FEAST100
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500 text-white">
                        ₹100 OFF
                      </span>
                    </div>
                    <p className="text-[11px] text-vanilla-cream/70 mt-0.5">
                      Flat discount on orders above ₹600
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard('FEAST100')}
                  className="px-3.5 py-1.5 rounded-full bg-vanilla-cream/20 hover:bg-vanilla-cream/30 text-xs font-bold flex items-center gap-1.5 transition-colors text-white"
                >
                  {copiedCode === 'FEAST100' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

