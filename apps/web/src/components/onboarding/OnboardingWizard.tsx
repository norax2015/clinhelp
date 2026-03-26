'use client';

import React, { useState } from 'react';
import {
  Stethoscope,
  Activity,
  Heart,
  ClipboardList,
  Users,
  Shield,
  Home,
  Zap,
  AlertTriangle,
  Scissors,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  Layers,
  FileText,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { adminApi } from '@/lib/api';
import { useAuthContext } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OnboardingWizardProps {
  onDone: () => void;
}

type NoteStyle = 'concise' | 'balanced' | 'detailed';
type PracticeSize = 'solo' | '2-5' | '6-20' | '20+';

interface WizardSelections {
  specialty: string;
  firstName: string;
  lastName: string;
  title: string;
  npi: string;
  practiceSize: PracticeSize | '';
  ehrSystem: string;
  noteStyle: NoteStyle | '';
}

// ─── Static data ──────────────────────────────────────────────────────────────

const SPECIALTIES = [
  { id: 'primary_care',      label: 'Primary Care',               Icon: Stethoscope   },
  { id: 'psychiatry',        label: 'Psychiatry',                 Icon: Activity      },
  { id: 'therapy',           label: 'Therapy / Behavioral Health', Icon: Heart        },
  { id: 'internal_medicine', label: 'Internal Medicine',          Icon: ClipboardList },
  { id: 'pediatrics',        label: 'Pediatrics',                 Icon: Users         },
  { id: 'ob_gyn',            label: 'OB/GYN',                     Icon: Shield        },
  { id: 'family_medicine',   label: 'Family Medicine',            Icon: Home          },
  { id: 'cardiology',        label: 'Cardiology',                 Icon: Activity      },
  { id: 'neurology',         label: 'Neurology',                  Icon: Zap           },
  { id: 'urgent_care',       label: 'Urgent Care',                Icon: AlertTriangle },
  { id: 'surgery',           label: 'Surgery',                    Icon: Scissors      },
  { id: 'other',             label: 'Other Specialty',            Icon: Plus          },
] as const;

const PRACTICE_SIZES: { id: PracticeSize; label: string }[] = [
  { id: 'solo', label: 'Solo provider' },
  { id: '2-5',  label: '2–5 providers' },
  { id: '6-20', label: '6–20 providers' },
  { id: '20+',  label: '20+ providers' },
];

const EHR_OPTIONS = [
  { value: 'epic',            label: 'Epic'            },
  { value: 'cerner',          label: 'Cerner'          },
  { value: 'athenahealth',    label: 'AthenaHealth'    },
  { value: 'eclinicalworks',  label: 'eClinicalWorks'  },
  { value: 'practice_fusion', label: 'Practice Fusion' },
  { value: 'drchrono',        label: 'DrChrono'        },
  { value: 'other',           label: 'Other'           },
];

const NOTE_STYLES: {
  id: NoteStyle;
  label: string;
  tagline: string;
  preview: string;
}[] = [
  {
    id: 'concise',
    label: 'Concise',
    tagline: 'Short, punchy notes. Just the essentials.',
    preview: 'CC: HTN follow-up\nA/P: BP 138/84 — uptitrate lisinopril to 20 mg. RTC 3 mo.',
  },
  {
    id: 'balanced',
    label: 'Balanced',
    tagline: 'Standard clinical notes. Complete but not verbose.',
    preview:
      'CC: Hypertension follow-up.\nHPI: Patient presents for routine BP check. Currently on lisinopril 10 mg daily.\nA/P: BP mildly elevated at 138/84. Uptitrate lisinopril to 20 mg daily. Labs in 2 weeks. RTC in 3 months.',
  },
  {
    id: 'detailed',
    label: 'Detailed',
    tagline: 'Comprehensive notes with full narrative.',
    preview:
      'CC: Hypertension follow-up.\nHPI: 54-year-old male presenting for scheduled HTN follow-up. Reports good adherence with lisinopril 10 mg daily. Denies headache, chest pain, or visual changes.\nVitals: BP 138/84, HR 72, RR 16, SpO2 99%.\nA/P: BP above goal of <130/80. Uptitrate lisinopril to 20 mg daily. BMP in 2 weeks to monitor renal function and potassium. Counseled on DASH diet. RTC 3 months.',
  },
];

// ─── Progress dots ────────────────────────────────────────────────────────────

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'rounded-full transition-all duration-300',
            i === current
              ? 'w-6 h-2 bg-teal-500'
              : i < current
              ? 'w-2 h-2 bg-teal-300'
              : 'w-2 h-2 bg-slate-200',
          )}
        />
      ))}
    </div>
  );
}

// ─── Step 0 — Welcome + Specialty ────────────────────────────────────────────

