import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CodingService } from './coding.service';

@ApiTags('coding')
@ApiBearerAuth()
@Controller('coding')
export class CodingController {
  constructor(private svc: CodingService) {}
  @Get('encounter/:encounterId') findByEncounter(@Param('encounterId') eid: string) { return this.svc.findByEncounter(eid); }
  @Patch(':id/status') updateStatus(@Param('id') id: string, @Body('status') s: string) { return this.svc.updateStatus(id, s); }
}
