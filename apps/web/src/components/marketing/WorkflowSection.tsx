import React from 'react';
import { FileOutput, ListChecks, RefreshCw, Mail, FileText, Wand2 } from 'lucide-react';

const workflows = [
  {
    icon: <ListChecks size={22} />,
    title: 'Automated Follow-Up Tasks',
    description: 'Generate a structured to-do list from each encounter — medication checks, referrals, follow-ups — so nothing slips between visits.',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    icon: <FileText size={22} />,
    title: 'Patient Instructions',
    description: 'Generate plain-language after-visit summaries with medication instructions, warning signs, and follow-up dates. Ready to print or share.',
    color: 'text-violet-600 bg-violet-50',
  },
  {
    icon: <Mail size={22} />,
    title: 'Referral Letters',
    description: 'Draft structured referral letters from your note content. Customize the recipient and clinical summary in seconds.',
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    icon: <Wand2 size={22} />,
    title: 'Magic Edit / Note Refinement',
    description: 'Select any section of a note and ask ClinHelp to clarify, expand, condense, or reformat — without rewriting the whole document.',
    color: 'text-fuchsia-600 bg-fuchsia-50',
  },
  {
    icon: <RefreshCw size={22} />,
    title: 'Prior Note Continuity',
    description: 'Paste your last note or select a previous encounter. ClinHelp picks up where you left off, preserving clinical context for follow-ups.',
    color: 'text-pink-600 bg-pink-50',
  },
  {
    icon: <FileOutput size={22} />,
    title: 'EHR Copy & Export',
    description: 'Copy your finished note to clipboard in one click, or export as a clean formatted document ready to paste into any EHR system.',
    color: 'text-rose-600 bg-rose-50',
  },
];

export function WorkflowSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-purple-600 uppercase tracking-wider">
            Workflow & Efficiency
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-navy-900">
            More than a scribe — a full workflow assistant
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            From the note to the follow-up, ClinHelp handles the downstream work so you can focus on the patient in front of you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflows.map((w) => (
            <div
              key={w.title}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-200"
            >
              <div className={`inline-flex p-3 rounded-xl mb-4 ${w.color}`}>
                {w.icon}
              </div>
              <h3 className="text-base font-semibold text-navy-900 mb-2">{w.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{w.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
