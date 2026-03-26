import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTemplateDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() customInstructions?: string;
  @IsOptional() @IsBoolean() isDefault?: boolean;
  @IsOptional() @IsBoolean() isShared?: boolean;
}
