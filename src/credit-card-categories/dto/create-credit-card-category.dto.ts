import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCreditCardCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
