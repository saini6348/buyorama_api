import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetCardsFeedDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
