'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

interface FAQSection {
  category: string;
  badgeColor: string;
  badgeBg: string;
  items: FAQItem[];
}

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const faqSections: FAQSection[] = [
  {
    category: 'Value',
    badgeColor: 'text-teal-700',
    badgeBg: 'bg-teal-50 border-teal-200',
    items: [
      {
        id: 'value-worth-it',
        question: 'Is ClinHelp worth it?',
        answer: (
          <div className="space-y-3">
            <p>
              Absolutely. ClinHelp was built by a healthcare provider who experienced firsthand the
              burnout of spending hours finishing clinical documentation after patient visits.
              ClinHelp reduces documentation time dramatically while supporting evidence-based
              clinical decisions right at the point of care.
            </p>
            <p className="font-medium text-slate-700">Key benefits:</p>
            <ul className="space-y-2">
              {[
                {
                  title: 'Reduce Documentation Time & Burnout',
                  desc: 'Transform voice or written notes into polished, structured clinical documentation in minutes.',
                },
                {
                  title: 'Clinical AI & Evidence-Based Support',
                  desc: 'Get instant answers to clinical questions, eliminating hours of post-visit research.',
                },
                {
                  title: 'Increase Accuracy',
                  desc: 'AI-suggested diagnoses, treatment plans, medications, and billing codes help you document with confidence.',
                },
                {
                  title: 'Supports Multiple Tasks',
                  desc: 'Generate letters, handle prior authorizations, use pre-built or customizable templates for any specialty.',
                },
                {
                  title: 'Accessible Anywhere',
                  desc: 'Log in from any device — desktop, tablet, or mobile web browser.',
                },
                {
                  title: 'Seamless Workflow Integration',
                  desc: 'Review and edit notes after visits, then copy directly into your EHR.',
                },
                {
                  title: 'HIPAA Compliant',
                  desc: 'Patient data privacy and security built in from day one.',
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-500" />
                  <span>
                    <span className="font-medium text-slate-700">{item.title}:</span>{' '}
                    <span className="text-slate-600">{item.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ),
      },
    ],
  },
  {
    category: 'Features',
    badgeColor: 'text-blue-700',
    badgeBg: 'bg-blue-50 border-blue-200',
    items: [
      {
        id: 'features-specialties',
        question: 'Can ClinHelp be used across different medical specialties?',
        answer: (
          <p>
            Yes. ClinHelp supports documentation across all specialties — primary care, psychiatry,
            pediatrics, surgery, cardiology, internal medicine, behavioral health, therapy, OB/GYN,
            and many more. Specialty-aware note templates adapt to your workflow automatically.
          </p>
        ),
      },
      {
        id: 'features-telehealth',
        question: 'Does ClinHelp support telehealth and in-person visits?',
        answer: (
          <p>
            Yes, both seamlessly. ClinHelp works for telehealth visits, in-person encounters, and
            documentation catch-up sessions. You can use it for initial visits, follow-ups, and
            post-visit note completion.
          </p>
        ),
      },
      {
        id: 'features-mobile',
        question: 'Can I use ClinHelp on my phone or tablet?',
        answer: (
          <p>
            Yes. ClinHelp is fully web-based and works on any device including phones, tablets, and
            computers through your browser. No native app download required.
          </p>
        ),
      },
      {
        id: 'features-languages',
        question: 'Does ClinHelp support different languages?',
        answer: (
          <p>
            Currently, ClinHelp supports English. Support for additional languages is planned for
            future releases.
          </p>
        ),
      },
    ],
  },
  {
    category: 'Users',
    badgeColor: 'text-violet-700',
    badgeBg: 'bg-violet-50 border-violet-200',
    items: [
      {
        id: 'users-who',
        question: 'Who can use ClinHelp?',
        answer: (
          <div className="space-y-3">
            <p>
              ClinHelp is built for all healthcare professionals who document patient encounters,
              including:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {[
                'Physicians (MD/DO)',
                'Nurse Practitioners & Physician Assistants',
                'Psychiatrists & Therapists',
                'Mental Health Counselors',
                'Nurses & Care Managers',
                'Chiropractors & Allied Health Professionals',
                'Practice Managers',
              ].map((role) => (
                <li key={role} className="flex items-center gap-2 text-slate-600">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-violet-400" />
                  {role}
                </li>
              ))}
            </ul>
          </div>
        ),
      },
    ],
  },
  {
    category: 'Integration',
    badgeColor: 'text-amber-700',
    badgeBg: 'bg-amber-50 border-amber-200',
    items: [
      {
        id: 'integration-ehr',
        question: 'Does ClinHelp integrate with EHRs?',
        answer: (
          <p>
            ClinHelp is designed to work alongside your existing EHR. The most efficient workflow
            for most clinicians is to generate notes in ClinHelp and copy them directly into your
            EHR. Full EHR integrations via FHIR and HL7 are available for enterprise deployments.
            Contact us to discuss integration options.
          </p>
        ),
      },
    ],
  },
  {
    category: 'Pricing',
    badgeColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-50 border-emerald-200',
    items: [
      {
        id: 'pricing-individual',
        question: 'Can individual providers subscribe, or is it only for organizations?',
        answer: (
          <p>
            Both. Individual providers can subscribe directly. Organizations can also provide access
            to their entire team. Whether you&apos;re a solo provider or part of a larger practice,
            ClinHelp fits your needs.
          </p>
        ),
      },
    ],
  },
  {
    category: 'Security',
    badgeColor: 'text-rose-700',
    badgeBg: 'bg-rose-50 border-rose-200',
    items: [
      {
        id: 'security-hipaa',
        question: 'Is ClinHelp HIPAA Compliant?',
        answer: (
          <div className="space-y-3">
            <p>Yes, ClinHelp is fully HIPAA compliant. Key measures include:</p>
            <ul className="space-y-2">
              {[
                'PHI de-identification before AI processing',
                'End-to-end encryption at rest and in transit',
                'Business Associate Agreements (BAAs) available for covered entities',
                'Comprehensive audit logs',
                'Configurable data retention settings',
              ].map((measure) => (
                <li key={measure} className="flex items-center gap-2 text-slate-600">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-400" />
                  {measure}
                </li>
              ))}
            </ul>
          </div>
        ),
      },
    ],
  },
];

// ─── Accordion Item ───────────────────────────────────────────────────────────

function AccordionItem({ item, isOpen, onToggle }: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        isOpen
          ? 'border-teal-200 shadow-sm'
          : 'border-slate-100 hover:border-slate-200'
      } bg-white`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-inset rounded-xl"
        aria-expanded={isOpen}
      >
        <span
          className={`text-sm font-semibold transition-colors duration-150 ${
            isOpen ? 'text-teal-700' : 'text-slate-800'
          }`}
        >
          {item.question}
        </span>
        <span
          className={`flex-shrink-0 transition-colors duration-150 ${
            isOpen ? 'text-teal-500' : 'text-slate-400'
          }`}
        >
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
          {item.answer}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-900">Frequently Asked Questions</h1>
        <p className="text-slate-500 text-sm mt-1">
          Get answers to common questions about ClinHelp
        </p>
      </div>

      {/* FAQ sections */}
      {faqSections.map((section) => (
        <div key={section.category} className="space-y-3">
          {/* Category badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${section.badgeBg} ${section.badgeColor}`}
            >
              {section.category}
            </span>
          </div>

          {/* Accordion items */}
          <div className="space-y-2">
            {section.items.map((item) => (
              <AccordionItem
                key={item.id}
                item={item}
                isOpen={!!openItems[item.id]}
                onToggle={() => toggle(item.id)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* CTA footer */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 text-center space-y-4">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-navy-900">Still have questions?</h2>
          <p className="text-sm text-slate-500">
            Our team is ready to help you get the most out of ClinHelp.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<MessageCircle size={14} />}
            onClick={() => {
              window.location.href = 'mailto:support@clinhelp.com';
            }}
          >
            Contact Support
          </Button>
          <Button
            variant="accent"
            size="sm"
            leftIcon={<Calendar size={14} />}
            onClick={() => {
              window.location.href = '#';
            }}
          >
            Book a Demo
          </Button>
        </div>
      </div>
    </div>
  );
}
