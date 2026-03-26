import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('patients')
@ApiBearerAuth()
@Controller('patients')
export class PatientsController {
  constructor(private svc: PatientsService) {}
  @Get() findAll(@CurrentUser('organizationId') o: string, @Query('search') s?: string, @Query('status') st?: string, @Query('page') p?: number, @Query('limit') l?: number) { return this.svc.findAll(o, { search: s, status: st, page: p, limit: l }); }
  @Get(':id') findOne(@Param('id') id: string, @CurrentUser('organizationId') o: string) { return this.svc.findOne(id, o); }
  @Post() create(@Body() dto: CreatePatientDto, @CurrentUser('organizationId') o: string, @CurrentUser('sub') u: string) { return this.svc.create(dto, o, u); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdatePatientDto, @CurrentUser('organizationId') o: string, @CurrentUser('sub') u: string) { return this.svc.update(id, dto, o, u); }
  @Get(':id/diagnoses') getDiagnoses(@Param('id') id: string, @CurrentUser('organizationId') o: string) { return this.svc.getDiagnoses(id, o); }
  @Get(':id/medications') getMedications(@Param('id') id: string, @CurrentUser('organizationId') o: string) { return this.svc.getMedications(id, o); }
  @Get(':id/encounters') getEncounters(@Param('id') id: string, @CurrentUser('organizationId') o: string) { return this.svc.getEncounters(id, o); }
  @Get(':id/screenings') getScreenings(@Param('id') id: string, @CurrentUser('organizationId') o: string) { return this.svc.getScreenings(id, o); }
}
