import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { PublicApisService } from './public-apis.service';
import { Public } from '../auth/public.decorator';
import { ListQueryDto } from './dto/list-query.dto';

/**
 * Public read-only APIs for the unauthenticated frontend site.
 * These endpoints are excluded from the JWT guard via @Public().
 * Base path: /api/public
 */
@Controller('api/public')
export class PublicApisController {
  constructor(private readonly publicApisService: PublicApisService) {}

  // ---------- Stores (1-3) ----------

  /** 1. List all active stores */
  @Public()
  @Get('stores')
  async getStores(@Query() query: ListQueryDto) {
    const { data, total } = await this.publicApisService.getStores(
      query.limit,
      query.offset,
    );
    return { data, total, message: 'Stores retrieved successfully' };
  }

  /** 2. Single store detail by slug */
  @Public()
  @Get('stores/:slug')
  async getStoreBySlug(@Param('slug') slug: string) {
    const data = await this.publicApisService.getStoreBySlug(slug);
    return { data, message: 'Store retrieved successfully' };
  }

  /** 3. Store stats (deals count, coupon count) */
  @Public()
  @Get('stores/:slug/stats')
  async getStoreStats(@Param('slug') slug: string) {
    const data = await this.publicApisService.getStoreStats(slug);
    return { data, message: 'Store stats retrieved successfully' };
  }

  // ---------- Deals (4-6) ----------

  /** 4. List all active deals/brand-feeds */
  @Public()
  @Get('deals')
  async getDeals(@Query() query: ListQueryDto) {
    const { data, total } = await this.publicApisService.getDeals(
      query.limit,
      query.offset,
    );
    return { data, total, message: 'Deals retrieved successfully' };
  }

  /** 5. Deals for a store by slug */
  @Public()
  @Get('stores/:slug/deals')
  async getStoreDeals(@Param('slug') slug: string, @Query() query: ListQueryDto) {
    const { data, total } = await this.publicApisService.getStoreDeals(
      slug,
      query.limit,
      query.offset,
    );
    return { data, total, message: 'Deals retrieved successfully' };
  }

  /** 5b. Brand coupons for a store by slug (brand detail page) */
  @Public()
  @Get('stores/:slug/coupons')
  async getStoreBrandCoupons(@Param('slug') slug: string, @Query() query: ListQueryDto) {
    const { data, total } = await this.publicApisService.getStoreBrandCoupons(
      slug,
      query.limit,
      query.offset,
    );
    return { data, total, message: 'Brand coupons retrieved successfully' };
  }

  /** 6. Single deal by id */
  @Public()
  @Get('deals/:id')
  async getDealById(@Param('id') id: string) {
    const data = await this.publicApisService.getDealById(id);
    return { data, message: 'Deal retrieved successfully' };
  }

  // ---------- Coupons (7-9) ----------

  /** 7. List all coupons */
  @Public()
  @Get('coupons')
  async getCoupons(@Query() query: ListQueryDto) {
    const { data, total } = await this.publicApisService.getCoupons(
      query.limit,
      query.offset,
    );
    return { data, total, message: 'Coupons retrieved successfully' };
  }

  /** 8. Latest coupons (homepage strip) */
  @Public()
  @Get('coupons/latest')
  async getLatestCoupons(@Query('limit') limit?: number) {
    const data = await this.publicApisService.getLatestCoupons(limit);
    return { data, message: 'Latest coupons retrieved successfully' };
  }

  /** 9. Single coupon by id */
  @Public()
  @Get('coupons/:id')
  async getCouponById(@Param('id') id: string) {
    const data = await this.publicApisService.getCouponById(id);
    return { data, message: 'Coupon retrieved successfully' };
  }
}
