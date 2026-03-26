'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGenerateNote } from '@/hooks/useEncounters';
import { useNotes, useUpdateNote, useFinalizeNote, useSignNote, useRegenerateSection } from '@/hooks/useNotes';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { NoteVersionHistory } from '@/components/notes/NoteVersionHistory';
import { type Note, type NoteType } from '@/types';
import {
  Sparkles, Save, CheckCircle, AlertTriangle, Copy, Printer,
  ChevronDown, ChevronUp, RefreshCw, FileText, Download,
  RotateCcw, FlaskConical, Stethoscope, ClipboardList,
  ChevronsUpDown, Info, Wand2, PenLine, Settings,
} from 'lucide-react';
import { formatDateTime, titleCase } from '@/lib/utils';
import { SmartCommandBar } from '@/components/encounters/SmartCommandBar';
import { useAuth } from '@/hooks/useAuth';

// ─── Note Type Definitions ────────────────────────────────────────────────────

const NOTE_TYPE_OPTIONS = [
  { label: 'SOAP Note', value: 'SOAP' },
  { label: 'APSO Note', value: 'APSO' },
  { label: 'Progress Note', value: 'progress' },
  { label: 'Follow-Up Note', value: 'follow_up' },
  { label: 'Psychiatric Evaluation', value: 'psych_eval' },
  { label: 'Mental Status Exam', value: 'mse' },
  { label: 'Therapy / BH Note', value: 'therapy' },
  { label: 'Medication Management', value: 'med_management' },
  { label: 'H&P', value: 'H_and_P' },
  { label: 'Consult Note', value: 'consult' },
  { label: 'Procedure Note', value: 'procedure' },
  { label: 'Discharge Note', value: 'discharge' },
];

// Section schemas — mirrors the backend note-type-schemas.ts
const NOTE_SECTIONS: Record<string, string[]> = {
  SOAP:         ['Subjective', 'Objective', 'Assessment', 'Plan'],
  APSO:         ['Assessment', 'Plan', 'Subjective', 'Objective'],
  progress:     ['Reason for Visit', 'Interval History', 'Objective', 'Assessment', 'Plan'],
  follow_up:    ['Reason for Visit', 'Interval History', 'Current Status', 'Assessment', 'Plan'],
  psych_eval:   ['Chief Complaint', 'History of Present Illness', 'Psychiatric History', 'Medical History', 'Social History', 'Substance Use History', 'Mental Status Exam', 'Risk Assessment', 'Diagnosis', 'Treatment Plan', 'Follow-Up'],
  mse:          ['Appearance', 'Behavior', 'Speech', 'Mood', 'Affect', 'Thought Process', 'Thought Content', 'Perceptions', 'Cognition', 'Insight', 'Judgment'],
  therapy:      ['Session Focus', 'Interval Update', 'Interventions', 'Patient Response', 'Progress', 'Risk', 'Plan'],
  med_management: ['Reason for Visit', 'Interval Update', 'Medication Response', 'Mental Status Exam', 'Risk Assessment', 'Assessment', 'Plan'],
  H_and_P:      ['Chief Complaint', 'HPI', 'Past Medical History', 'Medications', 'Allergies', 'Family History', 'Social History', 'Review of Systems', 'Physical Exam', 'Assessment', 'Plan'],
  consult:      ['Reason for Consultation', 'HPI', 'Pertinent History', 'Exam / MSE', 'Assessment', 'Recommendations', 'Follow-Up'],
  procedure:    ['Indication', 'Consent', 'Procedure', 'Findings', 'Complications', 'Post-Procedure Plan'],
  discharge:    ['Admission Diagnoses', 'Hospital Course', 'Discharge Diagnoses', 'Discharge Condition', 'Medications', 'Follow-Up', 'Patient Instructions'],
};

// Color palette for sections (cycles through)
const SECTION_COLORS = [
  'border-blue-200 bg-blue-50/60',
  'border-teal-200 bg-teal-50/60',
  'border-amber-200 bg-amber-50/60',
  'border-purple-200 bg-purple-50/60',
  'border-rose-200 bg-rose-50/60',
  'border-indigo-200 bg-indigo-50/60',
  'border-emerald-200 bg-emerald-50/60',
  'border-orange-200 bg-orange-50/60',
];

const SECTION_HEADER_COLORS = [
  'text-blue-800', 'text-teal-800', 'text-amber-800', 'text-purple-800',
  'text-rose-800', 'text-indigo-800', 'text-emerald-800', 'text-orange-800',
];

