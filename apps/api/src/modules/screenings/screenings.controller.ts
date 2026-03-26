import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ScreeningsService } from './screenings.service';
import { CreateScreeningDto } from './dto/create-screening.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('screenings')
@ApiBearerAuth()
@Controller('screenings')
export class ScreeningsController {
  constructor(private svc: ScreeningsService) {}
  @Get() findAll(@CurrentUser('organizationId') o: string, @Query('patientId') pid?: string, @Query('page') p?: number, @Query('limit') l?: number) { return this.svc.findAll(o, { patientId: pid, page: p, limit: l }); }
  @Post() create(@Body() dto: CreateScreeningDto, @CurrentUser('sub') u: string, @CurrentUser('organizationId') o: string) { dto.organizationId = o; return this.svc.create(dto, u); }
  @Get('patient/:patientId') findByPatient(@Param('patientId') pid: string) { return this.svc.findByPatient(pid); }
}
