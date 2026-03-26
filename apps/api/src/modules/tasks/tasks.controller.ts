import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private svc: TasksService) {}
  @Get() findAll(@CurrentUser('organizationId') o: string, @Query('assignedToId') a?: string, @Query('status') s?: string, @Query('patientId') p?: string, @Query('page') pg?: number, @Query('limit') l?: number) { return this.svc.findAll(o, { assignedToId: a, status: s, patientId: p, page: pg, limit: l }); }
  @Post() create(@Body() dto: CreateTaskDto, @CurrentUser('organizationId') o: string, @CurrentUser('sub') u: string) { return this.svc.create(dto, o, u); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateTaskDto, @CurrentUser('organizationId') o: string, @CurrentUser('sub') u: string) { return this.svc.update(id, dto, o, u); }
}
