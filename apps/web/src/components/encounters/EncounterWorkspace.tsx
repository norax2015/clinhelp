'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useEncounter } from '@/hooks/useEncounters';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Alert } from '@/components/ui/Alert';
import { Tabs, TabsList, TabTrigger, TabContent } from '@/components/ui/Tabs';
import { TranscriptPanel } from './TranscriptPanel';
import { NotePanel } from './NotePanel';
import { CodingPanel } from './CodingPanel';
import { TaskPanel } from './TaskPanel';
import { VisitBriefPanel } from './VisitBriefPanel';
import { AskClinHelpPanel } from './AskClinHelpPanel';
import { formatDate, titleCase, formatMRN } from '@/lib/utils';
import { type Encounter, type EncounterStatus } from '@/types';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusVariant(status: EncounterStatus) {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'info';
    case 'scheduled': return 'warning';
    case 'cancelled': return 'danger';
    default: return 'default';
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EncounterWorkspaceProps {
  encounterId: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EncounterWorkspace({ encounterId }: EncounterWorkspaceProps) {
  const { data: encounter, isLoading, error, refetch } = useEncounter(encounterId);

  // Mobile tab layout state
  const [mobileTab, setMobileTab] = useState<string>('transcript');

  // Desktop: collapsible Coding & Tasks section
  const [codingOpen, setCodingOpen] = useState(true);
  const [codingTab, setCodingTab] = useState<string>('tasks');

  // Right panel scroll ref (used when transcript is done → jump to note)
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // ---------------------------------------------------------------------------
  // Loading / error states
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !encounter) {
    return (
      <Alert variant="error">
        Failed to load encounter.{' '}
        <button className="underline font-medium" onClick={() => refetch()}>
          Try again
        </button>
      </Alert>
    );
  }

  const enc = encounter as Encounter;
  const patient = enc.patient as
    | { id: string; firstName: string; lastName: string; mrn: string }
    | undefined;

  // ---------------------------------------------------------------------------
  // Callbacks
  // ---------------------------------------------------------------------------

  /** Called by TranscriptPanel when recording finishes. On desktop the note
   *  panel is already visible; we scroll it to the top. On mobile we switch
   *  the tab to "note". */
  function handleTranscriptReady() {
    // Mobile: switch tab
    setMobileTab('note');
    // Desktop: scroll right panel to top
    if (rightPanelRef.current) {
      rightPanelRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ---------------------------------------------------------------------------
  // Shared sub-components (to avoid duplication between mobile/desktop)
  // ---------------------------------------------------------------------------

  const notePanel = (
    <NotePanel
      encounterId={encounterId}
      specialty={(enc as unknown as Record<string, unknown>).specialty as string | undefined}
      visitType={enc.visitMode}
      chiefComplaint={enc.chiefComplaint ?? undefined}
      priorNoteContext={(enc as unknown as Record<string, unknown>).priorNoteContext as string | undefined}
    />
  );

  const transcriptPanel = (
    <TranscriptPanel
      encounterId={encounterId}
      onTranscriptReady={handleTranscriptReady}
    />
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/app/encounters" className="hover:text-navy-900 transition-colors">
          Encounters
        </Link>
        <ChevronRight size={14} />
        <span className="text-navy-900 font-medium">
          {patient ? `${patient.firstName} ${patient.lastName}` : enc.patientId} —{' '}
          {titleCase(enc.type)}
        </span>
      </nav>

      {/* Header card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-bold text-navy-900">
                {patient ? `${patient.firstName} ${patient.lastName}` : 'Encounter'}
              </h1>
              <Badge variant={statusVariant(enc.status)}>{titleCase(enc.status)}</Badge>

              {/* Pulsing "Session Active" indicator */}
              {enc.status === 'in_progress' && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  Session Active
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-1.5 text-sm text-slate-500">
              {patient && (
                <span>
                  MRN: <span className="font-mono">{formatMRN(patient.mrn)}</span>
                </span>
              )}
              <span>{titleCase(enc.type)}</span>
              <span>{titleCase(enc.visitMode)}</span>
              <span>{formatDate(enc.createdAt)}</span>
            </div>

            {enc.chiefComplaint && (
              <p className="text-sm text-slate-600 mt-2">
                <span className="font-medium">Chief complaint:</span> {enc.chiefComplaint}
              </p>
            )}
          </div>

          {patient && (
            <Link href={`/app/patients/${patient.id}`}>
              <Button variant="outline" size="sm">
                View Patient
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* ====================================================================
          DESKTOP layout (lg+): 2-column side-by-side
          ==================================================================== */}
      <div className="hidden lg:flex gap-4 items-start">
        {/* LEFT PANEL — 38% — Visit Brief + Transcript + collapsible Coding & Tasks */}
        <div className="w-[38%] flex-shrink-0 flex flex-col gap-3">
          {/* Visit Brief pre-visit summary */}
          {enc.patientId && (
            <VisitBriefPanel
              patientId={enc.patientId}
              chiefComplaint={enc.chiefComplaint ?? undefined}
              encounterType={enc.type}
            />
          )}

          {/* Transcript card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 min-h-0">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              Transcript
            </p>
            {transcriptPanel}
          </div>

          {/* Collapsible Coding & Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100">
            <button
              onClick={() => setCodingOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-navy-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <span>Coding &amp; Tasks</span>
              {codingOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {codingOpen && (
              <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                <Tabs defaultTab={codingTab} onChange={setCodingTab}>
                  <TabsList className="mb-4">
                    <TabTrigger value="tasks">Tasks</TabTrigger>
                    <TabTrigger value="coding">Coding</TabTrigger>
                  </TabsList>
                  <TabContent value="tasks">
                    <TaskPanel encounterId={encounterId} patientId={enc.patientId} />
                  </TabContent>
                  <TabContent value="coding">
                    <CodingPanel encounterId={encounterId} />
                  </TabContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL — flex-1 — Note editor + Ask AI */}
        <div
          ref={rightPanelRef}
          className="flex-1 min-w-0 flex flex-col gap-3 overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 220px)' }}
        >
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              Clinical Note
            </p>
            {notePanel}
          </div>

          {/* Ask ClinHelp AI panel */}
          <AskClinHelpPanel
            encounterId={encounterId}
            patientContext={
              patient
                ? `${patient.firstName} ${patient.lastName}, MRN: ${patient.mrn}`
                : undefined
            }
          />
        </div>
      </div>

      {/* ====================================================================
          MOBILE layout (md and below): tab-based
          ==================================================================== */}
      <div className="lg:hidden">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <Tabs defaultTab="brief" onChange={setMobileTab}>
            <TabsList className="mb-5">
              <TabTrigger value="brief">Brief</TabTrigger>
              <TabTrigger value="transcript">Transcript</TabTrigger>
              <TabTrigger value="note">Note</TabTrigger>
              <TabTrigger value="coding">Coding</TabTrigger>
              <TabTrigger value="tasks">Tasks</TabTrigger>
              <TabTrigger value="ask-ai">Ask AI</TabTrigger>
            </TabsList>

            <TabContent value="brief">
              {enc.patientId ? (
                <VisitBriefPanel
                  patientId={enc.patientId}
                  chiefComplaint={enc.chiefComplaint ?? undefined}
                  encounterType={enc.type}
                />
              ) : (
                <p className="text-sm text-slate-400 italic">No patient linked to this encounter.</p>
              )}
            </TabContent>

            <TabContent value="transcript">
              {transcriptPanel}
            </TabContent>

            <TabContent value="note">
              {notePanel}
            </TabContent>

            <TabContent value="coding">
              <CodingPanel encounterId={encounterId} />
            </TabContent>

            <TabContent value="tasks">
              <TaskPanel encounterId={encounterId} patientId={enc.patientId} />
            </TabContent>

            <TabContent value="ask-ai">
              <AskClinHelpPanel
                encounterId={encounterId}
                patientContext={
                  patient
                    ? `${patient.firstName} ${patient.lastName}, MRN: ${patient.mrn}`
                    : undefined
                }
              />
            </TabContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
