import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateBrandFeedDto {
  @IsNotEmpty()
  @IsUUID()
  brandId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image?: string;
}
