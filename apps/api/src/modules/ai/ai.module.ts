import { Module } from '@nestjs/common';
import { AiController, AiStandaloneController } from './ai.controller';
import { AiService } from './ai.service';
@Module({ controllers: [AiController, AiStandaloneController], providers: [AiService], exports: [AiService] })
export class AiModule {}
