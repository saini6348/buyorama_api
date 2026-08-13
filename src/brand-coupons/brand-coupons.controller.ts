import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BrandCouponsService } from './brand-coupons.service';
import { CreateBrandCouponDto } from './dto/create-brand-coupon.dto';
import { UpdateBrandCouponDto } from './dto/update-brand-coupon.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ListBrandCouponDto } from './dto/list-brand-coupon.dto';
import { DeleteBrandCouponDto } from './dto/delete-brand-coupon.dto';
import { BrandCoupon } from '../entities/brand-coupon.entity';

@Controller('api/brand-coupons')
@UsePipes(new ValidationPipe())
export class BrandCouponsController {
  constructor(private readonly brandCouponsService: BrandCouponsService) {}

  @Post('list')
  @HttpCode(200)
  async getAllBrandCoupons(
    @Body() listDto: ListBrandCouponDto,
  ): Promise<{ data: BrandCoupon[]; total: number; message: string }> {
    const result = await this.brandCouponsService.getAllBrandCoupons(listDto);
    return {
      ...result,
      message: 'Brand coupons retrieved successfully',
    };
  }

  @Post('create')
  @HttpCode(201)
  async addBrandCoupon(
    @Body() dto: CreateBrandCouponDto,
  ): Promise<{ data: BrandCoupon; message: string }> {
    const data = await this.brandCouponsService.addBrandCoupon(dto);
    return {
      data,
      message: 'Brand coupon created successfully',
    };
  }

  @Post('update')
  @HttpCode(200)
  async updateBrandCoupon(
    @Body() dto: UpdateBrandCouponDto,
  ): Promise<{ data: BrandCoupon; message: string }> {
    const data = await this.brandCouponsService.updateBrandCoupon(dto);
    return {
      data,
      message: 'Brand coupon updated successfully',
    };
  }

  @Post('update-status')
  @HttpCode(200)
  async updateStatus(
    @Body() dto: UpdateStatusDto,
  ): Promise<{ data: BrandCoupon; message: string }> {
    const data = await this.brandCouponsService.updateStatus(dto);
    return {
      data,
      message: 'Brand coupon status updated successfully',
    };
  }

  @Post('delete')
  @HttpCode(200)
  async deleteBrandCoupon(
    @Body() dto: DeleteBrandCouponDto,
  ): Promise<{ message: string }> {
    return await this.brandCouponsService.deleteBrandCoupon(dto.id);
  }
}
