import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class ListCouponDto {
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
