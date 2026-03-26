import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('templates')
@ApiBearerAuth()
@Controller('templates')
export class TemplatesController {
  constructor(private svc: TemplatesService) {}

  @Get()
  findAll(@CurrentUser('organizationId') orgId: string) {
    return this.svc.findAll(orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('organizationId') orgId: string) {
    return this.svc.findOne(id, orgId);
  }

  @Post()
  create(
    @Body() dto: CreateTemplateDto,
    @CurrentUser('organizationId') orgId: string,
    @CurrentUser('sub') userId: string,
  ) {
    return this.svc.create(orgId, userId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateDto,
    @CurrentUser('organizationId') orgId: string,
  ) {
    return this.svc.update(id, orgId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('organizationId') orgId: string) {
    return this.svc.remove(id, orgId);
  }
}
