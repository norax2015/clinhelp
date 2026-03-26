import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
export class CreateScreeningDto {
  @IsString() patientId!: string;
  @IsOptional() @IsString() encounterId?: string;
  @IsEnum(['PHQ9','GAD7','CSSRS','AUDIT']) type!: string;
  @IsArray() responses!: Array<{ questionId: string; question: string; answer: number; label: string }>;
  @IsOptional() @IsString() notes?: string;
  organizationId!: string;
}
