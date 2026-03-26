'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { ScoreBadge } from './ScoreBadge';
import { usePatients } from '@/hooks/usePatients';
import { useCreateScreening } from '@/hooks/useScreenings';
import { type Patient, type ScreeningType, type ScreeningSeverity } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle } from 'lucide-react';

// ─── Screening definitions ─────────────────────────────────────────────────────

interface ScreeningQuestion {
  id: string;
  text: string;
  options: { label: string; value: number }[];
}

const LIKERT_0_TO_3 = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
];

const PHQ9_QUESTIONS: ScreeningQuestion[] = [
  { id: 'phq1', text: 'Little interest or pleasure in doing things', options: LIKERT_0_TO_3 },
  { id: 'phq2', text: 'Feeling down, depressed, or hopeless', options: LIKERT_0_TO_3 },
  { id: 'phq3', text: 'Trouble falling or staying asleep, or sleeping too much', options: LIKERT_0_TO_3 },
  { id: 'phq4', text: 'Feeling tired or having little energy', options: LIKERT_0_TO_3 },
  { id: 'phq5', text: 'Poor appetite or overeating', options: LIKERT_0_TO_3 },
  { id: 'phq6', text: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down', options: LIKERT_0_TO_3 },
  { id: 'phq7', text: 'Trouble concentrating on things, such as reading the newspaper or watching television', options: LIKERT_0_TO_3 },
  { id: 'phq8', text: 'Moving or speaking so slowly that other people could have noticed, or being so fidgety or restless', options: LIKERT_0_TO_3 },
  { id: 'phq9', text: 'Thoughts that you would be better off dead or of hurting yourself in some way', options: LIKERT_0_TO_3 },
];

const GAD7_QUESTIONS: ScreeningQuestion[] = [
  { id: 'gad1', text: 'Feeling nervous, anxious, or on edge', options: LIKERT_0_TO_3 },
  { id: 'gad2', text: 'Not being able to stop or control worrying', options: LIKERT_0_TO_3 },
  { id: 'gad3', text: 'Worrying too much about different things', options: LIKERT_0_TO_3 },
  { id: 'gad4', text: 'Trouble relaxing', options: LIKERT_0_TO_3 },
  { id: 'gad5', text: 'Being so restless that it is hard to sit still', options: LIKERT_0_TO_3 },
  { id: 'gad6', text: 'Becoming easily annoyed or irritable', options: LIKERT_0_TO_3 },
  { id: 'gad7', text: 'Feeling afraid as if something awful might happen', options: LIKERT_0_TO_3 },
];

const AUDIT_QUESTIONS: ScreeningQuestion[] = [
  {
    id: 'audit1',
    text: 'How often do you have a drink containing alcohol?',
    options: [
      { label: 'Never', value: 0 },
      { label: 'Monthly or less', value: 1 },
      { label: '2–4 times a month', value: 2 },
      { label: '2–3 times a week', value: 3 },
      { label: '4 or more times a week', value: 4 },
    ],
  },
  {
    id: 'audit2',
    text: 'How many drinks containing alcohol do you have on a typical day when you are drinking?',
    options: [
      { label: '1 or 2', value: 0 },
      { label: '3 or 4', value: 1 },
      { label: '5 or 6', value: 2 },
      { label: '7 to 9', value: 3 },
      { label: '10 or more', value: 4 },
    ],
  },
  {
    id: 'audit3',
    text: 'How often do you have six or more drinks on one occasion?',
    options: [
      { label: 'Never', value: 0 },
      { label: 'Less than monthly', value: 1 },
      { label: 'Monthly', value: 2 },
      { label: 'Weekly', value: 3 },
      { label: 'Daily or almost daily', value: 4 },
    ],
  },
];

const CSSRS_QUESTIONS: ScreeningQuestion[] = [
  {
    id: 'cssrs1',
    text: 'Have you wished to be dead or wished you could go to sleep and not wake up?',
    options: [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }],
  },
  {
    id: 'cssrs2',
    text: 'Have you actually had any thoughts of killing yourself?',
    options: [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }],
  },
  {
    id: 'cssrs3',
    text: 'Have you been thinking about how you might do this?',
    options: [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }],
  },
  {
    id: 'cssrs4',
    text: 'Have you had any intention of acting on these thoughts of killing yourself?',
    options: [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }],
  },
  {
    id: 'cssrs5',
    text: 'Have you started to work out or worked out the details of how to kill yourself?',
    options: [{ label: 'No', value: 0 }, { label: 'Yes', value: 1 }],
  },
];

const SCREENING_QUESTIONS: Record<ScreeningType, ScreeningQuestion[]> = {
  PHQ9: PHQ9_QUESTIONS,
  GAD7: GAD7_QUESTIONS,
  AUDIT: AUDIT_QUESTIONS,
  CSSRS: CSSRS_QUESTIONS,
};

