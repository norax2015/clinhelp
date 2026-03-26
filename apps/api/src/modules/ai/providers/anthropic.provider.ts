import { buildNoteSystemPrompt } from '../note-prompt-builder';
import { AI_DISCLAIMER } from '@clinhelp/config';

// Lazy-load the Anthropic SDK so the app doesn't crash if the package isn't installed
let AnthropicClass: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AnthropicClass = require('@anthropic-ai/sdk').default;
} catch {
  AnthropicClass = null;
}

const MODEL = 'claude-sonnet-4-6';

function getClient() {
  if (!AnthropicClass) {
    throw new Error('@anthropic-ai/sdk is not installed. Run: pnpm add @anthropic-ai/sdk --filter api');
  }
  return new AnthropicClass({ apiKey: process.env.ANTHROPIC_API_KEY });
}

export const anthropicProvider = {
  async generateNote(transcript: string, noteType: string, encounterType: string, patientContext?: string) {
    const client = getClient();
    const systemPrompt = buildNoteSystemPrompt();
    // transcript here is actually the full buildNoteUserPrompt() output
    const userPrompt = transcript;

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse structured content from the response
    const structuredContent: Record<string, string> = {};
    const lines = content.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      const sectionMatch = line.match(/^([A-Z][A-Z\s\/&]+):\s*$/);
      if (sectionMatch) {
        if (currentSection && currentContent.length > 0) {
          structuredContent[currentSection.toLowerCase().replace(/\s+/g, '_')] = currentContent.join('\n').trim();
        }
        currentSection = sectionMatch[1];
        currentContent = [];
      } else if (currentSection) {
        currentContent.push(line);
      }
    }
    if (currentSection && currentContent.length > 0) {
      structuredContent[currentSection.toLowerCase().replace(/\s+/g, '_')] = currentContent.join('\n').trim();
    }

    return {
      type: noteType,
      content,
      structuredContent,
      disclaimer: AI_DISCLAIMER,
      generatedAt: new Date().toISOString(),
    };
  },

  async generateNote_section(systemPrompt: string, userPrompt: string): Promise<string> {
    const client = getClient();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 800,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });
    return response.content[0].type === 'text' ? response.content[0].text : '';
  },

  async validateGuardrails(content: string): Promise<{ passed: boolean; flags: string[] }> {
    // Regex-based guardrails — no LLM call needed for fast safety checks
    const flags: string[] = [];
    const lower = content.toLowerCase();
    if (lower.includes('you have') && lower.includes('diagnosis')) {
      flags.push('Content may contain autonomous diagnostic language — review for "suggested for review" framing.');
    }
    if (lower.includes('i am prescribing') || lower.includes('prescribing you')) {
      flags.push('Prescribing language detected — ensure note reflects clinician action, not AI action.');
    }
    return { passed: flags.length === 0, flags };
  },
};
