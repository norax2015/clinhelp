import React from 'react';
import { PricingCards } from '@/components/marketing/PricingCards';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Transparent per-provider pricing for ClinHelp. Starter at $149/provider/month, Growth at $249/provider/month, Enterprise custom.',
};

export default function PricingPage() {
  return (
    <div>
      <section className="gradient-hero pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1.5 bg-teal-500/20 border border-teal-400/30 rounded-full text-teal-300 text-sm font-medium mb-4">
            Simple Pricing
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Built for practices of any size
          </h1>
          <p className="text-lg text-white/70">
            Transparent, per-provider pricing with no hidden fees. Scale as your practice grows.
          </p>
        </div>
      </section>

      <PricingCards />
      <FaqAccordion />
    </div>
  );
}
