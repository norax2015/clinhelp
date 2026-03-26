'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

const practiceTypes = [
  { label: 'Behavioral Health / Mental Health', value: 'behavioral_health' },
  { label: 'Psychiatry', value: 'psychiatry' },
  { label: 'Addiction Medicine', value: 'addiction' },
  { label: 'Therapy / Counseling', value: 'therapy' },
  { label: 'Outpatient Primary Care', value: 'primary_care' },
  { label: 'Other', value: 'other' },
];

const inquiryTypes = [
  { label: 'Request a Demo', value: 'demo' },
  { label: 'Pilot Program', value: 'pilot' },
  { label: 'Pricing Information', value: 'pricing' },
  { label: 'Technical Question', value: 'technical' },
  { label: 'Partnership', value: 'partnership' },
  { label: 'Other', value: 'other' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    organization: '',
    practiceType: '',
    inquiryType: 'demo',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div>
      <section className="gradient-hero pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1.5 bg-teal-500/20 border border-teal-400/30 rounded-full text-teal-300 text-sm font-medium mb-4">
            Get in Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-white/70">
            Ready to see ClinHelp in action? Have questions? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-24 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact info */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-bold text-navy-900 mb-6">Get in touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-teal-50 rounded-lg">
                    <Mail size={18} className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-900">Email</p>
                    <a
                      href="mailto:hello@clinhelp.com"
                      className="text-sm text-teal-600 hover:underline"
                    >
                      hello@clinhelp.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-teal-50 rounded-lg">
                    <Phone size={18} className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-900">Demo Requests</p>
                    <p className="text-sm text-slate-600">
                      We respond to all demo requests within 1 business day.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-teal-50 rounded-lg">
                    <MapPin size={18} className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-900">Company</p>
                    <p className="text-sm text-slate-600">Norax Solutions, LLC</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <p className="text-sm font-medium text-amber-800 mb-1">Important disclaimer</p>
                <p className="text-xs text-amber-700">
                  ClinHelp is an assistive documentation tool. All AI outputs require clinician review and do not constitute clinical advice.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 mb-2">
                      Message received!
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Thank you for reaching out. We&apos;ll get back to you within 1 business day.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input
                        label="Full Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Dr. Jane Smith"
                        required
                      />
                      <Input
                        label="Work Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="jane@practice.com"
                        required
                      />
                    </div>
                    <Input
                      label="Organization / Practice Name"
                      name="organization"
                      value={form.organization}
                      onChange={handleChange}
                      placeholder="Riverside Behavioral Health"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Select
                        label="Practice Type"
                        name="practiceType"
                        value={form.practiceType}
                        onChange={handleChange}
                        options={practiceTypes}
                        placeholder="Select practice type"
                      />
                      <Select
                        label="Inquiry Type"
                        name="inquiryType"
                        value={form.inquiryType}
                        onChange={handleChange}
                        options={inquiryTypes}
                      />
                    </div>
                    <Textarea
                      label="Message (optional)"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us about your practice and what you're looking for..."
                    />
                    <Button
                      type="submit"
                      variant="accent"
                      size="md"
                      isLoading={isSubmitting}
                      className="w-full"
                    >
                      Send Message
                    </Button>
                    <p className="text-xs text-slate-500 text-center">
                      We respect your privacy. Your information is never shared with third parties.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
