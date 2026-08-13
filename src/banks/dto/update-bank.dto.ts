import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class UpdateBankDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;
}
