import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateNotePreferenceDto {
  @IsOptional() @IsString() defaultNoteType?: string;
  @IsOptional() @IsString() defaultSpecialty?: string;
  @IsOptional() @IsString() signatureBlock?: string;
  @IsOptional() @IsString() customInstructions?: string;
  @IsOptional() @IsString() tonePreference?: string;
  @IsOptional() @IsBoolean() autoSave?: boolean;
}
