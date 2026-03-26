import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { CreatePatientDto } from './create-patient.dto';
export class UpdatePatientDto extends PartialType(CreatePatientDto) {
  @IsOptional() @IsEnum(['active','inactive','discharged','waitlist']) status?: string;
}