// Specialty keyword → best default note type
const SPECIALTY_NOTE_PRESETS: Record<string, string> = {
  psychiatry: 'psych_eval',
  psychology: 'therapy',
  'behavioral health': 'therapy',
  'mental health': 'therapy',
  therapy: 'therapy',
  counseling: 'therapy',
  'primary care': 'SOAP',
  'family medicine': 'SOAP',
  'internal medicine': 'H_and_P',
  'addiction medicine': 'med_management',
  'substance use': 'med_management',
  neurology: 'H_and_P',
  cardiology: 'H_and_P',
  surgery: 'procedure',
  hospitalist: 'H_and_P',
};

// ─── Signature Helper ─────────────────────────────────────────────────────────

function buildSignatureLine(user: {
  firstName?: string; lastName?: string; title?: string; npi?: string; specialty?: string;
} | null): string {
  if (!user) return '';
  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  const creds = user.title ? `, ${user.title}` : '';
  const npiStr = user.npi ? ` | NPI: ${user.npi}` : '';
  const spec = user.specialty ? ` | ${user.specialty}` : '';
  return `${name}${creds}${npiStr}${spec}`;
}

// ─── Section Picker ───────────────────────────────────────────────────────────

function CustomSectionPicker({
  noteType, customSections, onChange,
}: {
  noteType: string;
  customSections: Set<string> | null;
  onChange: (v: Set<string> | null) => void;
}) {
  const allSections = NOTE_SECTIONS[noteType] ?? [];
  const active = customSections ?? new Set(allSections);

  function toggle(section: string) {
    const next = new Set(active);
    if (next.has(section)) {
      next.delete(section);
    } else {
      next.add(section);
    }
    // If all sections are selected again, go back to null (default)
    onChange(next.size === allSections.length ? null : next);
  }

  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wide">
          <Settings size={13} />
          Customize Note Sections
        </div>
        {customSections && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-xs text-teal-600 hover:text-teal-700 font-medium"
          >
            Reset all
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {allSections.map(section => {
          const isActive = active.has(section);
          return (
            <button
              key={section}
              type="button"
              onClick={() => toggle(section)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isActive
                  ? 'bg-teal-500 border-teal-500 text-white shadow-sm'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-teal-300 hover:text-teal-600'
              }`}
            >
              {section}
            </button>
          );
        })}
      </div>
      {customSections && (
        <p className="text-xs text-amber-600">
          {customSections.size} of {allSections.length} sections active — note will only include selected sections
        </p>
      )}
    </div>
  );
}

// ─── Section Parser ───────────────────────────────────────────────────────────

function parseNoteSections(content: string, noteType: string): Record<string, string> | null {
  const expectedSections = NOTE_SECTIONS[noteType] || NOTE_SECTIONS.SOAP;
  const sections: Record<string, string> = {};
  let found = 0;

  for (let i = 0; i < expectedSections.length; i++) {
    const sectionKey = expectedSections[i];
    const nextKey = expectedSections[i + 1];

    // Build a regex that handles: "SECTION KEY:", "Section Key:", "**Section Key:**", etc.
    const escapedKey = sectionKey.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
    const lookAhead = nextKey
      ? `(?=\\n+(?:${nextKey.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&').toUpperCase()}|${nextKey.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')}|\\*\\*${nextKey.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')}|\\*\\*${nextKey.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&').toUpperCase()})|$)`
      : '$';

    const re = new RegExp(
      `(?:^|\\n)\\**\\s*(?:${escapedKey.toUpperCase()}|${escapedKey})\\**[:\\s]*\\n?([\\s\\S]*?)${lookAhead}`,
      'i',
    );
    const m = content.match(re);
    if (m?.[1]?.trim()) {
      sections[sectionKey] = m[1].trim();
      found++;
    }
  }

  return found >= Math.min(2, expectedSections.length) ? sections : null;
}

// ─── EHR-Clean Copy ───────────────────────────────────────────────────────────

function formatForEHR(content: string, sections: Record<string, string> | null, noteType: string): string {
  if (sections) {
    const expectedOrder = NOTE_SECTIONS[noteType] || Object.keys(sections);
    return expectedOrder
      .filter(key => sections[key])
      .map(key => `${key.toUpperCase()}\n${sections[key]}`)
      .join('\n\n');
  }
  // Strip common markdown artifacts from raw text
  return content
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // bold
    .replace(/\*([^*]+)\*/g, '$1')       // italic
    .replace(/#{1,6}\s+/g, '')           // headings
    .replace(/`([^`]+)`/g, '$1')         // inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .trim();
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
  label, content, colorClass, headerColorClass, onChange, disabled,
  onRegenerate, isRegenerating,
}: {
  label: string;
  content: string;
  colorClass: string;
  headerColorClass: string;
  onChange: (v: string) => void;
  disabled: boolean;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`border rounded-xl overflow-hidden ${colorClass}`}>
      <div className={`flex items-center justify-between px-4 py-2.5 ${headerColorClass}`}>
        <button
          onClick={() => setCollapsed(v => !v)}
          className="flex items-center gap-2 font-semibold text-xs uppercase tracking-wide flex-1 text-left"
        >
          {label}
          {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
        </button>
        {onRegenerate && !disabled && (
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            title={`Regenerate ${label} section`}
            className="flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30 ml-2 flex-shrink-0"
          >
            {isRegenerating
              ? <Spinner size="sm" />
              : <RotateCcw size={11} />}
            <span className="hidden sm:inline">Regen</span>
          </button>
        )}
      </div>
      {!collapsed && (
        <textarea
          value={content}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          rows={Math.max(3, Math.ceil(content.length / 80))}
          className="w-full px-4 py-3 text-sm bg-white/70 border-t text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500 resize-y disabled:opacity-60 font-mono leading-relaxed"
        />
      )}
    </div>
  );
}

// ─── Structured Intake Form ───────────────────────────────────────────────────

interface IntakeFields {
  hpi: string;
  symptoms: string;
  vitals: string;
  medications: string;
  allergies: string;
  labs: string;
  assessmentClues: string;
  planItems: string;
  todayUpdates: string;
  customInstructions: string;
}

function StructuredIntakePanel({
  fields, onChange, noteType,
}: {
  fields: IntakeFields;
  onChange: (key: keyof IntakeFields, val: string) => void;
  noteType: string;
}) {
  const showPsych = ['psych_eval', 'mse', 'therapy', 'med_management'].includes(noteType);
  const showProcedure = noteType === 'procedure';
  const showDischarge = noteType === 'discharge';

  const Field = ({ label, k, rows = 2, placeholder }: { label: string; k: keyof IntakeFields; rows?: number; placeholder?: string }) => (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <textarea
        value={fields[k]}
        onChange={e => onChange(k, e.target.value)}
        placeholder={placeholder ?? `Enter ${label.toLowerCase()}...`}
        rows={rows}
        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-400 resize-y"
      />
    </div>
  );

  return (
    <div className="space-y-3 border border-slate-200 rounded-xl p-4 bg-slate-50/50">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wide">
        <ClipboardList size={13} />
        Structured Clinical Inputs
        <span className="font-normal text-slate-400 normal-case">(optional — improves note quality)</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="HPI / Reason for Visit" k="hpi" rows={3} placeholder="History of present illness, reason for today's visit..." />
        <Field label="Symptoms" k="symptoms" placeholder="Current symptoms, duration, severity..." />
        {!showPsych && !showProcedure && !showDischarge && (
          <Field label="Vitals" k="vitals" placeholder="BP, HR, RR, Temp, SpO2, Weight..." />
        )}
        <Field label="Current Medications" k="medications" placeholder="Name, dose, frequency, adherence..." />
        <Field label="Allergies" k="allergies" placeholder="Drug allergies and reactions..." />
        {!showPsych && (
          <Field label="Labs / Diagnostics" k="labs" placeholder="Recent labs, imaging, test results..." />
        )}
        {showPsych && (
          <Field label="Today's Clinical Updates" k="todayUpdates" rows={3} placeholder="Changes since last visit, events, stressors, medication response..." />
        )}
        <Field label="Assessment Clues / Impressions" k="assessmentClues" placeholder="Diagnostic impression, differential, concerns..." />
        <Field label="Plan Items" k="planItems" placeholder="Medication changes, referrals, orders, follow-up..." />
        <div className="sm:col-span-2">
          <Field label="Provider Custom Instructions" k="customInstructions" rows={2} placeholder="e.g. 'Include risk stratification language' or 'Use concise style'..." />
        </div>
      </div>
    </div>
  );
}

// ─── Main NotePanel ───────────────────────────────────────────────────────────

interface NotePanelProps {
  encounterId: string;
  priorNoteContext?: string;
  specialty?: string;
  visitType?: string;
  chiefComplaint?: string;
}

export function NotePanel({ encounterId, priorNoteContext, specialty, visitType, chiefComplaint }: NotePanelProps) {
  const [noteType, setNoteType] = useState<string>('SOAP');
  const [editedContent, setEditedContent] = useState('');
  const [parsedSections, setParsedSections] = useState<Record<string, string> | null>(null);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'structured' | 'raw'>('structured');
  const [priorNote, setPriorNote] = useState(priorNoteContext || '');
  const [showPriorNote, setShowPriorNote] = useState(false);
  const [showIntake, setShowIntake] = useState(false);
  const [regenSection, setRegenSection] = useState<string | null>(null);
  const [regenSectionContext, setRegenSectionContext] = useState('');
  const [showRegenInput, setShowRegenInput] = useState<string | null>(null);
  const [intakeFields, setIntakeFields] = useState<IntakeFields>({
    hpi: '', symptoms: '', vitals: '', medications: '', allergies: '',
    labs: '', assessmentClues: '', planItems: '', todayUpdates: '',
    customInstructions: '',
  });
  const [customSections, setCustomSections] = useState<Set<string> | null>(null);
  const [showSectionPicker, setShowSectionPicker] = useState(false);

  const { user } = useAuth();

  const { data: notesData, isLoading: notesLoading } = useNotes({ encounterId, limit: 10 });
  const notes = (notesData?.data ?? []) as Note[];
  const generateNote = useGenerateNote(encounterId);
  const updateNote = useUpdateNote(activeNote?.id ?? '');
  const finalizeNote = useFinalizeNote(activeNote?.id ?? '');
  const signNote = useSignNote(activeNote?.id ?? '');
  const regenSectionMutation = useRegenerateSection();

  const syncSections = useCallback(
    (c: string) => setParsedSections(parseNoteSections(c, noteType)),
    [noteType],
  );

  useEffect(() => {
    if (notes.length > 0 && !activeNote) {
      const latest = notes[0];
      setActiveNote(latest);
      const c = typeof latest.content === 'string' ? latest.content : JSON.stringify(latest.content, null, 2);
      setEditedContent(c);
      // Try to match note type from stored note
      if (latest.type) setNoteType(latest.type);
      syncSections(c);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes]);

  // Auto-select note type based on provider specialty on first mount
  useEffect(() => {
    const spec = specialty ?? user?.specialty ?? '';
    if (!spec) return;
    const specLower = spec.toLowerCase();
    for (const [key, preset] of Object.entries(SPECIALTY_NOTE_PRESETS)) {
      if (specLower.includes(key)) {
        setNoteType(preset);
        break;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-parse sections and reset section picker when note type changes
  useEffect(() => {
    if (editedContent) syncSections(editedContent);
    setCustomSections(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteType]);

  function updateSection(section: string, value: string) {
    if (!parsedSections) return;
    const updated = { ...parsedSections, [section]: value };
    setParsedSections(updated);
    const expectedOrder = NOTE_SECTIONS[noteType] || Object.keys(updated);
    const rebuilt = expectedOrder
      .filter(k => updated[k])
      .map(k => `${k.toUpperCase()}\n${updated[k]}`)
      .join('\n\n');
    setEditedContent(rebuilt);
  }

  async function handleGenerate() {
    setGenerateError(null);
    try {
      const res = await generateNote.mutateAsync({
        noteType,
        priorNoteContext: priorNote || undefined,
        specialty: specialty || undefined,
        visitType: visitType || undefined,
        chiefComplaint: chiefComplaint || intakeFields.hpi ? (chiefComplaint || intakeFields.hpi) : undefined,
        hpi: intakeFields.hpi || undefined,
        symptoms: intakeFields.symptoms || undefined,
        vitals: intakeFields.vitals || undefined,
        medications: intakeFields.medications || undefined,
        allergies: intakeFields.allergies || undefined,
        labs: intakeFields.labs || undefined,
        assessmentClues: intakeFields.assessmentClues || undefined,
        planItems: intakeFields.planItems || undefined,
        todayUpdates: intakeFields.todayUpdates || undefined,
        customInstructions: (() => {
          const sectionsNote = customSections && customSections.size > 0
            ? `Only include these sections: ${[...customSections].join(', ')}.`
            : '';
          const combined = [intakeFields.customInstructions, sectionsNote].filter(Boolean).join(' ');
          return combined || undefined;
        })(),
      } as Parameters<typeof generateNote.mutateAsync>[0]);
      const generated = (res as { data?: { data?: Note } })?.data?.data || (res as { note?: Note })?.note || res as Note;
      if (generated?.content) {
        setActiveNote(generated);
        const c = typeof generated.content === 'string' ? generated.content : JSON.stringify(generated.content, null, 2);
        setEditedContent(c);
        syncSections(c);
        setViewMode('structured');
      }
    } catch {
      setGenerateError('Failed to generate note. Please check your inputs and try again.');
    }
  }

  async function handleRegenerateSection(sectionKey: string) {
    if (!activeNote) return;
    setRegenSection(sectionKey);
    try {
      const result = await regenSectionMutation.mutateAsync({
        noteId: activeNote.id,
        sectionKey,
        currentNoteText: editedContent,
        additionalContext: regenSectionContext || undefined,
        specialty: specialty || undefined,
      });
      // Inject the regenerated section into current sections
      if (result?.content && parsedSections) {
        // Strip the header line from returned content (backend returns "SECTION:\ncontent")
        const lines = result.content.split('\n');
        const headerLine = lines[0].toUpperCase();
        const isHeader = headerLine.startsWith(sectionKey.toUpperCase());
        const newContent = isHeader ? lines.slice(1).join('\n').trim() : result.content.trim();
        updateSection(sectionKey, newContent);
      }
      setShowRegenInput(null);
      setRegenSectionContext('');
    } catch {
      // silent — user can retry
    } finally {
      setRegenSection(null);
    }
  }

  async function handleSave() {
    if (!activeNote) return;
    setSaveSuccess(false);
    try {
      await updateNote.mutateAsync({ content: editedContent });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch { /* silent */ }
  }

  async function handleFinalize() {
    if (!activeNote) return;
    try {
      await updateNote.mutateAsync({ content: editedContent });
      const updated = await finalizeNote.mutateAsync();
      setActiveNote((updated as unknown as { data: Note }).data ?? (updated as unknown as Note));
    } catch { /* silent */ }
  }

  async function handleSign() {
    if (!activeNote) return;
    try {
      const updated = await signNote.mutateAsync();
      setActiveNote((updated as unknown as { data: Note }).data ?? (updated as unknown as Note));
    } catch { /* silent */ }
  }

  async function handleCopyEHR() {
    try {
      const cleanText = formatForEHR(editedContent, parsedSections, noteType);
      await navigator.clipboard.writeText(cleanText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = formatForEHR(editedContent, parsedSections, noteType);
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  }

  function handleExportText() {
    let cleanText = formatForEHR(editedContent, parsedSections, noteType);
    if (isSigned && user) {
      const sigLine = buildSignatureLine(user);
      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      cleanText += `\n\n${'─'.repeat(60)}\nElectronically Signed By: ${sigLine}\nDate Signed: ${dateStr}`;
    }
    const noteLabel = NOTE_TYPE_OPTIONS.find(o => o.value === noteType)?.label || noteType;
    const ts = new Date().toISOString().slice(0, 10);
    const blob = new Blob([cleanText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinical-note-${noteLabel.replace(/\s+/g, '-').toLowerCase()}-${ts}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    const win = window.open('', '_blank');
    if (!win) return;
    const ts = activeNote ? formatDateTime(activeNote.updatedAt) : 'Draft';
    const noteLabel = NOTE_TYPE_OPTIONS.find(o => o.value === noteType)?.label || noteType;
    const cleanText = formatForEHR(editedContent, parsedSections, noteType);
    win.document.write(`<!DOCTYPE html><html><head><title>${noteLabel} — ClinHelp</title>
<style>
  body{font-family:Georgia,serif;font-size:12pt;line-height:1.7;max-width:720px;margin:40px auto;color:#1a1a1a}
  h1{font-size:16pt;border-bottom:2px solid #1a3a5c;padding-bottom:8px;margin-bottom:4px;color:#1a3a5c}
  .meta{font-size:10pt;color:#666;margin-bottom:24px}
  .section-title{font-size:11pt;font-weight:bold;text-transform:uppercase;letter-spacing:0.05em;color:#1a3a5c;margin-top:20px;margin-bottom:4px;border-bottom:1px solid #eee;padding-bottom:2px}
  .section-body{margin:0 0 16px 0;white-space:pre-wrap;font-size:11pt}
  .disclaimer{font-size:9pt;color:#888;border-top:1px solid #eee;padding-top:12px;margin-top:32px;font-style:italic}
  @media print{body{margin:20mm}}
</style></head>
<body>
  <h1>${noteLabel}</h1>
  <div class="meta">ClinHelp | ${ts}${activeNote?.aiGenerated ? ' | AI-Assisted Draft — Clinician Reviewed' : ''}</div>
`);
    if (parsedSections) {
      const order = NOTE_SECTIONS[noteType] || Object.keys(parsedSections);
      order.filter(k => parsedSections[k]).forEach(k => {
        win.document.write(`<div class="section-title">${k}</div><div class="section-body">${parsedSections[k].replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>`);
      });
    } else {
      win.document.write(`<pre style="white-space:pre-wrap;font-size:11pt">${cleanText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`);
    }
    win.document.write(`<div class="disclaimer">AI-assisted draft reviewed by treating provider. Not a substitute for clinical judgment. Must be reviewed and finalized by the treating clinician before use.</div>`);
    if (isSigned && user) {
      const sigLine = buildSignatureLine(user).replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      win.document.write(`<div style="margin-top:24px;padding-top:12px;border-top:2px solid #1a3a5c;font-size:10pt"><p style="margin:4px 0"><strong>Electronically Signed By:</strong> ${sigLine}</p><p style="margin:4px 0;color:#555;font-size:9pt">Date Signed: ${dateStr}</p></div>`);
    }
    win.document.write(`</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  }

  const isFinalized = activeNote?.status === 'finalized' || activeNote?.status === 'signed';
  const isSigned = activeNote?.status === 'signed';
  const hasSections = parsedSections && Object.keys(parsedSections).length >= 2;
  const hasContent = editedContent.trim().length > 0;
  const noteTypeLabel = NOTE_TYPE_OPTIONS.find(o => o.value === noteType)?.label || noteType;
  const hasIntakeData = Object.values(intakeFields).some(v => v.trim().length > 0);
  const allSectionsList = NOTE_SECTIONS[noteType] ?? Object.keys(parsedSections ?? {});
  const activeSectionsList = customSections
    ? allSectionsList.filter(s => customSections.has(s))
    : allSectionsList;

  return (
    <div className="space-y-4">

      {/* ── Top bar: note type + generate ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div className="w-full sm:w-64">
          <Select
            label="Note Type"
            options={NOTE_TYPE_OPTIONS}
            value={noteType}
            onChange={e => setNoteType(e.target.value)}
            disabled={isFinalized}
          />
        </div>
        <Button
          variant="accent"
          size="md"
          leftIcon={generateNote.isPending ? <Spinner size="sm" /> : <Sparkles size={15} />}
          isLoading={generateNote.isPending}
          onClick={handleGenerate}
          disabled={isFinalized}
          className="sm:min-w-[180px]"
        >
          {generateNote.isPending ? 'Generating…' : 'Generate Smart Note'}
        </Button>
        {activeNote && (
          <Badge variant={isFinalized ? 'success' : activeNote.status === 'draft' ? 'warning' : 'default'}>
            {titleCase(activeNote.status.replace(/_/g, ' '))}
          </Badge>
        )}
        {hasIntakeData && (
          <span className="text-xs text-teal-600 flex items-center gap-1">
            <FlaskConical size={11} /> Structured inputs active
          </span>
        )}
      </div>

      {/* ── Expandable: structured intake ─────────────────────────────────── */}
      <div>
        <button
          onClick={() => setShowIntake(v => !v)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-navy-900 font-medium transition-colors"
        >
          <Stethoscope size={12} />
          {showIntake ? 'Hide' : 'Add'} structured clinical inputs
          {hasIntakeData && <span className="ml-1 bg-teal-100 text-teal-700 px-1.5 rounded-full">active</span>}
          <ChevronsUpDown size={11} className="opacity-50" />
        </button>
        {showIntake && (
          <div className="mt-2">
            <StructuredIntakePanel
              fields={intakeFields}
              onChange={(k, v) => setIntakeFields(prev => ({ ...prev, [k]: v }))}
              noteType={noteType}
            />
          </div>
        )}
      </div>

      {/* ── Expandable: prior note context ────────────────────────────────── */}
      <div>
        <button
          onClick={() => setShowPriorNote(v => !v)}
          className="flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          <RefreshCw size={12} />
          {showPriorNote ? 'Hide' : 'Add'} prior note context
          {priorNote && <span className="ml-1 bg-teal-100 text-teal-700 px-1.5 rounded-full">active</span>}
        </button>
        {showPriorNote && (
          <div className="mt-2 space-y-1.5">
            <label className="block text-xs font-medium text-slate-600">
              Prior Note or Clinical Context
              <span className="ml-1 font-normal text-slate-400">(improves follow-up continuity)</span>
            </label>
            <textarea
              value={priorNote}
              onChange={e => setPriorNote(e.target.value)}
              placeholder="Paste the previous visit note, relevant history, or key clinical context..."
              rows={5}
              className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
            />
          </div>
        )}
      </div>

      {/* ── Section customizer ─────────────────────────────────────────────── */}
      {!isFinalized && (
        <div>
          <button
            onClick={() => setShowSectionPicker(v => !v)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-navy-900 font-medium transition-colors"
          >
            <Settings size={12} />
            {showSectionPicker ? 'Hide' : 'Customize'} note sections
            {customSections && (
              <span className="ml-1 bg-amber-100 text-amber-700 px-1.5 rounded-full">
                {customSections.size} active
              </span>
            )}
            <ChevronsUpDown size={11} className="opacity-50" />
          </button>
          {showSectionPicker && (
            <div className="mt-2">
              <CustomSectionPicker
                noteType={noteType}
                customSections={customSections}
                onChange={setCustomSections}
              />
            </div>
          )}
        </div>
      )}

      {/* ── Alerts ────────────────────────────────────────────────────────── */}
      {generateError && <Alert variant="error" onDismiss={() => setGenerateError(null)}>{generateError}</Alert>}
      {saveSuccess && <Alert variant="success" onDismiss={() => setSaveSuccess(false)}>Draft saved successfully.</Alert>}
      {copySuccess && (
        <Alert variant="success" onDismiss={() => setCopySuccess(false)}>
          ✓ Note copied to clipboard — ready to paste into your EHR.
        </Alert>
      )}

      {/* ── Main note area ─────────────────────────────────────────────────── */}
      {notesLoading ? (
        <div className="flex items-center justify-center py-12"><Spinner /></div>
      ) : (
        <>
          {/* View mode toggle */}
          {hasContent && hasSections && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">View:</span>
              {(['structured', 'raw'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                    viewMode === m
                      ? 'bg-teal-100 text-teal-700 ring-1 ring-teal-300'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {m === 'structured' ? '⊞ Structured' : '≡ Raw Text'}
                </button>
              ))}
              <span className="text-xs text-slate-400 ml-1">{noteTypeLabel}</span>
              <span className="ml-auto text-xs text-slate-400 flex items-center gap-1">
                <kbd className="inline-flex items-center px-1.5 py-0.5 border border-slate-200 rounded text-xs font-mono bg-slate-50 text-slate-500">⌘K</kbd>
                for commands
              </span>
            </div>
          )}

          {/* Empty state */}
          {!hasContent && !generateNote.isPending && (
            <div className="flex flex-col items-center justify-center py-14 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <Wand2 size={28} className="text-slate-300 mb-3" />
              <p className="text-sm font-medium text-slate-500">No note generated yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Select a note type, optionally add clinical inputs, then click{' '}
                <span className="font-semibold text-teal-600">Generate Smart Note</span>.
              </p>
            </div>
          )}

          {/* Structured section view */}
          {hasContent && hasSections && viewMode === 'structured' && (
            <div className="space-y-3">
              {activeSectionsList
                .filter(k => parsedSections![k])
                .map((section, idx) => (
                  <div key={section}>
                    <SectionCard
                      label={section}
                      content={parsedSections![section]}
                      colorClass={SECTION_COLORS[idx % SECTION_COLORS.length]}
                      headerColorClass={SECTION_HEADER_COLORS[idx % SECTION_HEADER_COLORS.length]}
                      onChange={v => updateSection(section, v)}
                      disabled={isFinalized}
                      onRegenerate={activeNote ? () => {
                        if (showRegenInput === section) {
                          handleRegenerateSection(section);
                        } else {
                          setShowRegenInput(section);
                        }
                      } : undefined}
                      isRegenerating={regenSection === section && regenSectionMutation.isPending}
                    />
                    {/* Inline context for section regen */}
                    {showRegenInput === section && !isFinalized && (
                      <div className="mt-1.5 flex gap-2 items-start pl-2">
                        <input
                          type="text"
                          value={regenSectionContext}
                          onChange={e => setRegenSectionContext(e.target.value)}
                          placeholder="Optional: add context for this regeneration (e.g. 'patient denies SI')..."
                          className="flex-1 text-xs px-3 py-1.5 border border-teal-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleRegenerateSection(section);
                            if (e.key === 'Escape') { setShowRegenInput(null); setRegenSectionContext(''); }
                          }}
                          autoFocus
                        />
                        <Button size="sm" variant="accent" onClick={() => handleRegenerateSection(section)}
                          isLoading={regenSection === section && regenSectionMutation.isPending}>
                          Regen
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { setShowRegenInput(null); setRegenSectionContext(''); }}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* Raw text view or no-sections view */}
          {hasContent && (!hasSections || viewMode === 'raw') && (
            <div className="relative">
              <textarea
                value={editedContent}
                onChange={e => {
                  setEditedContent(e.target.value);
                  syncSections(e.target.value);
                }}
                disabled={isFinalized}
                placeholder={generateNote.isPending ? 'Generating…' : `${noteTypeLabel} will appear here after generation.`}
                className="w-full min-h-[360px] p-4 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y disabled:opacity-60 disabled:cursor-not-allowed font-mono leading-relaxed"
              />
              {generateNote.isPending && (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-xl gap-3">
                  <Spinner size="lg" />
                  <p className="text-sm text-teal-600 font-medium">Generating {noteTypeLabel}…</p>
                  <p className="text-xs text-slate-400">This takes a few seconds</p>
                </div>
              )}
            </div>
          )}

          {/* Loading overlay for raw area */}
          {!hasContent && generateNote.isPending && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Spinner size="lg" />
              <p className="text-sm text-teal-600 font-medium">Generating {noteTypeLabel}…</p>
            </div>
          )}

          {/* ── SmartCommandBar ────────────────────────────────────────────── */}
          {hasContent && !isFinalized && (
            <SmartCommandBar
              noteContent={editedContent}
              noteType={noteType}
              encounterId={encounterId}
              noteId={activeNote?.id}
              onCommandResult={(result, command) => {
                setEditedContent(result);
                syncSections(result);
              }}
            />
          )}

          {/* ── Disclaimer ─────────────────────────────────────────────────── */}
          {hasContent && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                AI-assisted draft for clinician review only. Not a substitute for clinical judgment.
                Always review, edit, and verify before finalizing.
              </p>
            </div>
          )}

          {/* ── Action row ─────────────────────────────────────────────────── */}
          <div className="flex gap-2 flex-wrap items-center">
            {activeNote?.status === 'draft' && (
              <>
                <Button
                  variant="outline" size="sm"
                  leftIcon={updateNote.isPending ? <Spinner size="sm" /> : <Save size={13} />}
                  isLoading={updateNote.isPending}
                  onClick={handleSave}
                >
                  Save Draft
                </Button>
                <Button
                  variant="primary" size="sm"
                  leftIcon={finalizeNote.isPending ? <Spinner size="sm" /> : <CheckCircle size={13} />}
                  isLoading={finalizeNote.isPending}
                  onClick={handleFinalize}
                >
                  Finalize Note
                </Button>
              </>
            )}
            {activeNote?.status === 'finalized' && (
              <Button
                variant="accent" size="sm"
                leftIcon={signNote.isPending ? <Spinner size="sm" /> : <PenLine size={13} />}
                isLoading={signNote.isPending}
                onClick={handleSign}
              >
                Sign Note
              </Button>
            )}

            {hasContent && (
              <>
                {/* Primary EHR copy — visually prominent */}
                <Button
                  variant={copySuccess ? 'outline' : 'accent'}
                  size="sm"
                  leftIcon={copySuccess ? <CheckCircle size={13} className="text-green-600" /> : <Copy size={13} />}
                  onClick={handleCopyEHR}
                  className={copySuccess ? 'border-green-300 text-green-700 bg-green-50' : ''}
                >
                  {copySuccess ? 'Copied for EHR ✓' : 'Copy Note to EHR'}
                </Button>

                <Button
                  variant="ghost" size="sm"
                  leftIcon={<Download size={13} />}
                  onClick={handleExportText}
                >
                  Export .txt
                </Button>
                <Button
                  variant="ghost" size="sm"
                  leftIcon={<Printer size={13} />}
                  onClick={handlePrint}
                >
                  Print
                </Button>
              </>
            )}
          </div>

          {/* ── Metadata ───────────────────────────────────────────────────── */}
          {activeNote && (
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <FileText size={12} />
              <span>Updated {formatDateTime(activeNote.updatedAt)}</span>
              {activeNote.aiGenerated && <span className="text-teal-500">· AI-assisted</span>}
              {isFinalized && <span className="text-green-600 font-medium">· Finalized</span>}
            </div>
          )}

          {/* ── Version history ────────────────────────────────────────────── */}
          {activeNote && (
            <div className="pt-2 border-t border-slate-100">
              <NoteVersionHistory noteId={activeNote.id} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
