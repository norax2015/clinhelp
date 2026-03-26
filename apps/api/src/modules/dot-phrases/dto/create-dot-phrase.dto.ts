import { IsString, IsOptional } from 'class-validator';

export class CreateDotPhraseDto {
  @IsString() trigger!: string;
  @IsString() expansion!: string;
  @IsOptional() @IsString() category?: string;
}
