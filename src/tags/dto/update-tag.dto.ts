import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class UpdateTagDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;
}
