'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePatients } from '@/hooks/usePatients';
import { useCreateScreening } from '@/hooks/useScreenings';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Alert } from '@/components/ui/Alert';
import { ScoreBadge } from './ScoreBadge';
import { type Patient, type ScreeningType, type ScreeningSeverity } from '@/types';
import { cn } from '@/lib/utils';

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

// ─── Component ─────────────────────────────────────────────────────────────────

const SCREENING_TYPE_OPTIONS = [
  { label: 'PHQ-9 (Depression)', value: 'PHQ9' },
  { label: 'GAD-7 (Anxiety)', value: 'GAD7' },
  { label: 'AUDIT (Alcohol Use)', value: 'AUDIT' },
  { label: 'C-SSRS (Suicidality)', value: 'CSSRS' },
];

export function ScreeningForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillPatientId = searchParams.get('patientId') ?? '';

  const { data: patientsData } = usePatients({ limit: 200 });
  const patients = (patientsData?.data ?? []) as Patient[];
  const createScreening = useCreateScreening();

  const [patientId, setPatientId] = useState(prefillPatientId);
  const [screeningType, setScreeningType] = useState<ScreeningType>('PHQ9');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; severity: ScreeningSeverity } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  }, [screeningType]);

  const questions = SCREENING_QUESTIONS[screeningType] ?? [];
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const patientOptions = patients.map((p) => ({
    label: `${p.firstName} ${p.lastName} (${p.mrn})`,
    value: p.id,
  }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!patientId) {
      setError('Please select a patient.');
      return;
    }
    if (!allAnswered) {
      setError('Please answer all questions before submitting.');
      return;
    }
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

    try {
      await createScreening.mutateAsync({
        patientId,
        type: screeningType,
        responses,
        totalScore,
        severity,
      });
      setResult({ score: totalScore, severity });
      setSubmitted(true);
    } catch {
      setError('Failed to submit screening. Please try again.');
    }
  }

  if (submitted && result) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-navy-900 mb-2">Screening Complete</h2>
          <p className="text-slate-500 mb-4">
            {screeningType} screening has been recorded for the selected patient.
          </p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-4xl font-bold text-navy-900">{result.score}</span>
            <ScoreBadge severity={result.severity} />
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button
              variant="accent"
              onClick={() => {
                setSubmitted(false);
                setAnswers({});
                setResult(null);
              }}
            >
              New Screening
            </Button>
            <Button variant="outline" onClick={() => router.push('/app/screenings')}>
              View All Screenings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {error && (
        <Alert variant="error" onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Questions */}
          {questions.length > 0 && (
            <div className="space-y-5">
              <p className="text-sm text-slate-500 border-t border-slate-100 pt-4">
                Over the last 2 weeks, how often have you been bothered by the following?
              </p>
              {questions.map((q, idx) => (
                <div key={q.id} className="space-y-2">
                  <p className="text-sm font-medium text-navy-900">
                    {idx + 1}. {q.text}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
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
                        <span className="font-semibold text-xs">{opt.value}</span>
                        <span className="text-xs leading-tight">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              {/* Running score */}
              {Object.keys(answers).length > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <span className="text-sm text-slate-500">
                    Current score: <strong className="text-navy-900">{Object.values(answers).reduce((a, b) => a + b, 0)}</strong>
                  </span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  isLoading={createScreening.isPending}
                  disabled={!allAnswered || !patientId}
                >
                  Submit Screening
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/app/screenings')}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
