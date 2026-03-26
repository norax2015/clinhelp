import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class CreateDemoRequestDto {
  @IsString() @MinLength(2) name!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(2) organization!: string;
  @IsOptional() @IsString() specialty?: string;
  @IsOptional() @IsString() providers?: string;
  @IsOptional() @IsString() message?: string;
}
