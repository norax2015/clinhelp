'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    q: 'Is ClinHelp worth it?',
    a: "If you're spending more than 30 minutes per patient on documentation, ClinHelp pays for itself in hours recovered per week. Clinicians using AI documentation tools report 40–60% reductions in after-hours charting. At $99.99/provider/month, that's under $5 per working day.",
  },
  {
    q: 'Does it work with my EHR?',
    a: "ClinHelp works alongside any EHR through copy-to-clipboard and export. You generate your note in ClinHelp, review and finalize it, then paste it directly into your EHR's note field. Native EHR API integrations are on our enterprise roadmap.",
  },
  {
    q: 'Does it support telehealth?',
    a: 'Yes. ClinHelp supports telehealth visit documentation with the same workflow as in-person encounters. You can type, paste, or upload context to generate structured notes for any visit mode.',
  },
  {
    q: 'Can I use it on mobile?',
    a: 'A mobile app for iOS and Android is in active development. The web app is mobile-responsive for tablet use today. The mobile app will support audio capture, task management, and note review on the go.',
  },
  {
    q: 'Is ClinHelp HIPAA compliant?',
    a: "ClinHelp is built with HIPAA-aligned design: encrypted data handling, role-based access, full audit trails, and BAA execution for enterprise customers. We recommend reviewing our security practices with your compliance officer. ClinHelp is a tool to support your HIPAA program — not a substitute for it.",
  },
  {
    q: 'Who is ClinHelp for?',
    a: 'ClinHelp is built for outpatient providers with high documentation burden — especially psychiatrists, therapists, addiction medicine providers, and behavioral health teams. It also works well for primary care, pediatrics, and any specialty that relies on structured SOAP or specialty-specific notes.',
  },
  {
    q: 'What specialties does it support?',
    a: 'ClinHelp supports psychiatry, behavioral health, addiction medicine, primary care, pediatrics, cardiology, orthopedics, OB/GYN, emergency medicine, rehabilitation, oncology, and allied health. Specialty-aware templates adapt documentation to your clinical context.',
  },
  {
    q: 'How accurate are the AI-generated notes?',
    a: 'ClinHelp generates structured drafts for clinician review — not final notes. Accuracy depends on the quality of input. With clear transcripts or detailed typed context, notes are typically 80–90% ready for editing. Every note requires clinician review before finalization.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes. The Discover plan is free with up to 10 consults per month — no credit card required. You can upgrade to Pro or Advanced at any time from within your account.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Monthly plans can be cancelled at any time from your account settings. Annual plans include 2 months free and are refundable within 30 days of renewal.',
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">FAQ</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-navy-900">
            Questions we hear often
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-medium text-navy-900 text-sm pr-4">{faq.q}</span>
                {open === i ? (
                  <ChevronUp size={16} className="flex-shrink-0 text-slate-400" />
                ) : (
                  <ChevronDown size={16} className="flex-shrink-0 text-slate-400" />
                )}
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
