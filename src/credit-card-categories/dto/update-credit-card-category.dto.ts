import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';

export class UpdateCreditCardCategoryDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  name?: string;
}
