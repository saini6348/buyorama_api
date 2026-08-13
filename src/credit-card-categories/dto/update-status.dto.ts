import { IsUUID, IsNotEmpty, IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsIn([0, 1])
  status: number;
}