function StepSpecialty({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Welcome to ClinHelp</h2>
        <p className="text-slate-500 text-sm">
          Let&apos;s personalise your experience. What&apos;s your specialty?
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {SPECIALTIES.map(({ id, label, Icon }) => {
          const isSelected = selected === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-150',
                'hover:border-teal-400 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1',
                isSelected
                  ? 'border-teal-500 bg-teal-50 shadow-sm'
                  : 'border-slate-200 bg-white',
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
                  isSelected ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500',
                )}
              >
                <Icon size={20} />
              </div>
              <span
                className={cn(
                  'text-xs font-medium leading-tight',
                  isSelected ? 'text-teal-700' : 'text-slate-600',
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 1 — Credentials ────────────────────────────────────────────────────

function StepCredentials({
  fields,
  onChange,
}: {
  fields: Pick<WizardSelections, 'firstName' | 'lastName' | 'title' | 'npi'>;
  onChange: (key: keyof WizardSelections, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Your credentials</h2>
        <p className="text-slate-500 text-sm">
          Tell us about yourself so your notes look professional.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First name"
            value={fields.firstName}
            onChange={(e) => onChange('firstName', e.target.value)}
            placeholder="Jane"
            autoFocus
          />
          <Input
            label="Last name"
            value={fields.lastName}
            onChange={(e) => onChange('lastName', e.target.value)}
            placeholder="Smith"
          />
        </div>

        <Input
          label="Title / Credentials"
          value={fields.title}
          onChange={(e) => onChange('title', e.target.value)}
          placeholder="MD, NP, LCSW, PA-C..."
          hint="This will appear on your signed notes."
        />

        <Input
          label="NPI Number"
          value={fields.npi}
          onChange={(e) => onChange('npi', e.target.value)}
          placeholder="10-digit NPI"
          maxLength={10}
          hint="Optional — used for billing and coding suggestions."
        />
      </div>
    </div>
  );
}

// ─── Step 2 — Practice Setup ─────────────────────────────────────────────────

function StepPractice({
  practiceSize,
  ehrSystem,
  onChange,
}: {
  practiceSize: PracticeSize | '';
  ehrSystem: string;
  onChange: (key: keyof WizardSelections, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Practice setup</h2>
        <p className="text-slate-500 text-sm">
          Help us calibrate ClinHelp for your environment.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <p className="label-base mb-2.5">Practice size</p>
          <div className="grid grid-cols-2 gap-3">
            {PRACTICE_SIZES.map(({ id, label }) => {
              const isSelected = practiceSize === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onChange('practiceSize', id)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-150',
                    'hover:border-teal-400 hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1',
                    isSelected
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-slate-200 bg-white text-slate-600',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                      isSelected ? 'border-teal-500 bg-teal-500' : 'border-slate-300',
                    )}
                  >
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <Select
          label="EHR system"
          value={ehrSystem}
          onChange={(e) => onChange('ehrSystem', e.target.value)}
          placeholder="Select your EHR..."
          options={EHR_OPTIONS}
          hint="Used to tailor copy-paste formatting and note templates."
        />
      </div>
    </div>
  );
}

// ─── Step 3 — Note Style ─────────────────────────────────────────────────────

function StepNoteStyle({
  selected,
  onSelect,
}: {
  selected: NoteStyle | '';
  onSelect: (style: NoteStyle) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">Note style</h2>
        <p className="text-slate-500 text-sm">
          How do you like your clinical notes? You can change this any time in settings.
        </p>
      </div>

      <div className="space-y-3">
        {NOTE_STYLES.map(({ id, label, tagline, preview }) => {
          const isSelected = selected === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className={cn(
                'w-full rounded-xl border-2 p-4 text-left transition-all duration-150',
                'hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1',
                isSelected
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-slate-200 bg-white hover:bg-teal-50/40',
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p
                    className={cn(
                      'font-semibold text-sm',
                      isSelected ? 'text-teal-700' : 'text-slate-800',
                    )}
                  >
                    {label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{tagline}</p>
                </div>
                <span
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors mt-0.5',
                    isSelected ? 'border-teal-500 bg-teal-500' : 'border-slate-300',
                  )}
                >
                  {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                </span>
              </div>

              <div
                className={cn(
                  'mt-3 rounded-lg p-3 font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-words transition-colors',
                  isSelected
                    ? 'bg-white border border-teal-200 text-slate-600'
                    : 'bg-slate-50 border border-slate-200 text-slate-500',
                )}
              >
                {preview}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 4 — Done ───────────────────────────────────────────────────────────

function StepDone({
  firstName,
  onGoToDashboard,
  isLoading,
}: {
  firstName: string;
  onGoToDashboard: () => void;
  isLoading: boolean;
}) {
  const name = firstName.trim() || 'there';

  return (
    <div className="flex flex-col items-center text-center space-y-6 py-2">
      {/* Animated checkmark */}
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 ring-8 ring-teal-50 animate-bounce">
        <Check size={40} className="text-teal-600" strokeWidth={2.5} />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">
          You&apos;re all set, {name}!
        </h2>
        <p className="text-slate-500 text-sm max-w-xs mx-auto">
          ClinHelp is ready to help you create faster, smarter clinical notes.
          Here&apos;s where to start:
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full">
        {[
          {
            Icon: Stethoscope,
            label: 'Start an encounter',
            desc: 'Open a new patient visit',
          },
          {
            Icon: Users,
            label: 'View patients',
            desc: 'Browse your patient list',
          },
          {
            Icon: FileText,
            label: 'Explore notes',
            desc: 'Review past clinical notes',
          },
        ].map(({ Icon, label, desc }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
              <Icon size={18} />
            </div>
            <p className="text-xs font-semibold text-slate-700">{label}</p>
            <p className="text-[11px] text-slate-400 leading-tight">{desc}</p>
          </div>
        ))}
      </div>

      <Button
        size="lg"
        variant="accent"
        onClick={onGoToDashboard}
        isLoading={isLoading}
        leftIcon={<LayoutDashboard size={18} />}
        className="w-full"
      >
        Go to Dashboard
      </Button>
    </div>
  );
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

const TOTAL_STEPS = 5; // steps 0–4

export function OnboardingWizard({ onDone }: OnboardingWizardProps) {
  const { user, refreshUser } = useAuthContext();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selections, setSelections] = useState<WizardSelections>({
    specialty:    user?.specialty    ?? '',
    firstName:    user?.firstName    ?? '',
    lastName:     user?.lastName     ?? '',
    title:        user?.title        ?? '',
    npi:          user?.npi          ?? '',
    practiceSize: '',
    ehrSystem:    '',
    noteStyle:    '',
  });

  const setField = (key: keyof WizardSelections, value: string) =>
    setSelections((prev) => ({ ...prev, [key]: value }));

  /** Per-step gate before the user can advance */
  const canAdvance = (): boolean => {
    switch (currentStep) {
      case 0: return !!selections.specialty;
      case 1: return !!selections.firstName.trim() && !!selections.lastName.trim();
      case 2: return true; // practice setup is optional
      case 3: return !!selections.noteStyle;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  /** Called from the Done screen's "Go to Dashboard" button */
  const handleComplete = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (user?.id) {
        await adminApi.updateUser(user.id, {
          firstName: selections.firstName.trim(),
          lastName:  selections.lastName.trim(),
          title:     selections.title.trim(),
          npi:       selections.npi.trim(),
          specialty: selections.specialty,
        });
        await refreshUser();
      }

      if (selections.noteStyle) {
        localStorage.setItem('clinhelp_note_style', selections.noteStyle);
      }

      onDone();
    } catch {
      setError('Something went wrong saving your profile. Please try again.');
      setIsSubmitting(false);
    }
  };

  const isDoneStep = currentStep === 4;

  return (
    // Full-screen semi-transparent overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Wizard card */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Decorative top gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-teal-400 via-teal-500 to-slate-800" />

        <div className="px-8 pt-7 pb-8">
          {/* Progress dots — hidden on the celebration screen */}
          {!isDoneStep && (
            <div className="mb-6">
              <ProgressDots total={TOTAL_STEPS - 1} current={currentStep} />
            </div>
          )}

          {/* Step content — fixed min-height keeps card from jumping */}
          <div className="min-h-[380px]">
            {currentStep === 0 && (
              <StepSpecialty
                selected={selections.specialty}
                onSelect={(id) => setField('specialty', id)}
              />
            )}
            {currentStep === 1 && (
              <StepCredentials
                fields={{
                  firstName: selections.firstName,
                  lastName:  selections.lastName,
                  title:     selections.title,
                  npi:       selections.npi,
                }}
                onChange={setField}
              />
            )}
            {currentStep === 2 && (
              <StepPractice
                practiceSize={selections.practiceSize}
                ehrSystem={selections.ehrSystem}
                onChange={setField}
              />
            )}
            {currentStep === 3 && (
              <StepNoteStyle
                selected={selections.noteStyle}
                onSelect={(style) => setField('noteStyle', style)}
              />
            )}
            {currentStep === 4 && (
              <StepDone
                firstName={selections.firstName}
                onGoToDashboard={handleComplete}
                isLoading={isSubmitting}
              />
            )}
          </div>

          {/* API error */}
          {error && (
            <p className="mt-3 text-sm text-center text-red-600">{error}</p>
          )}

          {/* Navigation footer — hidden on done step (it has its own primary CTA) */}
          {!isDoneStep && (
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
              <Button
                variant="ghost"
                size="md"
                onClick={handleBack}
                disabled={currentStep === 0}
                leftIcon={<ChevronLeft size={16} />}
              >
                Back
              </Button>

              <Button
                variant={currentStep === 3 ? 'accent' : 'primary'}
                size="md"
                onClick={handleNext}
                disabled={!canAdvance()}
                rightIcon={
                  currentStep === 3 ? (
                    <Layers size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )
                }
              >
                {currentStep === 3 ? 'Finish setup' : 'Continue'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
