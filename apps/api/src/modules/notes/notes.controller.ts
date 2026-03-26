import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('notes')
@ApiBearerAuth()
@Controller('notes')
export class NotesController {
  constructor(private svc: NotesService) {}
  @Get() findAll(@CurrentUser('organizationId') o: string, @Query('encounterId') eid?: string, @Query('status') s?: string, @Query('page') p?: number, @Query('limit') l?: number) { return this.svc.findAll(o, { encounterId: eid, status: s, page: p, limit: l }); }
  @Get('encounter/:encounterId') findByEncounter(@Param('encounterId') eid: string, @CurrentUser('organizationId') o: string) { return this.svc.findByEncounter(eid, o); }
  @Get(':id') findOne(@Param('id') id: string, @CurrentUser('organizationId') o: string) { return this.svc.findOne(id, o); }
  @Post() create(@Body() dto: CreateNoteDto, @CurrentUser('organizationId') o: string, @CurrentUser('sub') u: string) { return this.svc.create(dto, o, u); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateNoteDto, @CurrentUser('organizationId') o: string, @CurrentUser('sub') u: string) { return this.svc.update(id, dto, o, u); }
  @Patch(':id/finalize') finalize(@Param('id') id: string, @CurrentUser('organizationId') o: string, @CurrentUser('sub') u: string) { return this.svc.finalize(id, o, u); }
  @Post(':id/sign') sign(@Param('id') id: string, @CurrentUser('organizationId') o: string, @CurrentUser('sub') u: string) { return this.svc.sign(id, o, u); }
  @Get(':id/versions') getVersions(@Param('id') id: string, @CurrentUser('organizationId') o: string) { return this.svc.getVersions(id, o); }
}