const SCREENING_TYPE_OPTIONS = [
  { label: 'PHQ-9 — Depression', value: 'PHQ9' },
  { label: 'GAD-7 — Anxiety', value: 'GAD7' },
  { label: 'AUDIT — Alcohol Use', value: 'AUDIT' },
  { label: 'C-SSRS — Suicidality', value: 'CSSRS' },
];

const SCREENING_INSTRUCTIONS: Record<ScreeningType, string> = {
  PHQ9: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
  GAD7: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
  AUDIT: 'Please answer the following questions about your alcohol use.',
  CSSRS: 'Please answer yes or no to the following questions.',
};

const SEVERITY_INTERPRETATION: Record<ScreeningType, Record<string, string>> = {
  PHQ9: {
    minimal: 'Score 0–4: Minimal depression. Monitor; may not require treatment.',
    mild: 'Score 5–9: Mild depression. Watchful waiting; repeat PHQ-9 at follow-up.',
    moderate: 'Score 10–14: Moderate depression. Treatment plan, counseling, follow-up.',
    moderately_severe: 'Score 15–19: Moderately severe depression. Active treatment with pharmacotherapy and/or psychotherapy.',
    severe: 'Score 20–27: Severe depression. Immediate initiation of pharmacotherapy; if severe impairment or suicidal ideation, expedite referral to a mental health specialist.',
  },
  GAD7: {
    minimal: 'Score 0–4: Minimal anxiety. Normal; no treatment indicated.',
    mild: 'Score 5–9: Mild anxiety. Monitor and reassess.',
    moderate: 'Score 10–14: Moderate anxiety. Consider counseling, stress management, or pharmacotherapy.',
    severe: 'Score 15–21: Severe anxiety. Active treatment recommended.',
    moderately_severe: 'Score 15–21: Severe anxiety. Active treatment recommended.',
  },
  AUDIT: {
    minimal: 'Score 0–7: Low risk. Provide feedback on safe drinking limits.',
    mild: 'Score 8–15: Hazardous drinking. Simple advice on reducing intake.',
    moderate: 'Score 16–19: Harmful drinking. Brief counseling and monitoring.',
    severe: 'Score 20–40: Possible alcohol dependence. Referral to specialist for evaluation.',
    moderately_severe: 'Score 16–19: Harmful drinking. Brief counseling and monitoring.',
  },
  CSSRS: {
    none: 'No ideation reported. Continue routine monitoring.',
    minimal: 'No ideation reported. Continue routine monitoring.',
    mild: 'Passive ideation present. Assess further; safety planning may be indicated.',
    moderate: 'Active ideation with method. Urgent psychiatric evaluation recommended.',
    moderately_severe: 'Active ideation with intent. Urgent psychiatric evaluation recommended.',
    severe: 'Active ideation with plan and intent. Immediate intervention required.',
  },
};

// ─── Scoring ───────────────────────────────────────────────────────────────────

