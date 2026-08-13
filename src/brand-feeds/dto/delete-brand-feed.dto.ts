import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteBrandFeedDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
