import { IsNotEmpty, IsOptional, IsUUID, IsIn, IsInt, Min, Max } from 'class-validator';

export class ListBrandCouponDto {
  @IsNotEmpty()
  @IsUUID()
  brandId: string;

  @IsOptional()
  @IsIn([0, 1])
  status?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100000)
  offset?: number;
}
