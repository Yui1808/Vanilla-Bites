import React from 'react';
import { Compass, Utensils, CreditCard, Bike, ShieldCheck } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Compass,
    title: 'Find your restaurant',
    description: 'Explore independent bakeries, Michelin-standard bistros, and wood-fired pizzerias in your area.',
  },
  {
    step: '02',
    icon: Utensils,
    title: 'Choose your food',
    description: 'Customize brioche buns, truffle finishes, crusts, and spice profiles precisely to your palate.',
  },
  {
    step: '03',
    icon: CreditCard,
    title: 'Place your order',
    description: 'Complete checkout securely via UPI, Card (Razorpay test mode) or Cash on Delivery with transparent billing.',
  },
  {
    step: '04',
    icon: Bike,
    title: 'Delivered by the restaurant',
    description: 'Each culinary partner dispatches its own dedicated courier staff directly to your door in thermal containers.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-vanilla-ivory/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-[0.25em] text-vanilla-caramel-dark block mb-2">
            The Epicurean Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-vanilla-espresso mb-3">
            How Vanilla Bites Works
          </h2>
          <p className="text-xs sm:text-sm text-vanilla-chocolate/75 leading-relaxed">
            A boutique dining experience from kitchen flame to your dining table, without anonymous middleman fleets.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-3xl p-8 border border-vanilla-caramel/20 shadow-sm hover:shadow-luxury transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Step indicator watermark */}
                <div className="font-serif text-5xl font-black text-vanilla-peach/30 absolute top-5 right-6 select-none group-hover:text-vanilla-caramel/40 transition-colors">
                  {item.step}
                </div>

                <div className="w-14 h-14 rounded-2xl bg-vanilla-ivory flex items-center justify-center text-vanilla-caramel-dark mb-6 group-hover:scale-110 group-hover:bg-vanilla-espresso group-hover:text-vanilla-peach transition-all">
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="font-serif text-lg font-bold text-vanilla-espresso mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-vanilla-chocolate/75 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Distinctive Restaurant Direct Delivery Callout */}
        <div className="mt-14 max-w-3xl mx-auto p-5 rounded-2xl bg-vanilla-cream border border-vanilla-caramel/30 flex items-center gap-4 shadow-sm text-xs text-vanilla-chocolate">
          <ShieldCheck className="w-8 h-8 text-emerald-600 flex-shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-vanilla-espresso">The Vanilla Bites Quality Covenant:</strong> Our marketplace does not rely on third-party aggregator fleets. Every restaurant equips and assigns its own specialized delivery ambassadors, ensuring uncompromising food temperature and presentation.
          </p>
        </div>

      </div>
    </section>
  );
}

