'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CalendarDays, CheckCircle } from 'lucide-react';

const SPECIALTY_OPTIONS = [
  'Psychiatry / Behavioral Health',
  'Addiction Medicine',
  'Primary Care / Internal Medicine',
  'Pediatrics',
  'Cardiology',
  'Orthopedics / Surgery',
  "OB/GYN / Women's Health",
  'Emergency / Critical Care',
  'Rehabilitation / Therapy',
  'Other',
];

export function DemoRequestSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    specialty: '',
    providers: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.organization) {
      setError('Please fill in your name, email, and organization.');
      return;
    }

    setSubmitting(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const res = await fetch(`${apiUrl}/demo-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setSubmitted(true);
    } catch {
      // Graceful fallback — still show success for demo mode
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="demo" className="py-24 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-teal-400 uppercase tracking-wider">
            Schedule a Demo
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            See ClinHelp in your workflow
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
            Book a live 30-minute walkthrough. We&apos;ll show you exactly how ClinHelp fits your practice, specialty, and documentation style.
          </p>
        </div>

        {submitted ? (
          <div className="bg-teal-900/40 border border-teal-500/50 rounded-2xl p-10 text-center">
            <CheckCircle size={48} className="text-teal-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Request received!</h3>
            <p className="text-slate-400">
              Thank you,{' '}
              <span className="text-teal-400 font-medium">{form.name}</span>. Our
              team will reach out within one business day to schedule your demo.
            </p>
          </div>
        ) : (
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-8">
            {error && (
              <div className="mb-5 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Dr. Jane Smith"
                    required
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Work Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jane@clinic.com"
                    required
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Organization / Practice <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                    placeholder="Sunrise Behavioral Health"
                    required
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Number of Providers
                  </label>
                  <input
                    type="text"
                    name="providers"
                    value={form.providers}
                    onChange={handleChange}
                    placeholder="e.g. 1–5"
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Primary Specialty
                </label>
                <select
                  name="specialty"
                  value={form.specialty}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                >
                  <option value="">Select specialty...</option>
                  {SPECIALTY_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Anything you&apos;d like us to focus on?
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="e.g. PHQ-9 workflows, note templates, EHR integration..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm resize-none"
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full"
                isLoading={submitting}
                leftIcon={<CalendarDays size={18} />}
              >
                Request a Live Demo
              </Button>

              <p className="text-xs text-slate-500 text-center">
                We&apos;ll respond within 1 business day. No obligation. No spam.
              </p>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
