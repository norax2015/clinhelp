import { IsString, IsEnum, IsOptional } from 'class-validator';
export class CreateEncounterDto {
  @IsString() patientId!: string;
  @IsOptional() @IsString() providerId?: string;
  @IsEnum(['intake','follow_up','therapy','med_management']) type!: string;
  @IsEnum(['in_person','telehealth','phone','async']) visitMode!: string;
  @IsOptional() @IsString() chiefComplaint?: string;
  @IsOptional() @IsString() scheduledAt?: string;
  @IsOptional() @IsString() specialty?: string;
  @IsOptional() @IsString() priorNoteContext?: string;
}
