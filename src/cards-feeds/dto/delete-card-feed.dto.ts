import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteCardsFeedDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
