import { IsString, IsOptional } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  siteName?: string;

  @IsOptional()
  @IsString()
  siteLogo?: string;

  @IsOptional()
  @IsString()
  tagline?: string;
}
