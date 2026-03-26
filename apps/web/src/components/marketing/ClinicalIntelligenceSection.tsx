import React from 'react';
import { Brain, Pill, Stethoscope, MessageSquare, Lock } from 'lucide-react';

const tools = [
  {
    icon: <Stethoscope size={20} />,
    label: 'Diagnosis Suggestions',
    description: 'AI-assisted differential diagnosis prompts based on documentation context. For clinician review only — never auto-applied.',
    badge: 'Beta',
    cardClass: 'border-green-200 bg-green-50/60 text-green-800',
    badgeClass: 'bg-green-100 text-green-700',
  },
  {
    icon: <Brain size={20} />,
    label: 'Treatment Plan Guidance',
    description: 'Evidence-informed treatment plan language tailored to your note type and specialty context.',
    badge: 'Beta',
    cardClass: 'border-emerald-200 bg-emerald-50/60 text-emerald-800',
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    icon: <Pill size={20} />,
    label: 'Medication Guidance',
    description: 'Common medication classes, dosing references, and interaction alerts — clinical reference only, not a prescription tool.',
    badge: 'Coming Soon',
    cardClass: 'border-teal-200 bg-teal-50/60 text-teal-800',
    badgeClass: 'bg-teal-100 text-teal-700',
  },
  {
    icon: <MessageSquare size={20} />,
    label: 'Clinical Q&A Assistant',
    description: 'Ask clinical questions within your encounter context. Get evidence-referenced answers for real-time decision support.',
    badge: 'Coming Soon',
    cardClass: 'border-cyan-200 bg-cyan-50/60 text-cyan-800',
    badgeClass: 'bg-cyan-100 text-cyan-700',
  },
];

export function ClinicalIntelligenceSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-green-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">
            Clinical Intelligence
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-navy-900">
            Decision support, not decision replacement
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            ClinHelp surfaces relevant clinical insights inline with your workflow. Every suggestion requires clinician review and approval. You stay in control.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {tools.map((tool) => (
            <div
              key={tool.label}
              className={`flex gap-4 p-5 rounded-2xl border ${tool.cardClass}`}
            >
              <div className="flex-shrink-0 mt-0.5">{tool.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-semibold text-sm">{tool.label}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tool.badgeClass}`}>
                    {tool.badge}
                  </span>
                </div>
                <p className="text-sm opacity-80 leading-relaxed">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-start gap-3 max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-xl p-5">
          <Lock size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">
            <span className="font-semibold">Clinical disclaimer:</span> All AI outputs are decision support tools for licensed clinician review. ClinHelp does not provide medical advice, autonomous diagnosis, or treatment orders. The clinician retains full clinical judgment and responsibility at all times.
          </p>
        </div>
      </div>
    </section>
  );
}
