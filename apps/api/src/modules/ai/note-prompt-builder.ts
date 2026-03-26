import { getNoteTypeSchema } from './note-type-schemas';

export interface NoteGenerationInput {
  noteType: string;
  visitType?: string;
  specialty?: string;
  chiefComplaint?: string;
  hpi?: string;
  symptoms?: string;
  vitals?: string;
  medications?: string;
  allergies?: string;
  labs?: string;
  assessmentClues?: string;
  planItems?: string;
  transcript?: string;
  priorNoteContext?: string;
  todayUpdates?: string;
  customInstructions?: string;
  patientName?: string;
  providerName?: string;
  tonePreference?: 'concise' | 'detailed' | 'balanced';
}

export interface SectionRegenerationInput {
  noteType: string;
  sectionKey: string;
  currentNoteText: string;
  additionalContext?: string;
  specialty?: string;
  customInstructions?: string;
}

export function buildNoteSystemPrompt(): string {
  return `You are ClinHelp, an AI clinical documentation assistant built for licensed healthcare providers. Your role is to generate structured, professional clinical notes based on information provided by the clinician.

CRITICAL RULES:
- Generate notes based ONLY on information provided by the clinician. Do not invent clinical details.
- If information is insufficient for a section, write "[Insufficient information provided — clinician to complete]" rather than fabricating content.
- Always use clinically appropriate language consistent with the note type.
- Never present AI-generated content as final medical judgment. Notes require clinician review and signature.
- For risk/safety sections, always include explicit assessment of suicidal ideation and homicidal ideation when clinically indicated.
- Use standard clinical abbreviations where appropriate.
- Format section headers in ALL CAPS followed by a newline for easy parsing.

OUTPUT FORMAT:
- Write each section starting with the SECTION NAME in all caps, followed by a colon, then the content.
- Separate sections with a blank line.
- Do not include preamble, introductions, or disclaimers in the note body.
- Write as if authored by the treating clinician.`;
}

export function buildVisitTypeInstruction(visitType?: string): string {
  const instructions: Record<string, string> = {
    new_patient: 'This is a NEW PATIENT visit. Include comprehensive history sections. Document all relevant background thoroughly as this establishes the initial clinical record.',
    follow_up: 'This is a FOLLOW-UP visit. Emphasize interval changes since the last visit. Reflect continuity of care. Reference prior note context if provided.',
    urgent: 'This is an URGENT or SAME-DAY visit. Focus on the acute presentation. Keep note focused and clinically relevant. Document disposition clearly.',
    med_management: 'This is a MEDICATION MANAGEMENT visit. Emphasize medication response, adherence, side effects, dose changes, and safety monitoring.',
    therapy: 'This is a THERAPY SESSION. Focus on session themes, interventions used, patient response, and progress toward treatment goals.',
    consult: 'This is a CONSULTATION. Use formal consultant format. Provide clear recommendations to the referring provider.',
    procedure: 'This is a PROCEDURE visit. Document indication, consent, technique, findings, complications, and post-procedure plan.',
    discharge_followup: 'This is a POST-DISCHARGE follow-up. Summarize hospital course briefly, document current status and transition of care plan.',
    telehealth: 'This visit was conducted via TELEHEALTH. Note the telehealth modality. Document patient consent for telehealth and any technical limitations to the examination.',
    phone: 'This visit was conducted via PHONE. Note phone encounter modality. Document the nature of the call and any limitations.',
  };
  return instructions[visitType || ''] || '';
}

export function buildSpecialtyInstruction(specialty?: string): string {
  const instructions: Record<string, string> = {
    psychiatry: 'Apply psychiatric specialty standards. Include DSM-5-TR diagnostic criteria when diagnosing. Risk assessment must include SI, HI, and access to means.',
    addiction_medicine: 'Apply addiction medicine specialty standards. Document substance use history using standardized terminology. Include AUDIT/CAGE results if applicable. Note MAT medications with adherence and UDS results.',
    behavioral_health: 'Apply behavioral health standards. Focus on functional impairment, symptom severity, and treatment response.',
    primary_care: 'Apply primary care documentation standards. Include relevant preventive care items. Use HEDIS-aligned language for chronic disease management.',
    therapy: 'Apply psychotherapy documentation standards. Include modality-specific terminology. Document progress toward treatment plan goals.',
    pediatrics: 'Apply pediatric documentation standards. Note developmental milestones where appropriate. Include parent/guardian involvement.',
  };
  return instructions[specialty || ''] || '';
}

