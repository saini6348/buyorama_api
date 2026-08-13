import { IsString, IsOptional, IsNotEmpty, IsUrl } from 'class-validator';

export class CreateAllCouponDto {
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
