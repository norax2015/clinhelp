import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle } from 'lucide-react';

const highlights = [
  'AI-assisted clinical documentation',
  'PHQ-9, GAD-7, C-SSRS, AUDIT support',
  'Workflow & follow-up automation',
  'Audit-ready compliance logging',
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen gradient-hero flex items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/20 border border-teal-400/30 rounded-full text-teal-300 text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
            Built for behavioral health & psychiatry
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance mb-6">
            Document faster.{' '}
            <span className="text-teal-400">Think clearly.</span>{' '}
            Follow through on care.
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/70 leading-relaxed mb-3 max-w-2xl">
            ClinHelp is an AI-powered documentation, clinical support, and workflow assistant built for behavioral health, psychiatry, addiction care, and high-documentation environments.
          </p>
          <p className="text-base text-teal-300/80 font-medium mb-10">
            ClinHelp is more than an AI scribe. It&apos;s the foundation of a smarter clinical workflow.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link href="/contact">
              <Button variant="accent" size="lg" rightIcon={<ArrowRight size={18} />}>
                Request a Demo
              </Button>
            </Link>
            <Link href="/features">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 hover:border-white/40"
              >
                See All Features
              </Button>
            </Link>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {highlights.map((h) => (
              <div key={h} className="flex items-center gap-2 text-white/70 text-sm">
                <CheckCircle size={15} className="text-teal-400 flex-shrink-0" />
                {h}
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-xs text-white/40 max-w-2xl">
            ClinHelp is an assistive documentation and workflow platform. All AI outputs are suggestions for clinician review and do not constitute medical advice, diagnosis, or treatment recommendations. Clinicians retain full clinical judgment and responsibility.
          </p>
        </div>
      </div>
    </section>
  );
}
