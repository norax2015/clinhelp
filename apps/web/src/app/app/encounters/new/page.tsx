'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateEncounter } from '@/hooks/useEncounters';
import { usePatients } from '@/hooks/usePatients';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { Spinner } from '@/components/ui/Spinner';
import type { EncounterType, VisitMode, Patient } from '@/types';
import { ChevronRight, Search, X, User, RefreshCw, Mic, MicOff, Wand2 } from 'lucide-react';

const ENCOUNTER_TYPES: { label: string; value: EncounterType }[] = [
  { label: 'Intake Evaluation', value: 'intake' },
  { label: 'Follow-Up', value: 'follow_up' },
  { label: 'Therapy Session', value: 'therapy' },
  { label: 'Medication Management', value: 'med_management' },
];

const VISIT_MODES: { label: string; value: VisitMode }[] = [
  { label: 'In-Person', value: 'in_person' },
  { label: 'Telehealth', value: 'telehealth' },
  { label: 'Phone', value: 'phone' },
  { label: 'Async / Portal', value: 'async' },
];

const SPECIALTIES = [
  { label: 'General / Not Specified', value: '' },
  { label: 'Psychiatry / Behavioral Health', value: 'psychiatry' },
  { label: 'Addiction Medicine', value: 'addiction_medicine' },
  { label: 'Primary Care / Internal Medicine', value: 'primary_care' },
  { label: 'Pediatrics', value: 'pediatrics' },
  { label: 'Therapy / Counseling', value: 'therapy' },
  { label: 'Care Coordination', value: 'care_coordination' },
];

// ---------------------------------------------------------------------------
// useVoiceInput hook
// ---------------------------------------------------------------------------
function useVoiceInput(onResult: (text: string, final: boolean) => void) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

  function start() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    recRef.current = rec;
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    rec.onresult = (e: any) => {
      const results = Array.from(e.results) as any[];
      const transcript = results.map((r: any) => r[0].transcript).join('');
      const isFinal = results[results.length - 1].isFinal;
      onResult(transcript, isFinal);
    };
    rec.start();
  }

  function stop() {
    recRef.current?.stop();
    setListening(false);
  }

  return { listening, supported, start, stop };
}

