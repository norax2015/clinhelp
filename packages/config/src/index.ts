// ClinHelp Configuration Constants
// Owner: Norax Solutions, LLC

export const APP_CONFIG = {
  name: 'ClinHelp',
  owner: 'Norax Solutions, LLC',
  version: '0.1.0',
  description: 'AI-powered clinical documentation and workflow platform',
  supportEmail: 'support@clinhelp.ai',
  demoEmail: 'demo@clinhelp.ai',
  website: 'https://clinhelp.ai',
} as const;

export const SUBSCRIPTION_LIMITS = {
  starter: {
    maxUsers: 5,
    maxPatients: 200,
    aiNotesPerMonth: 100,
    audioMinutesPerMonth: 300,
  },
  growth: {
    maxUsers: 25,
    maxPatients: 2000,
    aiNotesPerMonth: 1000,
    audioMinutesPerMonth: 3000,
  },
  enterprise: {
    maxUsers: -1, // unlimited
    maxPatients: -1,
    aiNotesPerMonth: -1,
    audioMinutesPerMonth: -1,
  },
} as const;

export const SCREENING_CONFIGS = {
  PHQ9: {
    name: 'PHQ-9',
    fullName: 'Patient Health Questionnaire-9',
    maxScore: 27,
    questions: [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
      'Trouble concentrating on things, such as reading the newspaper or watching television',
      'Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
      'Thoughts that you would be better off dead, or of hurting yourself in some way',
    ],
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
    severityRanges: [
      { min: 0, max: 4, severity: 'minimal' as const, label: 'Minimal depression' },
      { min: 5, max: 9, severity: 'mild' as const, label: 'Mild depression' },
      { min: 10, max: 14, severity: 'moderate' as const, label: 'Moderate depression' },
      { min: 15, max: 19, severity: 'moderately_severe' as const, label: 'Moderately severe depression' },
      { min: 20, max: 27, severity: 'severe' as const, label: 'Severe depression' },
    ],
  },
  GAD7: {
    name: 'GAD-7',
    fullName: 'Generalized Anxiety Disorder 7-item',
    maxScore: 21,
    questions: [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it is hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid, as if something awful might happen',
    ],
    options: [
      { value: 0, label: 'Not at all' },
      { value: 1, label: 'Several days' },
      { value: 2, label: 'More than half the days' },
      { value: 3, label: 'Nearly every day' },
    ],
    severityRanges: [
      { min: 0, max: 4, severity: 'minimal' as const, label: 'Minimal anxiety' },
      { min: 5, max: 9, severity: 'mild' as const, label: 'Mild anxiety' },
      { min: 10, max: 14, severity: 'moderate' as const, label: 'Moderate anxiety' },
      { min: 15, max: 21, severity: 'severe' as const, label: 'Severe anxiety' },
    ],
  },
  AUDIT: {
    name: 'AUDIT',
    fullName: 'Alcohol Use Disorders Identification Test',
    maxScore: 40,
    questions: [
      'How often do you have a drink containing alcohol?',
      'How many standard drinks containing alcohol do you have on a typical day when you are drinking?',
      'How often do you have six or more drinks on one occasion?',
      'How often during the last year have you found that you were not able to stop drinking once you had started?',
      'How often during the last year have you failed to do what was normally expected of you because of drinking?',
      'How often during the last year have you needed a drink in the morning to get yourself going after a heavy drinking session?',
      'How often during the last year have you had a feeling of guilt or remorse after drinking?',
      'How often during the last year have you been unable to remember what happened the night before because of your drinking?',
      'Have you or someone else been injured as a result of your drinking?',
      'Has a relative, friend, doctor, or other health care worker been concerned about your drinking or suggested you cut down?',
    ],
    severityRanges: [
      { min: 0, max: 7, severity: 'minimal' as const, label: 'Low risk' },
      { min: 8, max: 15, severity: 'mild' as const, label: 'Moderate risk' },
      { min: 16, max: 19, severity: 'moderate' as const, label: 'High risk' },
      { min: 20, max: 40, severity: 'severe' as const, label: 'Possible dependence' },
    ],
  },
  CSSRS: {
    name: 'C-SSRS',
    fullName: 'Columbia Suicide Severity Rating Scale',
    maxScore: 5,
    questions: [
      'Have you wished you were dead or wished you could go to sleep and not wake up?',
      'Have you actually had any thoughts of killing yourself?',
      'Have you been thinking about how you might do this?',
      'Have you had these thoughts and had some intention of acting on them?',
      'Have you started to work out or worked out the details of how to kill yourself?',
    ],
    options: [
      { value: 0, label: 'No' },
      { value: 1, label: 'Yes' },
    ],
    severityRanges: [
      { min: 0, max: 0, severity: 'none' as const, label: 'No ideation' },
      { min: 1, max: 2, severity: 'mild' as const, label: 'Passive ideation' },
      { min: 3, max: 4, severity: 'moderate' as const, label: 'Active ideation without plan' },
      { min: 5, max: 5, severity: 'severe' as const, label: 'Active ideation with plan/intent' },
    ],
  },
} as const;

export const NOTE_TYPE_LABELS: Record<string, string> = {
  SOAP: 'SOAP Note',
  psych_eval: 'Psychiatric Evaluation',
  therapy: 'Therapy Note',
  progress: 'Progress Note',
  mse: 'Mental Status Exam',
  follow_up: 'Follow-Up Note',
};

export const ENCOUNTER_TYPE_LABELS: Record<string, string> = {
  intake: 'Intake',
  follow_up: 'Follow-Up',
  therapy: 'Therapy Session',
  med_management: 'Medication Management',
};

export const VISIT_MODE_LABELS: Record<string, string> = {
  in_person: 'In Person',
  telehealth: 'Telehealth',
  phone: 'Phone',
  async: 'Asynchronous',
};

export const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  org_admin: 'Organization Admin',
  provider: 'Provider',
  therapist: 'Therapist',
  care_coordinator: 'Care Coordinator',
  intake_staff: 'Intake Staff',
  biller: 'Biller',
  viewer: 'Viewer',
};

export const AI_DISCLAIMER =
  'This content was generated by AI to assist clinician review. It is a suggested draft only — not a finalized clinical document. All content must be reviewed, edited, and approved by a licensed clinician before use. ClinHelp does not independently diagnose, prescribe, or replace clinical judgment.';
