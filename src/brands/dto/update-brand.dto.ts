import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class UpdateBrandDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  brandName?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  siteUrl?: string;
}

