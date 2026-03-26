import { IsString, IsEnum, IsOptional, IsBoolean, IsDateString } from 'class-validator';
export class CreateTaskDto {
  @IsString() title!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() patientId?: string;
  @IsOptional() @IsString() encounterId?: string;
  @IsOptional() @IsString() assignedToId?: string;
  @IsOptional() @IsEnum(['low','medium','high','urgent']) priority?: string;
  @IsOptional() @IsDateString() dueDate?: string;
  @IsOptional() @IsBoolean() aiGenerated?: boolean;
}
