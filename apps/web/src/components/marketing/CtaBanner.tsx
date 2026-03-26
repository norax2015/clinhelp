import React from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays } from 'lucide-react';

export function CtaBanner() {
  return (
    <section className="py-20 bg-gradient-to-r from-navy-900 via-navy-800 to-teal-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to reclaim your evenings?
        </h2>
        <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">
          Join providers who finish their notes before they leave the office. Start free — no credit card required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            Start Free Trial
            <ArrowRight size={16} />
          </Link>
          <a
            href="#demo"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/30 hover:bg-white/10 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <CalendarDays size={16} />
            Schedule a Live Demo
          </a>
        </div>
        <p className="mt-8 text-xs text-white/40">
          Free plan includes up to 10 consults/month. Upgrade anytime. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
