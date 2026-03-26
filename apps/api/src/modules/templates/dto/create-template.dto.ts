import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTemplateDto {
  @IsString() name!: string;
  @IsString() noteType!: string;
  @IsOptional() @IsString() specialty?: string;
  @IsOptional() @IsString() visitType?: string;
  @IsOptional() @IsString() customInstructions?: string;
  @IsOptional() @IsBoolean() isDefault?: boolean;
  @IsOptional() @IsBoolean() isShared?: boolean;
}
