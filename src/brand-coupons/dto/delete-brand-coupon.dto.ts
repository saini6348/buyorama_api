import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteBrandCouponDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