export function buildNoteUserPrompt(input: NoteGenerationInput): string {
  const schema = getNoteTypeSchema(input.noteType);
  const sections = schema?.sections.map(s => s.key) || ['Subjective', 'Objective', 'Assessment', 'Plan'];

  const visitInstruction = buildVisitTypeInstruction(input.visitType);
  const specialtyInstruction = buildSpecialtyInstruction(input.specialty);
  const toneInstruction = input.tonePreference === 'concise'
    ? 'Write concisely. Each section should be direct and efficient.'
    : input.tonePreference === 'detailed'
    ? 'Write in comprehensive detail. Include thorough clinical reasoning.'
    : 'Write in a balanced style — thorough but efficient.';

  const parts: string[] = [];

  parts.push(`Generate a clinical ${schema?.label || input.noteType} with the following sections: ${sections.join(', ')}.`);

  if (visitInstruction) parts.push(`\nVISIT CONTEXT: ${visitInstruction}`);
  if (specialtyInstruction) parts.push(`\nSPECIALTY CONTEXT: ${specialtyInstruction}`);
  parts.push(`\nTONE: ${toneInstruction}`);

  if (input.patientName) parts.push(`\nPATIENT: ${input.patientName}`);
  if (input.providerName) parts.push(`PROVIDER: ${input.providerName}`);

  parts.push('\n--- CLINICAL INFORMATION PROVIDED ---');

  if (input.chiefComplaint) parts.push(`CHIEF COMPLAINT: ${input.chiefComplaint}`);
  if (input.hpi) parts.push(`HPI / NARRATIVE: ${input.hpi}`);
  if (input.symptoms) parts.push(`SYMPTOMS: ${input.symptoms}`);
  if (input.vitals) parts.push(`VITALS: ${input.vitals}`);
  if (input.medications) parts.push(`CURRENT MEDICATIONS: ${input.medications}`);
  if (input.allergies) parts.push(`ALLERGIES: ${input.allergies}`);
  if (input.labs) parts.push(`LABS / DIAGNOSTICS: ${input.labs}`);
  if (input.assessmentClues) parts.push(`ASSESSMENT NOTES: ${input.assessmentClues}`);
  if (input.planItems) parts.push(`PLAN ITEMS: ${input.planItems}`);
  if (input.transcript) parts.push(`\nVISIT TRANSCRIPT / NOTES:\n${input.transcript}`);
  if (input.todayUpdates) parts.push(`\nTODAY'S UPDATES: ${input.todayUpdates}`);

  if (input.priorNoteContext) {
    parts.push(`\n--- PRIOR NOTE CONTEXT (for continuity) ---\n${input.priorNoteContext}`);
  }

  if (input.customInstructions) {
    parts.push(`\n--- PROVIDER CUSTOM INSTRUCTIONS ---\n${input.customInstructions}`);
  }

  parts.push('\n--- END OF INPUT ---');
  parts.push('\nNow generate the complete clinical note:');

  return parts.join('\n');
}

export function buildSectionRegenerationPrompt(input: SectionRegenerationInput): string {
  const { noteType, sectionKey, currentNoteText, additionalContext, specialty, customInstructions } = input;

  const specialtyInstruction = buildSpecialtyInstruction(specialty);

  const userPrompt = [
    `You are regenerating ONLY the "${sectionKey}" section of an existing ${noteType} clinical note.`,
    '',
    'EXISTING NOTE (for context):',
    currentNoteText,
    '',
    `Regenerate ONLY the "${sectionKey}" section. Do not include any other sections.`,
    `Start your response directly with: ${sectionKey.toUpperCase()}:`,
    '',
    specialtyInstruction ? `SPECIALTY CONTEXT: ${specialtyInstruction}` : '',
    additionalContext ? `ADDITIONAL CONTEXT FOR THIS SECTION: ${additionalContext}` : '',
    customInstructions ? `PROVIDER INSTRUCTIONS: ${customInstructions}` : '',
    '',
    `Generate the improved ${sectionKey} section:`,
  ].filter(Boolean).join('\n');

  return userPrompt;
}
