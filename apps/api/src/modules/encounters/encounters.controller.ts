import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EncountersService } from './encounters.service';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('encounters')
@ApiBearerAuth()
@Controller('encounters')
export class EncountersController {
  constructor(private svc: EncountersService) {}
  @Get() findAll(@CurrentUser('organizationId') o: string, @Query('patientId') p?: string, @Query('status') s?: string, @Query('page') pg?: number, @Query('limit') l?: number) { return this.svc.findAll(o, { patientId: p, status: s, page: pg, limit: l }); }
  @Get(':id') findOne(@Param('id') id: string, @CurrentUser('organizationId') o: string) { return this.svc.findOne(id, o); }
  @Post() create(@Body() dto: CreateEncounterDto, @CurrentUser('organizationId') o: string, @CurrentUser('sub') u: string) { return this.svc.create(dto, o, u); }
  @Patch(':id/status') updateStatus(@Param('id') id: string, @Body('status') s: string, @CurrentUser('organizationId') o: string, @CurrentUser('sub') u: string) { return this.svc.updateStatus(id, s, o, u); }
}
