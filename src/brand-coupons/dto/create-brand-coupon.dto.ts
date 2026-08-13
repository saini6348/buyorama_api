import { IsString, IsOptional, IsNotEmpty, IsUUID, IsUrl } from 'class-validator';

export class CreateBrandCouponDto {
  @IsNotEmpty()
  @IsUUID()
  brandId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsOptional()
  @IsString()
  image?: string;
}
