import { IsString, IsNotEmpty } from 'class-validator';

export class CreateBankDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
