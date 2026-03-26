import { AI_DISCLAIMER } from '@clinhelp/config';
import type {
  GeneratedNote,
  GeneratedTasks,
  GeneratedInstructions,
  ScreeningInterpretation,
  ICD10Suggestion,
  NoteType,
  EncounterType,
  TranscriptSegment,
} from '@clinhelp/types';

/**
 * Mock AI provider for local development.
 * Returns realistic structured outputs without calling external APIs.
 * Set AI_MODE=mock in your .env to use this provider.
 */

export const mockProvider = {
  async transcribeAudio(
    _fileBuffer: Buffer,
    _mimeType: string
  ): Promise<{ rawText: string; segments: TranscriptSegment[]; durationSeconds: number }> {
    await delay(1500);
    return {
      rawText: `Provider: Good morning. How have you been feeling since our last appointment?

Patient: Honestly, it's been a mixed week. My sleep has been better, but I've been having more anxious thoughts during the day.

Provider: Tell me more about those anxious thoughts. What are they focused on?

Patient: Mostly work stress and some family stuff. I keep going over worst-case scenarios in my head.

Provider: And the sleep improvement — what do you think has helped there?

Patient: The sleep hygiene changes we talked about. No phone after 9, keeping the room cool. It's actually working.

Provider: That's great progress. Let's talk about the anxiety. Are you still doing the breathing exercises?

Patient: Sometimes. I forget during the day but I do them at night.

Provider: I'd like to refocus on making those a daytime tool. We'll talk about that. Overall, how would you rate your mood this week on a scale of 1 to 10?

Patient: Maybe a 5 or 6. Better than last month but still struggling.`,
      segments: [
        {
          speaker: 'provider',
          text: 'Good morning. How have you been feeling since our last appointment?',
          startMs: 0,
          endMs: 3200,
        },
        {
          speaker: 'patient',
          text: "Honestly, it's been a mixed week. My sleep has been better, but I've been having more anxious thoughts during the day.",
          startMs: 3500,
          endMs: 9800,
        },
        {
          speaker: 'provider',
          text: 'Tell me more about those anxious thoughts. What are they focused on?',
          startMs: 10200,
          endMs: 14000,
        },
        {
          speaker: 'patient',
          text: 'Mostly work stress and some family stuff. I keep going over worst-case scenarios in my head.',
          startMs: 14500,
          endMs: 20000,
        },
        {
          speaker: 'provider',
          text: "And the sleep improvement — what do you think has helped there?",
          startMs: 20500,
          endMs: 24000,
        },
        {
          speaker: 'patient',
          text: "The sleep hygiene changes we talked about. No phone after 9, keeping the room cool. It's actually working.",
          startMs: 24500,
          endMs: 31000,
        },
        {
          speaker: 'provider',
          text: "That's great progress. Let's talk about the anxiety. Are you still doing the breathing exercises?",
          startMs: 31500,
          endMs: 36000,
        },
        {
          speaker: 'patient',
          text: 'Sometimes. I forget during the day but I do them at night.',
          startMs: 36500,
          endMs: 40000,
        },
        {
          speaker: 'provider',
          text: "Overall, how would you rate your mood this week on a scale of 1 to 10?",
          startMs: 40500,
          endMs: 44500,
        },
        {
          speaker: 'patient',
          text: 'Maybe a 5 or 6. Better than last month but still struggling.',
          startMs: 45000,
          endMs: 49000,
        },
      ],
      durationSeconds: 180,
    };
  },

  async generateNote(
    transcript: string,
    noteType: NoteType,
    encounterType: EncounterType,
    patientContext?: string
  ): Promise<GeneratedNote> {
    await delay(2000);

    const structuredContent: Record<string, string> = {};

    if (noteType === 'SOAP') {
      structuredContent.subjective =
        'Patient reports a mixed week overall. Sleep has improved with implementation of sleep hygiene strategies (no phone after 9 PM, cool sleep environment). Reports increased daytime anxiety with ruminative thinking focused on work stress and family concerns. Describes cognitive pattern of catastrophizing worst-case scenarios. Mood self-rated 5-6/10, improved from prior month. Breathing exercises used inconsistently — primarily at night, not during daytime anxiety episodes.';
      structuredContent.objective =
        'Patient presents alert and oriented x3. Cooperative and engaged in session. Speech: normal rate and volume. Affect: mildly anxious with appropriate range. Thought process: linear, goal-directed. No suicidal ideation, homicidal ideation, or psychotic features elicited. Vital signs not obtained (telehealth visit).';
      structuredContent.assessment =
        '[Clinician to review and finalize] Based on session content, patient demonstrates partial response to current treatment with sleep improvement but persistent anxiety symptoms. Ruminative thinking pattern consistent with GAD features. PHQ-9/GAD-7 scores should be reviewed for objective comparison.';
      structuredContent.plan =
        '[Clinician to review and finalize]\n1. Continue current medication regimen pending clinician review.\n2. Reinforce daytime use of diaphragmatic breathing and grounding techniques for acute anxiety.\n3. Introduce scheduled worry time technique to address ruminative thinking pattern.\n4. Follow-up appointment in 2-4 weeks.\n5. Consider GAD-7 rescreening at next visit.';
    } else if (noteType === 'psych_eval') {
      structuredContent.chiefComplaint = 'Anxiety and sleep difficulties.';
      structuredContent.historyOfPresentIllness =
        'Patient reports chronic anxiety with recent exacerbation related to workplace and family stressors. Describes ruminative thinking and worst-case scenario ideation. Notes improvement in sleep with behavioral interventions.';
      structuredContent.mentalStatusExam =
        'Alert and oriented. Well-groomed. Normal psychomotor activity. Speech: normal rate, rhythm, volume. Mood: "anxious." Affect: mildly anxious, appropriate. Thought process: linear, goal-directed. Thought content: no SI/HI/AVH. Insight: good. Judgment: intact.';
      structuredContent.diagnosticImpression =
        '[Clinician review required] Diagnostic impressions are suggested for clinician review only. Symptoms appear consistent with anxiety disorder — clinician to confirm and finalize diagnoses using clinical judgment and full assessment.';
      structuredContent.treatmentPlan =
        '[Clinician to finalize] Continue psychotherapy. Reinforce behavioral anxiety management strategies. Review pharmacotherapy as appropriate. Follow-up in 2-4 weeks.';
    } else if (noteType === 'therapy') {
      structuredContent.sessionFocus =
        'Anxiety management, sleep hygiene reinforcement, cognitive restructuring.';
      structuredContent.interventionsUsed =
        'Psychoeducation on anxiety and ruminative thinking. Review and reinforcement of sleep hygiene strategies. Introduction of scheduled worry time technique. Diaphragmatic breathing review.';
      structuredContent.patientResponse =
        'Patient was engaged and receptive. Acknowledged inconsistent use of coping strategies. Demonstrated openness to trying scheduled worry time technique.';
      structuredContent.progressNotes =
        '[Clinician to review] Patient reports subjective improvement in sleep. Anxiety remains a primary concern with ruminative features. Partial engagement with prescribed interventions.';
      structuredContent.plan =
        'Continue CBT-informed therapy. Practice scheduled worry time daily. Continue sleep hygiene strategies. Follow-up in 2 weeks.';
    } else {
      structuredContent.content =
        '[Clinician to review and complete]\nSession focused on anxiety management and sleep. Patient reports mixed progress. See transcript for full session details.';
    }

    const content = Object.entries(structuredContent)
      .map(([key, val]) => `**${formatKey(key)}**\n${val}`)
      .join('\n\n');

    return {
      type: noteType,
      content,
      structuredContent,
      disclaimer: AI_DISCLAIMER,
      generatedAt: new Date().toISOString(),
    };
  },

  async generateFollowUpTasks(
    transcript: string,
    noteContent: string,
    patientId: string
  ): Promise<GeneratedTasks> {
    await delay(1000);
    return {
      tasks: [
        {
          patientId,
          title: 'Reschedule follow-up appointment',
          description:
            'Patient to return for follow-up in 2-4 weeks. Clinician to confirm timeframe.',
          status: 'pending',
          priority: 'medium',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          patientId,
          title: 'Administer GAD-7 at next visit',
          description:
            'Clinician-suggested: reassess anxiety symptoms with GAD-7 to track treatment response.',
          status: 'pending',
          priority: 'medium',
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          patientId,
          title: 'Review medication adherence',
          description:
            'Confirm patient medication regimen and adherence at next encounter.',
          status: 'pending',
          priority: 'low',
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      disclaimer: AI_DISCLAIMER,
    };
  },

  async generatePatientInstructions(
    noteContent: string,
    patientName: string,
    providerName: string
  ): Promise<GeneratedInstructions> {
    await delay(1000);
    return {
      content: `Dear ${patientName},

Thank you for your appointment today with ${providerName}. Below are your personalized care notes for your reference.

**Key Takeaways from Today's Visit**
- Your sleep has improved — keep using the strategies that are working (no phone after 9 PM, cool bedroom).
- Continue practicing your breathing exercises, and try to use them during the daytime when you notice anxiety.
- We discussed a new technique called "scheduled worry time" — try setting aside 15 minutes each day to write down your worries, then gently redirect your thoughts outside of that time.

**Your Follow-Up Plan**
- Your next appointment is in approximately 2-4 weeks. Please contact the office to confirm your scheduled date.
- If your symptoms worsen significantly before then, please contact us.

**When to Seek Help Immediately**
- If you experience thoughts of harming yourself or others, please call 988 (Suicide & Crisis Lifeline) or go to your nearest emergency room.

*These instructions were prepared with AI assistance and reviewed by your provider. They are for informational purposes only and do not replace your provider's clinical judgment.*`,
      followUpDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      followUpInstructions:
        'Return in 2-4 weeks for follow-up. Contact office to confirm date.',
      warningSignsToWatch:
        'Significant worsening of anxiety or mood, inability to sleep, thoughts of self-harm. If any of these occur, contact the office or call 988.',
      disclaimer: AI_DISCLAIMER,
    };
  },

  async suggestCodes(
    noteContent: string,
    encounterType: EncounterType
  ): Promise<{
    icd10Codes: ICD10Suggestion[];
    emLevel?: string;
    emRationale?: string;
    completenessPrompts: string[];
  }> {
    await delay(800);
    return {
      icd10Codes: [
        {
          code: 'F41.1',
          description: 'Generalized anxiety disorder',
          confidence: 0.82,
          rationale:
            'Documentation references persistent worry, ruminative thinking, difficulty relaxing. Suggested for clinician review.',
        },
        {
          code: 'F51.01',
          description: 'Primary insomnia',
          confidence: 0.61,
          rationale:
            'Sleep difficulties noted in session. Improvement with behavioral intervention documented. Clinician to confirm.',
        },
        {
          code: 'Z73.1',
          description: 'Type A behavior pattern (stress-related)',
          confidence: 0.45,
          rationale: 'Work and family stressors documented as contributing factors.',
        },
      ],
      emLevel: '99214',
      emRationale:
        'Moderate complexity: new/established problem with exacerbation, review of symptoms, prescription management discussion. Clinician to verify and confirm E/M level.',
      completenessPrompts: [
        'Consider documenting specific GAD-7 score if screener was administered today.',
        'Medication name, dose, and adherence not explicitly documented — consider adding for completeness.',
        'PHQ-9 results from prior visit not referenced — consider noting for continuity.',
        'Risk assessment (SI/HI) noted in objective — consider explicit documentation per clinical protocol.',
      ],
    };
  },

  async interpretScreening(
    type: string,
    totalScore: number,
    responses: Array<{ questionId: string; answer: number }>
  ): Promise<ScreeningInterpretation> {
    await delay(500);

    const interpretations: Record<
      string,
      (score: number) => ScreeningInterpretation
    > = {
      PHQ9: (score) => {
        let severity: ScreeningInterpretation['severity'] = 'none';
        let severityLabel = '';
        let clinicalNotes = '';

        if (score <= 4) {
          severity = 'minimal';
          severityLabel = 'Minimal depression';
          clinicalNotes = 'Score in minimal range. Monitor as clinically indicated.';
        } else if (score <= 9) {
          severity = 'mild';
          severityLabel = 'Mild depression';
          clinicalNotes =
            'Mild depressive symptoms. Watchful waiting and supportive care recommended for clinician consideration.';
        } else if (score <= 14) {
          severity = 'moderate';
          severityLabel = 'Moderate depression';
          clinicalNotes =
            'Moderate symptoms. Treatment planning and close follow-up recommended per clinician judgment.';
        } else if (score <= 19) {
          severity = 'moderately_severe';
          severityLabel = 'Moderately severe depression';
          clinicalNotes =
            'Moderately severe symptoms. Active treatment and follow-up warranted per clinician judgment.';
        } else {
          severity = 'severe';
          severityLabel = 'Severe depression';
          clinicalNotes = 'Severe symptoms. Urgent clinical evaluation recommended.';
        }

        return {
          score,
          severity,
          severityLabel,
          clinicalNotes: clinicalNotes + '\n\n' + AI_DISCLAIMER,
          disclaimer: AI_DISCLAIMER,
        };
      },
      GAD7: (score) => {
        let severity: ScreeningInterpretation['severity'] = 'none';
        let severityLabel = '';
        let clinicalNotes = '';

        if (score <= 4) {
          severity = 'minimal';
          severityLabel = 'Minimal anxiety';
          clinicalNotes = 'Score in minimal range. Monitor as clinically indicated.';
        } else if (score <= 9) {
          severity = 'mild';
          severityLabel = 'Mild anxiety';
          clinicalNotes = 'Mild anxiety symptoms identified.';
        } else if (score <= 14) {
          severity = 'moderate';
          severityLabel = 'Moderate anxiety';
          clinicalNotes =
            'Moderate anxiety. Further assessment and treatment planning recommended per clinician judgment.';
        } else {
          severity = 'severe';
          severityLabel = 'Severe anxiety';
          clinicalNotes =
            'Severe anxiety symptoms. Prompt clinical evaluation and intervention recommended.';
        }

        return {
          score,
          severity,
          severityLabel,
          clinicalNotes: clinicalNotes + '\n\n' + AI_DISCLAIMER,
          disclaimer: AI_DISCLAIMER,
        };
      },
    };

    const interpret = interpretations[type];
    if (interpret) return interpret(totalScore);

    return {
      score: totalScore,
      severity: 'mild',
      severityLabel: 'See clinical guidelines',
      clinicalNotes:
        'Score interpretation requires clinician review per clinical guidelines for this instrument. ' +
        AI_DISCLAIMER,
      disclaimer: AI_DISCLAIMER,
    };
  },

  async validateGuardrails(
    content: string
  ): Promise<{ passed: boolean; flags: string[] }> {
    await delay(200);
    const flags: string[] = [];
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes('you have') && lowerContent.includes('diagnosis')) {
      flags.push(
        'Content may contain autonomous diagnostic language — review for "suggested for review" framing.'
      );
    }
    if (lowerContent.includes('prescribe') || lowerContent.includes('i am prescribing')) {
      flags.push(
        'Prescribing language detected — ensure note reflects clinician action, not AI action.'
      );
    }
    if (
      lowerContent.includes('patient must') ||
      lowerContent.includes('patient should immediately')
    ) {
      flags.push(
        'Directive language may need softening — verify content reflects clinical guidance, not autonomous AI instruction.'
      );
    }

    return { passed: flags.length === 0, flags };
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
