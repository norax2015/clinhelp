import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
export class UpdateNoteDto {
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsObject() structuredContent?: Record<string, string>;
  @IsOptional() @IsEnum(['draft','pending_review','finalized','signed']) status?: string;
}
