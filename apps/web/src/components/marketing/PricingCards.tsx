'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Discover',
    price: 'Free',
    period: '',
    description: 'Try ClinHelp risk-free. No credit card required.',
    features: [
      'Up to 10 consults/month',
      'Core SOAP documentation',
      'PHQ-9 & GAD-7 screenings',
      'Basic task management',
      'Limited AI note generation',
      'Email support',
    ],
    cta: 'Start Free Trial',
    ctaHref: '/auth/login',
    popular: false,
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$99.99',
    period: '/provider/month',
    description: 'Unlimited consults and core documentation for growing practices.',
    features: [
      'Unlimited consults',
      'All note types (SOAP, psych eval, MSE, therapy, follow-up)',
      'All screening tools (PHQ-9, GAD-7, C-SSRS, AUDIT)',
      'Unlimited AI note generation',
      'Task & workflow automation',
      'EHR copy & export',
      'Full audit logging',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    ctaHref: '/auth/login',
    popular: true,
    highlight: true,
  },
  {
    name: 'Advanced',
    price: '$119.99',
    period: '/provider/month',
    description: 'Full clinical intelligence and advanced workflow tools.',
    features: [
      'Everything in Pro',
      'Clinical intelligence tools (Beta)',
      'Diagnosis suggestion support',
      'Treatment plan guidance',
      'Referral letter generator',
      'Prior authorization templates',
      'Advanced analytics & reporting',
      'Dedicated onboarding',
    ],
    cta: 'Get Advanced',
    ctaHref: '/contact',
    popular: false,
    highlight: false,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Multi-site organizations with compliance and integration needs.',
    features: [
      'Everything in Advanced',
      'Multi-site / multi-provider',
      'EHR integration roadmap',
      'Single Sign-On (SSO)',
      'BAA execution',
      'Custom reporting & analytics',
      'SLA-backed uptime',
      'Dedicated customer success manager',
    ],
    cta: 'Contact Sales',
    ctaHref: '/contact',
    popular: false,
    highlight: false,
  },
];

export function PricingCards() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">
            Pricing
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-navy-900">
            Transparent, straightforward pricing
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Start free. Scale with your practice. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'rounded-2xl p-7 border relative',
                plan.highlight
                  ? 'bg-navy-900 border-navy-800 shadow-2xl xl:scale-105'
                  : 'bg-white border-slate-200 shadow-card',
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-teal-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={cn(
                    'text-lg font-bold mb-1',
                    plan.highlight ? 'text-white' : 'text-navy-900',
                  )}
                >
                  {plan.name}
                </h3>
                <p
                  className={cn(
                    'text-sm mb-4 leading-relaxed',
                    plan.highlight ? 'text-slate-400' : 'text-slate-500',
                  )}
                >
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span
                    className={cn(
                      'text-3xl font-bold',
                      plan.highlight ? 'text-white' : 'text-navy-900',
                    )}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={cn(
                        'text-xs',
                        plan.highlight ? 'text-slate-400' : 'text-slate-500',
                      )}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-2.5 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle
                      size={15}
                      className={cn(
                        'flex-shrink-0 mt-0.5',
                        plan.highlight ? 'text-teal-400' : 'text-teal-500',
                      )}
                    />
                    <span
                      className={cn(
                        'text-sm leading-snug',
                        plan.highlight ? 'text-slate-300' : 'text-slate-600',
                      )}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={plan.ctaHref}>
                <Button
                  variant={plan.highlight ? 'accent' : 'outline'}
                  size="md"
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          All prices in USD. Annual billing available with 2 months free. Contact us for volume discounts.
        </p>
      </div>
    </section>
  );
}