function computeSeverity(type: ScreeningType, score: number): ScreeningSeverity {
  if (type === 'PHQ9') {
    if (score <= 4) return 'minimal';
    if (score <= 9) return 'mild';
    if (score <= 14) return 'moderate';
    if (score <= 19) return 'moderately_severe';
    return 'severe';
  }
  if (type === 'GAD7') {
    if (score <= 4) return 'minimal';
    if (score <= 9) return 'mild';
    if (score <= 14) return 'moderate';
    return 'severe';
  }
  if (type === 'AUDIT') {
    if (score <= 7) return 'minimal';
    if (score <= 15) return 'mild';
    if (score <= 19) return 'moderate';
    return 'severe';
  }
  // CSSRS — any yes is elevated
  if (score === 0) return 'minimal';
  if (score === 1) return 'mild';
  if (score === 2) return 'moderate';
  return 'severe';
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface ScreeningFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillPatientId?: string;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function ScreeningFormModal({ isOpen, onClose, prefillPatientId }: ScreeningFormModalProps) {
  const { data: patientsData } = usePatients({ limit: 200 });
  const patients = (patientsData?.data ?? []) as Patient[];
  const createScreening = useCreateScreening();

  const [patientId, setPatientId] = useState(prefillPatientId ?? '');
  const [screeningType, setScreeningType] = useState<ScreeningType>('PHQ9');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    severity: ScreeningSeverity;
    patientName: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAnswers({});
      setSubmitted(false);
      setResult(null);
      setError(null);
      setScreeningType('PHQ9');
      if (!prefillPatientId) setPatientId('');
    }
  }, [isOpen, prefillPatientId]);

  // Reset answers when type changes
  useEffect(() => {
    setAnswers({});
    setError(null);
  }, [screeningType]);

  const questions = SCREENING_QUESTIONS[screeningType] ?? [];
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;
  const patientOptions = patients.map((p) => ({
    label: `${p.firstName} ${p.lastName}${p.mrn ? ` (${p.mrn})` : ''}`,
    value: p.id,
  }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!patientId) { setError('Please select a patient.'); return; }
    if (!allAnswered) { setError('Please answer all questions before submitting.'); return; }
    setError(null);

    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const severity = computeSeverity(screeningType, totalScore);
    const responses = questions.map((q) => {
      const answerValue = answers[q.id];
      const selectedOption = q.options.find((o) => o.value === answerValue);
      return {
        questionId: q.id,
        question: q.text,
        answer: answerValue,
        label: selectedOption?.label ?? String(answerValue),
      };
    });

    const selectedPatient = patients.find((p) => p.id === patientId);
    const patientName = selectedPatient
      ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
      : 'Patient';

    try {
      const res = await createScreening.mutateAsync({ patientId, type: screeningType, responses });
      // Use server-computed score and severity from response if available
      const savedData = res?.data as { score?: number; severity?: ScreeningSeverity; totalScore?: number } | undefined;
      const finalScore = savedData?.score ?? savedData?.totalScore ?? totalScore;
      const finalSeverity = (savedData?.severity ?? severity) as ScreeningSeverity;
      setResult({ score: finalScore, severity: finalSeverity, patientName });
      setSubmitted(true);
    } catch {
      setError('Failed to submit screening. Please try again.');
    }
  }

  const isCSSRS = screeningType === 'CSSRS';
  const currentScore = Object.values(answers).reduce((a, b) => a + b, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={submitted ? 'Screening Complete' : 'Administer Screening'}
      size="xl"
      className="max-h-[92vh] flex flex-col"
    >
      {/* Success state */}
      {submitted && result ? (
        <div className="flex flex-col items-center text-center gap-5 py-2">
          <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
            <CheckCircle size={32} className="text-teal-600" />
          </div>
          <div>
            <p className="text-slate-500 text-sm">
              {screeningType} screening recorded for{' '}
              <span className="font-semibold text-navy-900">{result.patientName}</span>
            </p>
          </div>

          {/* Score card */}
          <div className="w-full bg-slate-50 rounded-xl border border-slate-100 p-5 text-left space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Total Score</p>
                <p className="text-4xl font-bold text-navy-900">{result.score}</p>
              </div>
              <ScoreBadge severity={result.severity} showScore={false} />
            </div>
            <div className="border-t border-slate-200 pt-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                {SEVERITY_INTERPRETATION[screeningType][result.severity]}
              </p>
            </div>
          </div>

          {/* Alert for severe CSSRS */}
          {screeningType === 'CSSRS' && result.severity !== 'minimal' && (
            <div className="w-full flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-left">
              <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-medium">
                Elevated suicidality risk detected. Immediate clinical follow-up is recommended per your protocol.
              </p>
            </div>
          )}

          <div className="flex gap-3 w-full pt-1">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setSubmitted(false);
                setAnswers({});
                setResult(null);
                if (!prefillPatientId) setPatientId('');
              }}
            >
              New Screening
            </Button>
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        /* Form state */
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 min-h-0">
          {error && (
            <Alert variant="error" onDismiss={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Patient + Type selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Patient"
              options={patientOptions}
              placeholder="Select patient..."
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            />
            <Select
              label="Screening Type"
              options={SCREENING_TYPE_OPTIONS}
              value={screeningType}
              onChange={(e) => setScreeningType(e.target.value as ScreeningType)}
            />
          </div>

          {/* CSSRS warning */}
          {isCSSRS && (
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                The C-SSRS screens for suicidal ideation and behavior. Ensure a clinician is present
                or immediately available when administering this screening.
              </p>
            </div>
          )}

          {/* Progress bar */}
          {questions.length > 0 && answeredCount > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>{answeredCount} of {questions.length} answered</span>
                {!isCSSRS && <span>Running score: <strong className="text-navy-900">{currentScore}</strong></span>}
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-300"
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Instructions */}
          {questions.length > 0 && (
            <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
              {SCREENING_INSTRUCTIONS[screeningType]}
            </p>
          )}

          {/* Scrollable questions */}
          <div className="overflow-y-auto flex-1 space-y-4 pr-1" style={{ maxHeight: '38vh' }}>
            {questions.map((q, idx) => (
              <div key={q.id} className="space-y-2">
                <p className="text-sm font-medium text-navy-900">
                  <span className="text-slate-400 mr-1.5">{idx + 1}.</span>
                  {q.text}
                </p>
                <div className={cn(
                  'grid gap-2',
                  q.options.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4',
                )}>
                  {q.options.map((opt) => (
                    <label
                      key={opt.value}
                      className={cn(
                        'flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-sm',
                        answers[q.id] === opt.value
                          ? 'border-teal-500 bg-teal-50 text-teal-700 font-medium'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600',
                      )}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt.value}
                        checked={answers[q.id] === opt.value}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: opt.value }))}
                        className="sr-only"
                      />
                      {!isCSSRS && (
                        <span className="font-semibold text-xs text-slate-400">{opt.value}</span>
                      )}
                      <span className="text-xs leading-tight">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer actions */}
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={createScreening.isPending}
              disabled={!allAnswered || !patientId}
              className="flex-1"
            >
              Submit Screening
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
