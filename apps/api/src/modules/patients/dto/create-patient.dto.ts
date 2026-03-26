import { IsString, IsEmail, IsOptional, IsDateString, IsEnum } from 'class-validator';
export class CreatePatientDto {
  @IsString() firstName!: string;
  @IsString() lastName!: string;
  @IsDateString() dateOfBirth!: string;
  @IsOptional() @IsEnum(['male','female','other','unknown']) sex?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() zip?: string;
  @IsOptional() @IsString() insurancePrimary?: string;
  @IsOptional() @IsString() insuranceId?: string;
  @IsOptional() @IsString() primaryProviderId?: string;
  @IsOptional() @IsString() emergencyContactName?: string;
  @IsOptional() @IsString() emergencyContactPhone?: string;
}
