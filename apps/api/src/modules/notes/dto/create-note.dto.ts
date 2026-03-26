import { IsString, IsEnum, IsOptional, IsBoolean, IsObject } from 'class-validator';
export class CreateNoteDto {
  @IsString() encounterId!: string;
  @IsEnum(['SOAP','psych_eval','therapy','progress','mse','follow_up']) type!: string;
  @IsString() content!: string;
  @IsOptional() @IsObject() structuredContent?: Record<string, string>;
  @IsOptional() @IsBoolean() aiGenerated?: boolean;
}
