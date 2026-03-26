'use client';

import React from 'react';
import Link from 'next/link';
import { ScreeningForm } from '@/components/screenings/ScreeningForm';
import { ChevronRight } from 'lucide-react';

export default function NewScreeningPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/app/screenings" className="hover:text-navy-900 transition-colors">
          Screenings
        </Link>
        <ChevronRight size={14} />
        <span className="text-navy-900 font-medium">New Screening</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-navy-900">New Screening</h1>
        <p className="text-slate-500 text-sm mt-1">
          Select a screening instrument, answer all questions, and the score will be calculated automatically.
        </p>
      </div>

      <ScreeningForm />
    </div>
  );
}
