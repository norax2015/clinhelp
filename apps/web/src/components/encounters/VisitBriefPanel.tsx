'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  usePatient,
  usePatientDiagnoses,
  usePatientMedications,
  usePatientEncounters,
} from '@/hooks/usePatients';
import type { Diagnosis, Medication, Encounter } from '@/types';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface VisitBriefPanelProps {
  patientId: string;
  chiefComplaint?: string;
  encounterType: string;
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function NoneDocumented() {
  return <span className="text-sm text-slate-400 italic">None documented</span>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
      {children}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function VisitBriefPanel({ patientId, chiefComplaint, encounterType }: VisitBriefPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: patient, isLoading: patientLoading } = usePatient(patientId);
  const { data: diagnoses, isLoading: dxLoading } = usePatientDiagnoses(patientId);
  const { data: medications, isLoading: rxLoading } = usePatientMedications(patientId);
  const { data: encounters, isLoading: encLoading } = usePatientEncounters(patientId);

  const isLoading = patientLoading || dxLoading || rxLoading || encLoading;

  // Active diagnoses (status === 'active'), max 5 shown inline
  const activeDx: Diagnosis[] = (diagnoses ?? []).filter((d) => d.status === 'active');
  const shownDx = activeDx.slice(0, 5);
  const extraDx = activeDx.length - shownDx.length;

  // Active medications, max 6
  const activeMeds: Medication[] = (medications ?? []).filter((m) => m.status === 'active');
  const shownMeds = activeMeds.slice(0, 6);
  const extraMeds = activeMeds.length - shownMeds.length;

  // Allergies from patient record (field may not exist — gracefully degrade)
  const allergies: string[] = (patient as unknown as Record<string, unknown> | undefined)?.allergies as string[] ?? [];

  // Recent encounter count (excluding current loading state)
  const encounterCount: number = (encounters ?? []).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-teal-400 overflow-hidden">
      {/* Header row */}
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-navy-900">
          <span>📋</span>
          <span>Visit Brief</span>
          {!isExpanded && (
            <span className="text-xs font-normal text-slate-400 ml-1">
              — {encounterType}
            </span>
          )}
        </span>

        <div className="flex items-center gap-2">
          {!isExpanded && (
            <span className="text-xs text-teal-600 font-medium">View Visit Brief</span>
          )}
          {isLoading && isExpanded ? (
            <Spinner size="sm" />
          ) : isExpanded ? (
            <ChevronUp size={15} className="text-slate-400" />
          ) : (
            <ChevronDown size={15} className="text-slate-400" />
          )}
        </div>
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className="border-t border-slate-100 px-4 pb-4 pt-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Spinner size="md" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {/* Chief Complaint — full width if present */}
              {chiefComplaint && (
                <div className="col-span-2">
                  <SectionLabel>Chief Complaint</SectionLabel>
                  <p className="text-sm text-slate-700 leading-snug">{chiefComplaint}</p>
                </div>
              )}

              {/* Active Diagnoses */}
              <div>
                <SectionLabel>Active Diagnoses</SectionLabel>
                {shownDx.length === 0 ? (
                  <NoneDocumented />
                ) : (
                  <p className="text-sm text-slate-700 leading-snug">
                    {shownDx.map((d) => d.description).join(', ')}
                    {extraDx > 0 && (
                      <span className="text-slate-400 ml-1">+{extraDx} more</span>
                    )}
                  </p>
                )}
              </div>

              {/* Allergies */}
              <div>
                <SectionLabel>Allergies</SectionLabel>
                {allergies.length === 0 ? (
                  <NoneDocumented />
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {allergies.map((allergy, i) => (
                      <Badge key={i} variant="danger" size="sm">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Current Medications */}
              <div className="col-span-2">
                <SectionLabel>Current Medications</SectionLabel>
                {shownMeds.length === 0 ? (
                  <NoneDocumented />
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {shownMeds.map((med) => (
                      <Badge key={med.id} variant="info" size="sm">
                        {med.name}
                        {med.dosage && (
                          <span className="ml-1 opacity-75">{med.dosage}</span>
                        )}
                      </Badge>
                    ))}
                    {extraMeds > 0 && (
                      <Badge variant="outline" size="sm">
                        +{extraMeds} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Recent Encounters */}
              <div>
                <SectionLabel>Recent Encounters</SectionLabel>
                {encounterCount === 0 ? (
                  <NoneDocumented />
                ) : (
                  <p className="text-sm text-slate-700">
                    {encounterCount} encounter{encounterCount !== 1 ? 's' : ''} on record
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
