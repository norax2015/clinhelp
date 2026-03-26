import React from 'react';
import { ShieldCheck, Lock, Eye, FileCheck, Server, UserCheck } from 'lucide-react';

const pillars = [
  {
    icon: <Lock size={22} />,
    title: 'Encrypted Data Handling',
    description: 'All data is encrypted in transit (TLS) and at rest. PHI is never stored in plaintext or transmitted without protection.',
  },
  {
    icon: <UserCheck size={22} />,
    title: 'Role-Based Access Control',
    description: 'Eight distinct roles from super admin to viewer. Each clinician sees only what their role permits — by design, not by configuration.',
  },
  {
    icon: <Eye size={22} />,
    title: 'Complete Audit Trail',
    description: 'Every note generation, edit, access, and export is logged with timestamp, user identity, IP address, and action type.',
  },
  {
    icon: <FileCheck size={22} />,
    title: 'BAA-Ready Workflows',
    description: 'ClinHelp is designed with Business Associate Agreement workflows in mind. Enterprise customers can execute a BAA as part of onboarding.',
  },
  {
    icon: <Server size={22} />,
    title: 'Secure Note Retention',
    description: 'Notes and clinical documents are stored on secure infrastructure with configurable access policies and no unauthorized sharing.',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Healthcare-Conscious Privacy Design',
    description: 'Built with HIPAA-aligned thinking from the ground up — not retrofitted compliance. PHI is handled with appropriate caution at every layer.',
  },
];

export function SecuritySection() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">
            Security & Compliance
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-white">
            Built for healthcare. Designed with trust.
          </h2>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Clinical data is among the most sensitive information that exists. We treat it that way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="inline-flex p-3 rounded-xl bg-slate-700 text-slate-200 mb-4">
                {p.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{p.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-500 max-w-2xl mx-auto mt-12">
          ClinHelp is healthcare-conscious software, not a certified HIPAA compliance product in isolation. Organizations are responsible for their own HIPAA compliance program. ClinHelp provides tools and workflows designed to support — not replace — your compliance obligations.
        </p>
      </div>
    </section>
  );
}
