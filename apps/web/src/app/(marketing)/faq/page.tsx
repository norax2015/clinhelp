import React from 'react';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import { CtaBanner } from '@/components/marketing/CtaBanner';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about ClinHelp — HIPAA compliance, EHR integration, specialties supported, and more.',
};

export default function FaqPage() {
  return (
    <div>
      <section className="gradient-hero pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1.5 bg-teal-500/20 border border-teal-400/30 rounded-full text-teal-300 text-sm font-medium mb-4">
            Questions & Answers
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-white/70">
            Have a question we haven&apos;t answered? Reach out to us anytime.
          </p>
        </div>
      </section>

      <FaqAccordion />
      <CtaBanner />
    </div>
  );
}
