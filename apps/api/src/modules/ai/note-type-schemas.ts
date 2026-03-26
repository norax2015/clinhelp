export type NoteSection = {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
};

export type NoteTypeSchema = {
  id: string;
  label: string;
  description: string;
  sections: NoteSection[];
};

export const NOTE_TYPE_SCHEMAS: Record<string, NoteTypeSchema> = {
  SOAP: {
    id: 'SOAP',
    label: 'SOAP Note',
    description: 'Subjective, Objective, Assessment, Plan',
    sections: [
      { key: 'Subjective', label: 'Subjective', placeholder: 'Chief complaint, HPI, patient-reported symptoms...', required: true },
      { key: 'Objective', label: 'Objective', placeholder: 'Vitals, physical exam, labs, diagnostics...', required: true },
      { key: 'Assessment', label: 'Assessment', placeholder: 'Clinical impression, diagnoses, problem list...', required: true },
      { key: 'Plan', label: 'Plan', placeholder: 'Treatment plan, medications, referrals, follow-up...', required: true },
    ],
  },
  APSO: {
    id: 'APSO',
    label: 'APSO Note',
    description: 'Assessment-first format: Assessment, Plan, Subjective, Objective',
    sections: [
      { key: 'Assessment', label: 'Assessment', placeholder: 'Clinical impression...', required: true },
      { key: 'Plan', label: 'Plan', placeholder: 'Treatment plan...', required: true },
      { key: 'Subjective', label: 'Subjective', placeholder: 'Patient-reported information...', required: true },
      { key: 'Objective', label: 'Objective', placeholder: 'Clinical findings...', required: true },
    ],
  },
  psych_eval: {
    id: 'psych_eval',
    label: 'Psychiatric Evaluation',
    description: 'Comprehensive psychiatric evaluation format',
    sections: [
      { key: 'Identifying Information', label: 'Identifying Information', placeholder: 'Patient demographics, referral source...', required: false },
      { key: 'Chief Complaint', label: 'Chief Complaint', placeholder: "Primary presenting concern in patient's own words...", required: true },
      { key: 'History of Present Illness', label: 'History of Present Illness', placeholder: 'Onset, duration, severity, associated symptoms, precipitating factors...', required: true },
      { key: 'Psychiatric History', label: 'Psychiatric History', placeholder: 'Prior diagnoses, hospitalizations, medications, treatment history...', required: false },
      { key: 'Medical History', label: 'Medical History', placeholder: 'Chronic conditions, surgeries, allergies...', required: false },
      { key: 'Social History', label: 'Social History', placeholder: 'Living situation, relationships, employment, education, support system...', required: false },
      { key: 'Substance Use History', label: 'Substance Use History', placeholder: 'Current and past substance use, treatment history...', required: false },
      { key: 'Mental Status Exam', label: 'Mental Status Exam', placeholder: 'Appearance, behavior, speech, mood, affect, thought process, thought content, cognition, insight, judgment...', required: true },
      { key: 'Risk Assessment', label: 'Risk Assessment', placeholder: 'Suicidal ideation, homicidal ideation, self-harm, risk factors, protective factors...', required: true },
      { key: 'Diagnosis', label: 'Diagnosis / Clinical Impression', placeholder: 'DSM-5 diagnoses with ICD-10 codes, differential considerations...', required: true },
      { key: 'Treatment Plan', label: 'Treatment Plan', placeholder: 'Medications, therapy modality, referrals, labs, frequency of visits...', required: true },
      { key: 'Follow-Up', label: 'Follow-Up', placeholder: 'Next appointment, monitoring plan, crisis resources...', required: false },
    ],
  },
  therapy: {
    id: 'therapy',
    label: 'Therapy / Behavioral Health Note',
    description: 'Psychotherapy session note format',
    sections: [
      { key: 'Session Focus', label: 'Session Focus / Themes', placeholder: 'Primary themes discussed, patient-identified agenda...', required: true },
      { key: 'Interval Update', label: 'Interval Update', placeholder: 'Changes since last session, events, mood, medications...', required: false },
      { key: 'Interventions', label: 'Interventions Used', placeholder: 'CBT, DBT, motivational interviewing, psychoeducation, other modalities...', required: true },
      { key: 'Patient Response', label: 'Patient Response', placeholder: 'Engagement level, insight, emotional response, barriers...', required: true },
      { key: 'Progress', label: 'Progress Toward Goals', placeholder: 'Treatment plan goals, measurable progress, setbacks...', required: true },
      { key: 'Risk', label: 'Risk / Safety', placeholder: 'Current SI/HI status, safety plan review, risk factors...', required: true },
      { key: 'Plan', label: 'Plan', placeholder: 'Next session focus, homework, referrals, follow-up...', required: true },
    ],
  },
  progress: {
    id: 'progress',
    label: 'Progress Note',
    description: 'Standard outpatient progress note',
    sections: [
      { key: 'Reason for Visit', label: 'Reason for Visit', placeholder: "Chief complaint, reason for today's visit...", required: true },
      { key: 'Interval History', label: 'Interval History', placeholder: 'Changes since last visit, medication changes, events...', required: true },
      { key: 'Objective', label: 'Objective Findings', placeholder: 'Vitals, exam, labs...', required: false },
      { key: 'Assessment', label: 'Assessment', placeholder: 'Clinical impression, active problem list...', required: true },
      { key: 'Plan', label: 'Plan', placeholder: 'Treatment updates, medications, referrals, follow-up...', required: true },
    ],
  },
  follow_up: {
    id: 'follow_up',
    label: 'Follow-Up Note',
    description: 'Follow-up visit with continuity from prior encounter',
    sections: [
      { key: 'Reason for Visit', label: 'Reason for Visit', placeholder: "Reason for today's follow-up...", required: true },
      { key: 'Interval History', label: 'Interval History / Updates', placeholder: 'Changes since last visit, symptom trajectory, medication response...', required: true },
      { key: 'Current Status', label: 'Current Status', placeholder: 'Current symptom burden, functioning, mood, side effects...', required: true },
      { key: 'Assessment', label: 'Assessment', placeholder: 'Diagnostic impression, progress, concerns...', required: true },
      { key: 'Plan', label: 'Plan', placeholder: 'Medication adjustments, referrals, next steps, follow-up interval...', required: true },
    ],
  },
  mse: {
    id: 'mse',
    label: 'Mental Status Exam',
    description: 'Detailed mental status examination',
    sections: [
      { key: 'Appearance', label: 'Appearance', placeholder: 'Dress, grooming, hygiene, posture...', required: true },
      { key: 'Behavior', label: 'Behavior & Psychomotor Activity', placeholder: 'Eye contact, cooperation, agitation, psychomotor retardation...', required: true },
      { key: 'Speech', label: 'Speech', placeholder: 'Rate, rhythm, volume, spontaneity, articulation...', required: true },
      { key: 'Mood', label: 'Mood', placeholder: 'Self-reported emotional state (in quotes)...', required: true },
      { key: 'Affect', label: 'Affect', placeholder: 'Observed emotional expression: range, appropriateness, congruence...', required: true },
      { key: 'Thought Process', label: 'Thought Process', placeholder: 'Linear, circumstantial, tangential, loose associations, flight of ideas...', required: true },
      { key: 'Thought Content', label: 'Thought Content', placeholder: 'SI, HI, delusions, obsessions, phobias, preoccupations...', required: true },
      { key: 'Perceptions', label: 'Perceptions', placeholder: 'Hallucinations (auditory, visual, tactile), illusions, derealization...', required: true },
      { key: 'Cognition', label: 'Cognition', placeholder: 'Orientation, memory, concentration, executive function...', required: true },
      { key: 'Insight', label: 'Insight', placeholder: 'Level of insight into illness and treatment...', required: true },
      { key: 'Judgment', label: 'Judgment', placeholder: 'Decision-making capacity, safety judgment...', required: true },
    ],
  },
  H_and_P: {
    id: 'H_and_P',
    label: 'H&P (History & Physical)',
    description: 'Comprehensive history and physical examination',
    sections: [
      { key: 'Chief Complaint', label: 'Chief Complaint', placeholder: 'Primary presenting concern...', required: true },
      { key: 'HPI', label: 'History of Present Illness', placeholder: 'Detailed HPI using OLDCART framework...', required: true },
      { key: 'Past Medical History', label: 'Past Medical History', placeholder: 'Chronic conditions, hospitalizations, surgeries...', required: false },
      { key: 'Medications', label: 'Medications', placeholder: 'Current medications with doses and frequencies...', required: false },
      { key: 'Allergies', label: 'Allergies', placeholder: 'Drug allergies and reactions...', required: false },
      { key: 'Family History', label: 'Family History', placeholder: 'Relevant family medical history...', required: false },
      { key: 'Social History', label: 'Social History', placeholder: 'Occupation, relationships, substance use, lifestyle...', required: false },
      { key: 'Review of Systems', label: 'Review of Systems', placeholder: 'Pertinent positive and negative findings by system...', required: false },
      { key: 'Physical Exam', label: 'Physical Examination', placeholder: 'Vital signs and systems-based exam findings...', required: true },
      { key: 'Assessment', label: 'Assessment', placeholder: 'Diagnosis, differential diagnosis, clinical reasoning...', required: true },
      { key: 'Plan', label: 'Plan', placeholder: 'Treatment, workup, referrals, follow-up...', required: true },
    ],
  },
  consult: {
    id: 'consult',
    label: 'Consult Note',
    description: 'Consultation note for specialist referral',
    sections: [
      { key: 'Reason for Consultation', label: 'Reason for Consultation', placeholder: 'Referring provider, reason, clinical question...', required: true },
      { key: 'HPI', label: 'History of Present Illness', placeholder: 'Relevant history for this consultation...', required: true },
      { key: 'Pertinent History', label: 'Pertinent Medical/Psychiatric History', placeholder: 'Relevant prior history...', required: false },
      { key: 'Exam / MSE', label: 'Examination Findings', placeholder: 'Pertinent exam findings relevant to consultation...', required: true },
      { key: 'Assessment', label: 'Assessment / Impression', placeholder: 'Clinical impression, diagnosis, differential...', required: true },
      { key: 'Recommendations', label: 'Recommendations', placeholder: 'Specific recommendations to referring provider...', required: true },
      { key: 'Follow-Up', label: 'Follow-Up Plan', placeholder: 'Disposition, follow-up plan, contact information...', required: false },
    ],
  },
  procedure: {
    id: 'procedure',
    label: 'Procedure Note',
    description: 'Documentation for clinical procedures',
    sections: [
      { key: 'Indication', label: 'Indication', placeholder: 'Clinical indication for the procedure...', required: true },
      { key: 'Consent', label: 'Informed Consent', placeholder: 'Consent obtained, risks/benefits discussed...', required: true },
      { key: 'Procedure', label: 'Procedure', placeholder: 'Technique, equipment, medications used, patient positioning...', required: true },
      { key: 'Findings', label: 'Findings', placeholder: 'Findings during procedure, specimens obtained...', required: false },
      { key: 'Complications', label: 'Complications', placeholder: 'Immediate complications or none noted...', required: true },
      { key: 'Post-Procedure Plan', label: 'Post-Procedure Plan', placeholder: 'Recovery instructions, monitoring, follow-up...', required: true },
    ],
  },
  discharge: {
    id: 'discharge',
    label: 'Discharge / Transition Note',
    description: 'Discharge summary or care transition note',
    sections: [
      { key: 'Admission Diagnoses', label: 'Admission / Presenting Diagnoses', placeholder: 'Diagnoses at time of admission or initial presentation...', required: true },
      { key: 'Hospital Course', label: 'Hospital / Treatment Course', placeholder: 'Summary of treatment, significant events, response...', required: true },
      { key: 'Discharge Diagnoses', label: 'Discharge Diagnoses', placeholder: 'Final diagnoses at discharge with ICD-10 codes...', required: true },
      { key: 'Discharge Condition', label: 'Condition at Discharge', placeholder: 'Mental status, functional status, vital signs at discharge...', required: true },
      { key: 'Medications', label: 'Discharge Medications', placeholder: 'Full medication reconciliation with changes noted...', required: true },
      { key: 'Follow-Up', label: 'Follow-Up Plan', placeholder: 'Outpatient providers, appointments, timeline...', required: true },
      { key: 'Patient Instructions', label: 'Patient Instructions', placeholder: 'Warning signs, activity restrictions, diet, return precautions...', required: true },
    ],
  },
  med_management: {
    id: 'med_management',
    label: 'Medication Management Note',
    description: 'Focused medication management visit note',
    sections: [
      { key: 'Reason for Visit', label: 'Reason for Visit', placeholder: 'Medication check, dose adjustment, new prescription...', required: true },
      { key: 'Interval Update', label: 'Interval Update', placeholder: 'Changes since last visit, events, stressors...', required: false },
      { key: 'Medication Response', label: 'Medication Response & Adherence', placeholder: 'Efficacy, adherence, side effects, tolerability...', required: true },
      { key: 'Mental Status Exam', label: 'Mental Status / Clinical Findings', placeholder: 'Current MSE or relevant clinical findings...', required: true },
      { key: 'Risk Assessment', label: 'Risk / Safety Check', placeholder: 'SI/HI, medication safety, controlled substance review...', required: true },
      { key: 'Assessment', label: 'Assessment', placeholder: 'Current clinical status, diagnostic impression...', required: true },
      { key: 'Plan', label: 'Plan', placeholder: 'Medication changes, lab orders, next visit, monitoring...', required: true },
    ],
  },
};

export function getNoteTypeSchema(noteType: string): NoteTypeSchema | null {
  return NOTE_TYPE_SCHEMAS[noteType] || null;
}

export function getSectionLabels(noteType: string): string[] {
  const schema = getNoteTypeSchema(noteType);
  return schema ? schema.sections.map(s => s.key) : [];
}
