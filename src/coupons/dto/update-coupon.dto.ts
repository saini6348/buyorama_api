import { IsString, IsOptional, IsUUID, IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateCouponDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  link?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
