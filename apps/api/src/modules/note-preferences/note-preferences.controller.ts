import { Controller, Get, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotePreferencesService } from './note-preferences.service';
import { UpdateNotePreferenceDto } from './dto/update-note-preference.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('preferences')
@ApiBearerAuth()
@Controller('preferences/note')
export class NotePreferencesController {
  constructor(private svc: NotePreferencesService) {}

  @Get()
  get(@CurrentUser('sub') userId: string) {
    return this.svc.findOrCreate(userId);
  }

  @Patch()
  update(@Body() dto: UpdateNotePreferenceDto, @CurrentUser('sub') userId: string) {
    return this.svc.update(userId, dto);
  }
}
