import { Module } from '@nestjs/common';
import { DotPhrasesController } from './dot-phrases.controller';
import { DotPhrasesService } from './dot-phrases.service';

@Module({ controllers: [DotPhrasesController], providers: [DotPhrasesService] })
export class DotPhrasesModule {}
