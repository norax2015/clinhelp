import { Controller, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('ai')
@ApiBearerAuth()
@Controller('encounters/:encounterId')
export class AiController {
  constructor(private svc: AiService) {}

  @Post('transcribe')
  transcribe(
    @Param('encounterId') eid: string,
    @CurrentUser('organizationId') o: string,
    @CurrentUser('sub') u: string,
  ) {
    return this.svc.transcribeEncounter(eid, o, u);
  }

  @Post('generate-note')
  generateNote(
    @Param('encounterId') eid: string,
    @Body() body: {
      noteType: string;
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
      tonePreference?: string;
    },
    @CurrentUser('organizationId') o: string,
    @CurrentUser('sub') u: string,
  ) {
    return this.svc.generateNote(eid, body.noteType || 'SOAP', o, u, {
      priorNoteContext: body.priorNoteContext,
      specialty: body.specialty,
      visitType: body.visitType,
      chiefComplaint: body.chiefComplaint,
      hpi: body.hpi,
      symptoms: body.symptoms,
      vitals: body.vitals,
      medications: body.medications,
      allergies: body.allergies,
      labs: body.labs,
      assessmentClues: body.assessmentClues,
      planItems: body.planItems,
      todayUpdates: body.todayUpdates,
      customInstructions: body.customInstructions,
      tonePreference: body.tonePreference as any,
    });
  }

  @Post('generate-tasks')
  generateTasks(
    @Param('encounterId') eid: string,
    @CurrentUser('organizationId') o: string,
    @CurrentUser('sub') u: string,
  ) {
    return this.svc.generateTasks(eid, o, u);
  }

  @Post('suggest-coding')
  suggestCoding(
    @Param('encounterId') eid: string,
    @CurrentUser('organizationId') o: string,
    @CurrentUser('sub') u: string,
  ) {
    return this.svc.suggestCoding(eid, o, u);
  }

  @Post('generate-instructions')
  generateInstructions(
    @Param('encounterId') eid: string,
    @CurrentUser('organizationId') o: string,
    @CurrentUser('sub') u: string,
  ) {
    return this.svc.generateInstructions(eid, o, u);
  }
}

@ApiTags('ai')
@ApiBearerAuth()
@Controller('ai')
export class AiStandaloneController {
  constructor(private svc: AiService) {}

  @Post('ask')
  askQuestion(
    @Body() body: { question: string; encounterId?: string; context?: string },
    @CurrentUser('organizationId') o: string,
    @CurrentUser('sub') u: string,
  ) {
    return this.svc.askQuestion(body.question, o, u, body.encounterId, body.context);
  }

  @Post('generate-letter')
  generateLetter(
    @Body() body: {
      templateType: string;
      patientName: string;
      providerName?: string;
      additionalContext?: string;
    },
    @CurrentUser('organizationId') o: string,
    @CurrentUser('sub') u: string,
  ) {
    return this.svc.generateLetter(
      body.templateType,
      body.patientName || 'Patient',
      body.providerName || '',
      body.additionalContext || '',
      o,
      u,
    );
  }

  @Post('regenerate-section')
  regenerateSection(
    @Body() body: {
      noteId: string;
      sectionKey: string;
      currentNoteText: string;
      additionalContext?: string;
      specialty?: string;
      customInstructions?: string;
    },
    @CurrentUser('organizationId') o: string,
    @CurrentUser('sub') u: string,
  ) {
    return this.svc.regenerateSection(
      body.noteId,
      body.sectionKey,
      body.currentNoteText,
      o,
      u,
      {
        additionalContext: body.additionalContext,
        specialty: body.specialty,
        customInstructions: body.customInstructions,
      },
    );
  }
}
