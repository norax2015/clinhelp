import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../config/prisma.service';
import { mockProvider } from '@clinhelp/ai';
import { buildNoteUserPrompt, buildSectionRegenerationPrompt } from './note-prompt-builder';

function getProvider() {
  const mode = process.env.AI_MODE || 'mock';
  if (mode === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { anthropicProvider } = require('./providers/anthropic.provider');
      return anthropicProvider;
    } catch {
      console.warn('[ClinHelp AI] Anthropic provider failed to load, falling back to mock');
      return mockProvider;
    }
  }
  return mockProvider;
}

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async transcribeEncounter(encounterId: string, organizationId: string, userId: string) {
    const enc = await this.prisma.encounter.findFirst({ where: { id: encounterId, organizationId } });
    if (!enc) throw new NotFoundException('Encounter not found');

    const t = await this.prisma.transcript.create({ data: { encounterId, status: 'processing', provider: process.env.STT_PROVIDER || 'mock' } });
    const result = await mockProvider.transcribeAudio(Buffer.from(''), 'audio/wav');
    const updated = await this.prisma.transcript.update({
      where: { id: t.id },
      data: { status: 'completed', rawText: result.rawText, segments: result.segments as any, durationSeconds: result.durationSeconds },
    });
    await this.prisma.auditLog.create({ data: { organizationId, userId, action: 'transcript_request', resourceType: 'encounter', resourceId: encounterId } });
    return updated;
  }

  async generateNote(
    encounterId: string,
    noteType: string,
    organizationId: string,
    userId: string,
    options?: {
      priorNoteContext?: string;
      specialty?: string;
      visitType?: string;
      chiefComplaint?: string;
      hpi?: string;
      symptoms?: string;
      vitals?: string;
      medications?: string;
      allergies?: string;
      labs?: string;
      assessmentClues?: string;
      planItems?: string;
      todayUpdates?: string;
      customInstructions?: string;
      tonePreference?: 'concise' | 'detailed' | 'balanced';
    }
  ) {
    const enc = await this.prisma.encounter.findFirst({
      where: { id: encounterId, organizationId },
      include: { patient: { select: { firstName: true, lastName: true } }, transcripts: { where: { status: 'completed' }, orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    if (!enc) throw new NotFoundException('Encounter not found');

    const transcript = enc.transcripts[0]?.rawText || '';
    const patientName = `${enc.patient.firstName} ${enc.patient.lastName}`;

    const contextText = buildNoteUserPrompt({
      noteType,
      visitType: options?.visitType || (enc as any).visitMode,
      specialty: options?.specialty || (enc as any).specialty,
      chiefComplaint: options?.chiefComplaint || (enc as any).chiefComplaint,
      hpi: options?.hpi,
      symptoms: options?.symptoms,
      vitals: options?.vitals,
      medications: options?.medications,
      allergies: options?.allergies,
      labs: options?.labs,
      assessmentClues: options?.assessmentClues,
      planItems: options?.planItems,
      transcript: transcript || undefined,
      priorNoteContext: options?.priorNoteContext || (enc as any).priorNoteContext,
      todayUpdates: options?.todayUpdates,
      customInstructions: options?.customInstructions,
      patientName,
      tonePreference: options?.tonePreference,
    });

    const provider = getProvider();
    const result = await provider.generateNote(contextText, noteType as any, enc.type as any, patientName);
    const guardrails = await provider.validateGuardrails(result.content);

    const note = await this.prisma.note.create({
      data: { encounterId, patientId: enc.patientId, providerId: userId, type: noteType as any, status: 'draft', content: result.content, structuredContent: result.structuredContent as any, aiGenerated: true },
    });
    await this.prisma.auditLog.create({ data: { organizationId, userId, action: 'note_generate', resourceType: 'note', resourceId: note.id, metadata: { noteType, aiGenerated: true } } });
    return { note, guardrailFlags: guardrails.flags, disclaimer: result.disclaimer };
  }

  async regenerateSection(
    noteId: string,
    sectionKey: string,
    currentNoteText: string,
    organizationId: string,
    userId: string,
    options?: {
      additionalContext?: string;
      specialty?: string;
      customInstructions?: string;
    }
  ): Promise<{ sectionKey: string; content: string; disclaimer: string }> {
    const note = await this.prisma.note.findFirst({
      where: { id: noteId },
      include: { encounter: { select: { organizationId: true } } },
    });
    if (!note || note.encounter.organizationId !== organizationId) {
      throw new NotFoundException('Note not found');
    }

    const sectionPrompt = buildSectionRegenerationPrompt({
      noteType: note.type,
      sectionKey,
      currentNoteText,
      additionalContext: options?.additionalContext,
      specialty: options?.specialty,
      customInstructions: options?.customInstructions,
    });

    const provider = getProvider();
    const result = await provider.generateNote(sectionPrompt, note.type as any, 'follow_up' as any, '');

    // Extract just the regenerated section content from the result
    const lines = result.content.split('\n');
    const sectionHeader = sectionKey.toUpperCase() + ':';
    let extractedContent = result.content;
    const headerIndex = lines.findIndex((l: string) => l.toUpperCase().startsWith(sectionHeader) || l.toUpperCase().startsWith(`**${sectionHeader}**`));
    if (headerIndex !== -1) {
      extractedContent = lines.slice(headerIndex).join('\n');
    }

    // Get the latest version number for this note
    const latestVersion = await this.prisma.noteVersion.findFirst({
      where: { noteId },
      orderBy: { versionNumber: 'desc' },
    });
    const nextVersionNumber = (latestVersion?.versionNumber ?? 0) + 1;

    await this.prisma.noteVersion.create({
      data: {
        noteId,
        content: currentNoteText,
        editedById: userId,
        versionNumber: nextVersionNumber,
      },
    });

    return {
      sectionKey,
      content: extractedContent,
      disclaimer: 'AI-generated content requires clinician review',
    };
  }

  async updateEncounterContext(
    encounterId: string,
    organizationId: string,
    userId: string,
    data: {
      chiefComplaint?: string;
      specialty?: string;
      priorNoteContext?: string;
      visitType?: string;
      notes?: string;
    }
  ): Promise<void> {
    const enc = await this.prisma.encounter.findFirst({ where: { id: encounterId, organizationId } });
    if (!enc) throw new NotFoundException('Encounter not found');

    const updateData: any = { updatedAt: new Date() };
    if (data.chiefComplaint !== undefined) updateData.chiefComplaint = data.chiefComplaint;
    if (data.notes !== undefined) updateData.notes = data.notes;
    // specialty and priorNoteContext and visitType stored in notes field as encounter doesn't have dedicated columns for all
    // We store what the schema supports
    await this.prisma.encounter.update({
      where: { id: encounterId },
      data: updateData,
    });

    await this.prisma.auditLog.create({
      data: { organizationId, userId, action: 'encounter_update', resourceType: 'encounter', resourceId: encounterId, metadata: { contextUpdate: true } },
    });
  }

  async generateTasks(encounterId: string, organizationId: string, userId: string) {
    const enc = await this.prisma.encounter.findFirst({ where: { id: encounterId, organizationId }, include: { transcripts: { where: { status: 'completed' }, take: 1 } } });
    if (!enc) throw new NotFoundException('Encounter not found');

    const result = await mockProvider.generateFollowUpTasks(enc.transcripts[0]?.rawText || '', '', enc.patientId);
    const tasks = await Promise.all(result.tasks.map(t => this.prisma.task.create({
      data: { organizationId, patientId: t.patientId, encounterId, createdById: userId, title: t.title, description: t.description, status: 'pending', priority: (t.priority as any) || 'medium', dueDate: t.dueDate ? new Date(t.dueDate) : undefined, aiGenerated: true },
    })));
    return { tasks, disclaimer: result.disclaimer };
  }

  async suggestCoding(encounterId: string, organizationId: string, userId: string) {
    const enc = await this.prisma.encounter.findFirst({ where: { id: encounterId, organizationId }, include: { noteRecords: { orderBy: { createdAt: 'desc' }, take: 1 } } });
    if (!enc) throw new NotFoundException('Encounter not found');

    const result = await mockProvider.suggestCodes(enc.noteRecords[0]?.content || '', enc.type as any);
    const suggestion = await this.prisma.codingSuggestion.create({
      data: { encounterId, icd10Codes: result.icd10Codes as any, emLevel: result.emLevel, emRationale: result.emRationale, completenessPrompts: result.completenessPrompts as any, aiGenerated: true },
    });
    return { ...suggestion, icd10Codes: result.icd10Codes, completenessPrompts: result.completenessPrompts };
  }

  async askQuestion(
    question: string,
    organizationId: string,
    userId: string,
    encounterId?: string,
    context?: string,
  ) {
    const provider = getProvider();
    const systemPrompt = `You are ClinHelp AI, a clinical decision support assistant. You assist clinicians with evidence-based clinical questions during patient encounters. You provide concise, structured responses. Always add a brief disclaimer that your responses are AI-generated and require clinician judgment. Do not diagnose or prescribe — support the clinician's workflow.`;
    const fullQuestion = context
      ? `Patient Context: ${context}\n\nClinical Question: ${question}`
      : question;
    const result = await provider.generateNote(
      `${systemPrompt}\n\n${fullQuestion}`,
      'SOAP' as any,
      'follow_up' as any,
      '',
    );
    if (encounterId) {
      await this.prisma.auditLog.create({ data: { organizationId, userId, action: 'note_generate', resourceType: 'encounter', resourceId: encounterId, metadata: { aiAsk: true, question } } }).catch(() => {});
    }
    return { answer: result.content, disclaimer: 'AI-generated response — always apply clinical judgment.' };
  }

  async generateLetter(
    templateType: string,
    patientName: string,
    providerName: string,
    additionalContext: string,
    organizationId: string,
    userId: string,
  ) {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const letterPrompts: Record<string, string> = {
      referral: `Write a professional medical referral letter. Date: ${today}. Patient: ${patientName}. Referring Provider: ${providerName}. Clinical Context: ${additionalContext}. The letter should be addressed "To Whom It May Concern" or the specialist if named in the context. Include reason for referral, relevant clinical history, and any urgency.`,
      consult: `Write a formal consultation request letter. Date: ${today}. Patient: ${patientName}. Requesting Provider: ${providerName}. Clinical Context: ${additionalContext}. Include the reason for consultation, pertinent clinical findings, and what clinical question needs to be answered.`,
      sick_note: `Write a professional medical sick/absence note. Date: ${today}. Patient: ${patientName}. Provider: ${providerName}. Clinical Context: ${additionalContext}. The note should state the patient was seen and is unable to perform work/school duties. Include dates if mentioned in context.`,
      return_to_work: `Write a return-to-work/school medical clearance letter. Date: ${today}. Patient: ${patientName}. Provider: ${providerName}. Clinical Context: ${additionalContext}. The letter should state the patient is cleared to return, with any restrictions noted.`,
      school_letter: `Write a professional school/caregiver medical letter. Date: ${today}. Patient: ${patientName}. Provider: ${providerName}. Clinical Context: ${additionalContext}. Address relevant accommodations or medical information that the school or caregiver needs to know.`,
      prior_auth: `Write a prior authorization medical necessity letter for insurance. Date: ${today}. Patient: ${patientName}. Provider: ${providerName}. Clinical Context: ${additionalContext}. Include diagnosis, requested treatment/medication, clinical rationale, and why alternatives were insufficient or contraindicated.`,
      disability: `Write a disability/FMLA support letter. Date: ${today}. Patient: ${patientName}. Provider: ${providerName}. Clinical Context: ${additionalContext}. Include the medical condition, functional limitations, expected duration, and the provider's support of the leave/disability claim.`,
      patient_summary: `Write a clinical patient summary letter. Date: ${today}. Patient: ${patientName}. Provider: ${providerName}. Clinical Context: ${additionalContext}. Summarize the patient's current diagnoses, medications, recent encounter findings, and care plan in a clear, professional format suitable for sharing with the patient or another provider.`,
    };
    const prompt = letterPrompts[templateType] || letterPrompts.patient_summary;
    const provider = getProvider();
    const result = await provider.generateNote(prompt, 'SOAP' as any, 'follow_up' as any, patientName);
    await this.prisma.auditLog.create({ data: { organizationId, userId, action: 'note_generate', resourceType: 'letter', resourceId: userId, metadata: { letterGenerate: true, templateType, patientName } } }).catch(() => {});
    return { letter: result.content, templateType, disclaimer: 'AI-generated letter — review and edit before sending.' };
  }

  async generateInstructions(encounterId: string, organizationId: string, userId: string) {
    const enc = await this.prisma.encounter.findFirst({
      where: { id: encounterId, organizationId },
      include: { patient: { select: { firstName: true, lastName: true } }, noteRecords: { orderBy: { createdAt: 'desc' }, take: 1 }, provider: { select: { firstName: true, lastName: true, title: true } } },
    });
    if (!enc) throw new NotFoundException('Encounter not found');

    const patientName = `${enc.patient.firstName} ${enc.patient.lastName}`;
    const providerName = `${enc.provider.title || ''} ${enc.provider.firstName} ${enc.provider.lastName}`.trim();
    const result = await mockProvider.generatePatientInstructions(enc.noteRecords[0]?.content || '', patientName, providerName);
    const instruction = await this.prisma.patientInstruction.create({
      data: { encounterId, patientId: enc.patientId, content: result.content, followUpDate: result.followUpDate ? new Date(result.followUpDate) : undefined, followUpInstructions: result.followUpInstructions, warningSignsToWatch: result.warningSignsToWatch, aiGenerated: true },
    });
    return { ...instruction, disclaimer: result.disclaimer };
  }
}