// ---------------------------------------------------------------------------
// MicButton component
// ---------------------------------------------------------------------------
function MicButton({
  listening,
  supported,
  onStart,
  onStop,
  size = 'sm',
}: {
  listening: boolean;
  supported: boolean;
  onStart: () => void;
  onStop: () => void;
  size?: 'sm' | 'md';
}) {
  if (!supported) return null;
  const base = size === 'md' ? 'p-2.5 rounded-xl' : 'p-1.5 rounded-lg';
  return (
    <button
      type="button"
      onClick={listening ? onStop : onStart}
      title={listening ? 'Stop recording' : 'Dictate (voice input)'}
      className={`${base} transition-all flex-shrink-0 ${
        listening
          ? 'bg-red-100 text-red-600 animate-pulse ring-2 ring-red-300'
          : 'bg-slate-100 text-slate-500 hover:bg-teal-50 hover:text-teal-600'
      }`}
    >
      {listening ? <MicOff size={size === 'md' ? 18 : 14} /> : <Mic size={size === 'md' ? 18 : 14} />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function NewEncounterPage() {
  const router = useRouter();
  const createEncounter = useCreateEncounter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [patientQuery, setPatientQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [encounterType, setEncounterType] = useState<EncounterType>('follow_up');
  const [visitMode, setVisitMode] = useState<VisitMode>('in_person');
  const [specialty, setSpecialty] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [priorNoteContext, setPriorNoteContext] = useState('');
  const [showPriorNote, setShowPriorNote] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Voice interim state
  const [chiefComplaintInterim, setChiefComplaintInterim] = useState('');
  const [priorNoteInterim, setPriorNoteInterim] = useState('');

  const { data: searchData, isLoading: searching } = usePatients(
    patientQuery.length >= 2 ? { search: patientQuery, limit: 8 } : undefined
  );
  const results = (searchData?.data ?? []) as Patient[];

  // Voice hook instances
  const ccVoice = useVoiceInput((text, final) => {
    if (final) {
      setChiefComplaint(prev => (prev ? prev.trimEnd() + ' ' + text : text));
      setChiefComplaintInterim('');
    } else {
      setChiefComplaintInterim(text);
    }
  });

  const priorVoice = useVoiceInput((text, final) => {
    if (final) {
      setPriorNoteContext(prev => (prev ? prev.trimEnd() + ' ' + text : text));
      setPriorNoteInterim('');
    } else {
      setPriorNoteInterim(text);
    }
  });

  const searchVoice = useVoiceInput((text, final) => {
    if (final || text.length > 2) {
      setPatientQuery(text);
      if (text.length >= 2) setDropdownOpen(true);
    }
  });

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  function pickPatient(p: Patient) {
    setSelectedPatient(p);
    setPatientQuery(`${p.firstName} ${p.lastName}`);
    setDropdownOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!selectedPatient) { setError('Please search for and select a patient.'); return; }
    try {
      const res = await createEncounter.mutateAsync({
        patientId: selectedPatient.id,
        type: encounterType,
        visitMode,
        chiefComplaint: chiefComplaint.trim() || undefined,
        specialty: specialty || undefined,
        priorNoteContext: priorNoteContext.trim() || undefined,
      });
      const created = res.data as { id: string } | undefined;
      router.push(created?.id ? `/app/encounters/${created.id}` : '/app/encounters');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Failed to create encounter. Please try again.');
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link href="/app/encounters" className="hover:text-navy-900 transition-colors">Encounters</Link>
        <ChevronRight size={14} />
        <span className="text-navy-900 font-medium">New Encounter</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-navy-900">Start New Encounter</h1>
        <p className="text-slate-500 text-sm mt-1">Search for a patient and configure the encounter before opening the workspace.</p>
      </div>

      {error && <Alert variant="error" onDismiss={() => setError(null)}>{error}</Alert>}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        {/* Smart input hint */}
        <div className="flex items-start gap-2.5 p-3 bg-teal-50 border border-teal-200 rounded-lg mb-5">
          <Wand2 size={15} className="text-teal-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-teal-700">
            <span className="font-semibold">Smart voice input available.</span> Tap the{' '}
            <Mic size={10} className="inline text-teal-600" /> mic icon on any field to dictate instead of type.
            Works in Chrome and Edge.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Patient search */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Patient <span className="text-red-500">*</span>
            </label>
            {selectedPatient ? (
              <div className="flex items-center gap-3 px-3 py-2.5 border border-teal-300 bg-teal-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-teal-200 flex items-center justify-center text-teal-700 font-semibold text-sm flex-shrink-0">
                  {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-navy-900">{selectedPatient.firstName} {selectedPatient.lastName}</div>
                  <div className="text-xs text-slate-500">MRN: {selectedPatient.mrn}</div>
                </div>
                <button type="button" onClick={() => { setSelectedPatient(null); setPatientQuery(''); }} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="relative flex items-center gap-2">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                  <input
                    type="text"
                    value={patientQuery}
                    onChange={e => { setPatientQuery(e.target.value); setDropdownOpen(true); }}
                    onFocus={() => setDropdownOpen(true)}
                    placeholder="Search by name or MRN..."
                    className="w-full pl-9 pr-16 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {searching && patientQuery.length >= 2 && <Spinner size="sm" />}
                    <MicButton
                      listening={searchVoice.listening}
                      supported={searchVoice.supported}
                      onStart={searchVoice.start}
                      onStop={searchVoice.stop}
                    />
                  </div>
                </div>
                {searchVoice.listening && (
                  <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                    <Mic size={10} className="animate-pulse" /> Listening for patient name...
                  </p>
                )}
                {dropdownOpen && patientQuery.length >= 2 && (
                  <div className="absolute z-20 top-full mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                    {searching ? (
                      <div className="px-4 py-3 text-sm text-slate-500 flex items-center gap-2"><Spinner size="sm" /> Searching...</div>
                    ) : results.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-slate-500">No patients found</div>
                    ) : (
                      <ul className="max-h-52 overflow-y-auto divide-y divide-slate-50">
                        {results.map(p => (
                          <li key={p.id}>
                            <button type="button" onClick={() => pickPatient(p)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors">
                              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-xs flex-shrink-0">
                                {p.firstName[0]}{p.lastName[0]}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-navy-900">{p.firstName} {p.lastName}</div>
                                <div className="text-xs text-slate-400">MRN: {p.mrn}</div>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="border-t border-slate-100 px-4 py-2">
                      <Link href="/app/patients" className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
                        <User size={12} /> Browse all patients
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <Select label="Encounter Type" options={ENCOUNTER_TYPES} value={encounterType}
            onChange={e => setEncounterType(e.target.value as EncounterType)} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Visit Mode" options={VISIT_MODES} value={visitMode}
              onChange={e => setVisitMode(e.target.value as VisitMode)} />
            <Select label="Specialty (Optional)" options={SPECIALTIES} value={specialty}
              onChange={e => setSpecialty(e.target.value)} />
          </div>

          {/* Chief Complaint */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700">Chief Complaint</label>
              <div className="flex items-center gap-2">
                {ccVoice.listening && (
                  <span className="text-xs text-red-500 flex items-center gap-1">
                    <Mic size={10} className="animate-pulse" /> Recording...
                  </span>
                )}
                <MicButton
                  listening={ccVoice.listening}
                  supported={ccVoice.supported}
                  onStart={ccVoice.start}
                  onStop={ccVoice.stop}
                  size="sm"
                />
              </div>
            </div>
            <div className="relative">
              <textarea
                value={chiefComplaint}
                onChange={e => setChiefComplaint(e.target.value)}
                placeholder={ccVoice.listening ? '' : 'Brief description of the presenting concern, or tap the mic to dictate...'}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
              {ccVoice.listening && chiefComplaintInterim && (
                <div className="absolute inset-0 px-3 py-2 text-sm text-slate-400 italic pointer-events-none rounded-lg overflow-hidden">
                  <span className="text-slate-700 not-italic">{chiefComplaint}</span>
                  {chiefComplaint ? ' ' : ''}{chiefComplaintInterim}
                  <span className="inline-block w-0.5 h-3.5 bg-teal-500 animate-pulse ml-0.5 align-middle" />
                </div>
              )}
            </div>
          </div>

          {/* Prior note context */}
          <div>
            <button type="button" onClick={() => setShowPriorNote(v => !v)}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1.5 underline-offset-2 hover:underline">
              <RefreshCw size={14} />
              {showPriorNote ? 'Hide' : 'Add'} prior note context for follow-up continuity
            </button>
            {showPriorNote && (
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">Prior Note or Clinical Context</label>
                  <div className="flex items-center gap-2">
                    {priorVoice.listening && (
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <Mic size={10} className="animate-pulse" /> Recording...
                      </span>
                    )}
                    <MicButton
                      listening={priorVoice.listening}
                      supported={priorVoice.supported}
                      onStart={priorVoice.start}
                      onStop={priorVoice.stop}
                      size="sm"
                    />
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    value={priorNoteContext}
                    onChange={e => setPriorNoteContext(e.target.value)}
                    placeholder={priorVoice.listening ? '' : 'Paste the previous note, relevant history, or tap mic to dictate...'}
                    rows={5}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
                  />
                  {priorVoice.listening && priorNoteInterim && (
                    <div className="absolute inset-0 px-3 py-2 text-sm text-slate-400 italic pointer-events-none rounded-lg overflow-hidden">
                      <span className="text-slate-700 not-italic">{priorNoteContext}</span>
                      {priorNoteContext ? ' ' : ''}{priorNoteInterim}
                      <span className="inline-block w-0.5 h-3.5 bg-teal-500 animate-pulse ml-0.5 align-middle" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-400">This context will be available to AI when generating notes in the workspace.</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="accent" size="lg" isLoading={createEncounter.isPending}>
              Start Encounter
            </Button>
            <Link href="/app/encounters">
              <Button type="button" variant="outline" size="lg">Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
