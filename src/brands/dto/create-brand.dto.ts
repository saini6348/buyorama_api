import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  brandName: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  siteUrl?: string;
}

