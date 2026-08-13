import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteCouponDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
