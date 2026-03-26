import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DotPhrasesService } from './dot-phrases.service';
import { CreateDotPhraseDto } from './dto/create-dot-phrase.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('dot-phrases')
@ApiBearerAuth()
@Controller('dot-phrases')
export class DotPhrasesController {
  constructor(private svc: DotPhrasesService) {}

  @Get()
  findAll(@CurrentUser('sub') userId: string, @CurrentUser('organizationId') orgId: string) {
    return this.svc.findAll(userId, orgId);
  }

  @Post()
  create(
    @Body() dto: CreateDotPhraseDto,
    @CurrentUser('sub') userId: string,
    @CurrentUser('organizationId') orgId: string,
  ) {
    return this.svc.create(userId, orgId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.svc.remove(id, userId);
  }
}
