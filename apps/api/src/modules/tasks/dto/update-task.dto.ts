import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
export class UpdateTaskDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(['pending','in_progress','completed','cancelled']) status?: string;
  @IsOptional() @IsEnum(['low','medium','high','urgent']) priority?: string;
  @IsOptional() @IsString() assignedToId?: string;
  @IsOptional() @IsDateString() dueDate?: string;
}
