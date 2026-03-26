import { Module } from '@nestjs/common';
import { NotePreferencesController } from './note-preferences.controller';
import { NotePreferencesService } from './note-preferences.service';

@Module({ controllers: [NotePreferencesController], providers: [NotePreferencesService] })
export class NotePreferencesModule {}
