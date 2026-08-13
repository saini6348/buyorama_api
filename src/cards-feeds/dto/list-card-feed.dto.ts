import { IsOptional, IsIn, IsInt, IsUUID, IsArray, ArrayUnique, Min, Max } from 'class-validator';

export class ListCardsFeedDto {
  @IsOptional()
  @IsIn([0, 1])
  status?: number;

  @IsOptional()
  @IsUUID()
  bankId?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  tagIds?: string[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100000)
  offset?: number;
}
