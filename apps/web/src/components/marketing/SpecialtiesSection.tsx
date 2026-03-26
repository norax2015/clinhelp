import React from 'react';

const specialties = [
  { emoji: '🧠', name: 'Psychiatry / Behavioral Health', desc: 'Psych evals, MSEs, therapy notes, PHQ-9, GAD-7, C-SSRS' },
  { emoji: '💊', name: 'Addiction Medicine', desc: 'AUDIT, MAT documentation, SUD treatment notes, C-SSRS' },
  { emoji: '🩺', name: 'Primary Care / Internal Medicine', desc: 'SOAP notes, chronic disease management, annual wellness' },
  { emoji: '👶', name: 'Pediatrics', desc: 'Well-child visits, developmental notes, immunization tracking' },
  { emoji: '🫀', name: 'Cardiology', desc: 'Cardiac encounters, stress test documentation, follow-ups' },
  { emoji: '🦴', name: 'Orthopedics / Surgery', desc: 'Surgical consult notes, post-op documentation, PT referrals' },
  { emoji: '🤰', name: "OB/GYN / Women's Health", desc: 'Prenatal, OB encounters, gynecology follow-up notes' },
  { emoji: '🚑', name: 'Emergency / Critical Care', desc: 'Fast, structured emergency documentation under pressure' },
  { emoji: '🩻', name: 'Rehabilitation / Therapy', desc: 'PT, OT, SLP documentation with goal tracking' },
  { emoji: '🔬', name: 'Oncology', desc: 'Treatment encounter notes, chemotherapy visit documentation' },
  { emoji: '🧬', name: 'Endocrinology / Rheumatology', desc: 'Chronic specialty care, lab-driven encounter notes' },
  { emoji: '🏥', name: 'Allied Health', desc: 'Social work, care coordination, case management notes' },
];

export function SpecialtiesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-orange-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">
            Specialties
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-navy-900">
            Built for how clinicians actually work
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            ClinHelp is specialty-aware. Whether you practice psychiatry, primary care, or surgery — the documentation adapts to your clinical context.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {specialties.map((s) => (
            <div
              key={s.name}
              className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all duration-200"
            >
              <div className="text-2xl mb-2">{s.emoji}</div>
              <h3 className="text-sm font-semibold text-navy-900 mb-1 leading-tight">{s.name}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
