import { IsOptional, IsInt, IsArray, IsString, Min, Max } from 'class-validator';

/**
 * Public card-feeds list request: `POST /api/public/cards-feed/list`.
 * Filters by entity names (tags / categories / banks) so the public site can
 * pass the names shown in its filter chips directly — no IDs needed.
 */
export class PublicListCardsFeedDto {
  /** Zero-based page number. */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100000)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number;

  /** Tag names to filter by (active cards matching ANY selected tag). */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  /** Credit-card category names to filter by. */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  /** Bank names to filter by. */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  banks?: string[];
}
