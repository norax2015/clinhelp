import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { UsersModule } from './modules/users/users.module';
import { PatientsModule } from './modules/patients/patients.module';
import { EncountersModule } from './modules/encounters/encounters.module';
import { FilesModule } from './modules/files/files.module';
import { TranscriptsModule } from './modules/transcripts/transcripts.module';
import { NotesModule } from './modules/notes/notes.module';
import { ScreeningsModule } from './modules/screenings/screenings.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { CodingModule } from './modules/coding/coding.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { AiModule } from './modules/ai/ai.module';
import { PrismaModule } from './config/prisma.module';
import { DemoRequestsModule } from './modules/demo-requests/demo-requests.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { DotPhrasesModule } from './modules/dot-phrases/dot-phrases.module';
import { NotePreferencesModule } from './modules/note-preferences/note-preferences.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    OrganizationsModule,
    UsersModule,
    PatientsModule,
    EncountersModule,
    FilesModule,
    TranscriptsModule,
    NotesModule,
    ScreeningsModule,
    TasksModule,
    CodingModule,
    AnalyticsModule,
    AuditLogsModule,
    AiModule,
    DemoRequestsModule,
    TemplatesModule,
    DotPhrasesModule,
    NotePreferencesModule,
  ],
})
export class AppModule {}
