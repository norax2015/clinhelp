import React from 'react';
import { FeaturesGrid } from '@/components/marketing/FeaturesGrid';
import { CtaBanner } from '@/components/marketing/CtaBanner';
import type { Metadata } from 'next';
import {
  FileText,
  ClipboardCheck,
  Tag,
  Workflow,
  ShieldCheck,
  Brain,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Features',
  description:
    'Explore the full suite of ClinHelp capabilities: AI documentation, screenings, coding support, workflow automation, and audit-ready compliance logging.',
};

const detailFeatures = [
  {
    icon: <FileText size={32} />,
    title: 'AI-Assisted Documentation',
    subtitle: 'Generate structured clinical notes as assistive drafts',
    details: [
      'SOAP notes for primary care and follow-up visits',
      'Psychiatric evaluation notes with structured sections',
      'Mental Status Exam (MSE) documentation',
      'Therapy progress notes',
      'All outputs clearly labeled as AI-assisted drafts requiring clinician review',
      'One-click generation from encounter context',
      'Full editing before finalization',
    ],
    color: 'text-teal-600 bg-teal-50 border-teal-100',
  },
  {
    icon: <ClipboardCheck size={32} />,
    title: 'Intelligent Screening Support',
    subtitle: 'Validated screening tools with automatic scoring',
    details: [
      'PHQ-9 depression screening with severity classification',
      'GAD-7 anxiety screening with severity levels',
      'C-SSRS suicidality screening (simplified form)',
      'AUDIT alcohol use screening with risk levels',
      'Automatic score calculation and severity labeling',
      'Historical trend tracking per patient',
      'Embedded in the encounter workflow',
    ],
    color: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    icon: <Tag size={32} />,
    title: 'Coding Suggestion Support',
    subtitle: 'ICD-10 code suggestions for clinician review',
    details: [
      'ICD-10 diagnostic code suggestions based on note content',
      'E&M level suggestions with rationale',
      'Completeness prompts to improve documentation quality',
      'Confidence scores on each suggestion',
      'All suggestions require explicit clinician acceptance',
      'Never auto-finalized — clinician always in control',
      'Modification and rejection workflow included',
    ],
    color: 'text-purple-600 bg-purple-50 border-purple-100',
  },
  {
    icon: <Workflow size={32} />,
    title: 'Workflow & Follow-Up Automation',
    subtitle: 'Keep care coordination on track',
    details: [
      'Auto-generated follow-up tasks from encounter content',
      'Patient instruction drafts for post-visit communication',
      'Care coordination summaries',
      'Task assignment to care team members',
      'Priority and due date management',
      'Status tracking through completion',
      'AI-generated tasks clearly labeled as suggestions',
    ],
    color: 'text-amber-600 bg-amber-50 border-amber-100',
  },
  {
    icon: <ShieldCheck size={32} />,
    title: 'Audit-Ready Logging',
    subtitle: 'Compliance confidence built in',
    details: [
      'Every record access logged with user and timestamp',
      'AI generation events tracked separately',
      'Note finalization and signing events',
      'User authentication events (login/logout)',
      'File upload and transcript request logging',
      'Admin change tracking',
      'Exportable audit log with filtering',
    ],
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    icon: <Brain size={32} />,
    title: 'Built for Behavioral Health',
    subtitle: 'Purpose-built, not retrofitted',
    details: [
      'Psychiatric evaluation templates built by clinicians',
      'Mental health screening tools natively integrated',
      'Addiction medicine documentation support',
      'Behavioral health workflow assumptions throughout',
      'Sensitivity to behavioral health documentation requirements',
      'Designed for high-documentation environments',
      'Supports therapy, psychiatry, and outpatient primary care',
    ],
    color: 'text-rose-600 bg-rose-50 border-rose-100',
  },
];

export default function FeaturesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1.5 bg-teal-500/20 border border-teal-400/30 rounded-full text-teal-300 text-sm font-medium mb-4">
            Platform Features
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            A smarter clinical workflow, built for you
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            ClinHelp combines AI documentation, validated screening tools, coding support, and workflow automation — purpose-built for behavioral health and psychiatry.
          </p>
        </div>
      </section>

      {/* Detailed features */}
      <section className="py-24 bg-surface">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {detailFeatures.map((feature, i) => (
              <div
                key={feature.title}
                className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-start`}
              >
                <div className="flex-shrink-0">
                  <div className={`p-5 rounded-2xl border ${feature.color} inline-flex`}>
                    {feature.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-navy-900 mb-1">
                    {feature.title}
                  </h2>
                  <p className="text-teal-600 font-medium mb-4">{feature.subtitle}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-slate-600 text-sm">
                        <span className="text-teal-500 mt-1 flex-shrink-0">✓</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
}
