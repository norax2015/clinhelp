import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TranscriptsService } from './transcripts.service';

@ApiTags('transcripts')
@ApiBearerAuth()
@Controller('transcripts')
export class TranscriptsController {
  constructor(private svc: TranscriptsService) {}
  @Get('encounter/:encounterId') findByEncounter(@Param('encounterId') eid: string) { return this.svc.findByEncounter(eid); }
}
