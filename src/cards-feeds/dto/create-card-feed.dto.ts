import { IsString, IsOptional, IsNotEmpty, IsArray, IsUUID, ArrayUnique } from 'class-validator';

export class CreateCardsFeedDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsUUID()
  bankId?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  creditCardCategoryIds?: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  tagIds?: string[];
}
