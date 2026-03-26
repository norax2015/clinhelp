import React from 'react';
import {
  FileText,
  ClipboardCheck,
  Tag,
  Workflow,
  ShieldCheck,
  Brain,
} from 'lucide-react';

const features = [
  {
    icon: <FileText size={24} />,
    title: 'AI-Assisted Documentation',
    description:
      'Generate structured SOAP, psych eval, therapy, and MSE notes as assistive drafts for clinician review. Reduce documentation burden while maintaining clinical accuracy.',
    color: 'text-teal-600 bg-teal-50',
  },
  {
    icon: <ClipboardCheck size={24} />,
    title: 'Intelligent Screening Support',
    description:
      'PHQ-9, GAD-7, C-SSRS, and AUDIT with auto-scoring and severity labels. Administer screenings within the encounter workflow and track trends over time.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: <Tag size={24} />,
    title: 'Coding Suggestion Support',
    description:
      'ICD-10 code suggestions for clinician review. All suggestions are clearly labeled as AI-assisted and require explicit clinician approval. Never auto-finalized.',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    icon: <Workflow size={24} />,
    title: 'Workflow & Follow-Up Automation',
    description:
      'Auto-generated follow-up tasks, patient instructions, and care coordination summaries — so nothing falls through the cracks between visits.',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: <ShieldCheck size={24} />,
    title: 'Audit-Ready Logging',
    description:
      'Every access, generation, and finalization is logged with user, timestamp, and IP address. Built for HIPAA-aligned compliance confidence.',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: <Brain size={24} />,
    title: 'Built for Behavioral Health',
    description:
      'Purpose-built for psychiatry, addiction medicine, therapy, and high-documentation outpatient settings. Not a generic tool retrofitted for healthcare.',
    color: 'text-rose-600 bg-rose-50',
  },
];

export function FeaturesGrid() {
  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-teal-600 uppercase tracking-wider">
            Capabilities
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-navy-900">
            Everything your clinical workflow needs
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            ClinHelp combines AI documentation, screening tools, coding support, and workflow automation in one integrated platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-200"
            >
              <div
                className={`inline-flex p-3 rounded-xl mb-4 ${feature.color}`}
              >
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-navy-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
