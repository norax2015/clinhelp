import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CtaBanner } from '@/components/marketing/CtaBanner';
import { ArrowRight, Clock, Brain, Shield, TrendingUp } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why ClinHelp',
  description:
    'Learn why ClinHelp is the right clinical documentation platform for behavioral health, psychiatry, and addiction medicine practices.',
};

const reasons = [
  {
    icon: <Clock size={28} />,
    title: 'Documentation fatigue is real',
    body: 'Behavioral health providers spend an average of 2-3 hours per day on documentation. ClinHelp reduces that burden without compromising quality — giving you more time for patients, not paperwork.',
    color: 'text-teal-600 bg-teal-50',
  },
  {
    icon: <Brain size={28} />,
    title: 'Behavioral health needs purpose-built tools',
    body: 'Generic documentation platforms aren\'t built for psychiatric evaluations, MSEs, or C-SSRS workflows. ClinHelp was designed from the ground up for high-documentation behavioral health environments.',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    icon: <Shield size={28} />,
    title: 'Your clinicians stay in control',
    body: 'ClinHelp never makes clinical decisions. Every AI output is clearly labeled as an assistive draft. Your providers review, edit, and own every word that gets finalized in the chart.',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: <TrendingUp size={28} />,
    title: 'Follow-through matters as much as the note',
    body: 'Documentation is only part of the workflow. ClinHelp helps ensure follow-up tasks are captured, patient instructions are communicated, and care coordination happens — not just the clinical note.',
    color: 'text-amber-600 bg-amber-50',
  },
];

export default function WhyClinHelpPage() {
  return (
    <div>
      <section className="gradient-hero pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1.5 bg-teal-500/20 border border-teal-400/30 rounded-full text-teal-300 text-sm font-medium mb-4">
            Our Philosophy
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Why ClinHelp?
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            ClinHelp is more than an AI scribe. It&apos;s the foundation of a smarter clinical workflow.
          </p>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="bg-white rounded-2xl p-8 border border-slate-100 shadow-card"
              >
                <div className={`inline-flex p-3 rounded-xl mb-4 ${reason.color}`}>
                  {reason.icon}
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-3">{reason.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{reason.body}</p>
              </div>
            ))}
          </div>

          {/* Manifesto block */}
          <div className="bg-navy-900 rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              We believe clinical technology should work for clinicians — not the other way around.
            </h2>
            <p className="text-slate-400 mb-2 text-base max-w-2xl mx-auto">
              Behavioral health providers carry one of the highest documentation burdens in medicine. They care for patients facing profound challenges. The last thing they need is tools that add friction.
            </p>
            <p className="text-slate-400 mb-8 text-base max-w-2xl mx-auto">
              ClinHelp was built to remove friction — from documentation, from screening, from follow-up — so providers can focus on what matters: exceptional care.
            </p>
            <Link href="/contact">
              <Button variant="accent" size="lg" rightIcon={<ArrowRight size={18} />}>
                See ClinHelp in Action
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
