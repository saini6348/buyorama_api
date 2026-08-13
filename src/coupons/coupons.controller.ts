import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateAllCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { DeleteCouponDto } from './dto/delete-coupon.dto';
import { ListCouponDto } from './dto/list-coupon.dto';
import { AllCoupon } from '../entities/all-coupon.entity';

@Controller('api/coupons')
@UsePipes(new ValidationPipe())
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post('list')
  @HttpCode(200)
  async getAllCoupons(
    @Body() listDto: ListCouponDto,
  ): Promise<{ data: AllCoupon[]; total: number; message: string }> {
    const result = await this.couponsService.getAllCoupons(listDto);
    return {
      ...result,
      message: 'Coupons retrieved successfully',
    };
  }

  @Post('create')
  @HttpCode(201)
  async addCoupon(
    @Body() dto: CreateAllCouponDto,
  ): Promise<{ data: AllCoupon; message: string }> {
    const data = await this.couponsService.addCoupon(dto);
    return {
      data,
      message: 'Coupon created successfully',
    };
  }

  @Post('update')
  @HttpCode(200)
  async updateCoupon(
    @Body() dto: UpdateCouponDto,
  ): Promise<{ data: AllCoupon; message: string }> {
    const data = await this.couponsService.updateCoupon(dto);
    return {
      data,
      message: 'Coupon updated successfully',
    };
  }

  @Post('delete')
  @HttpCode(200)
  async deleteCoupon(
    @Body() dto: DeleteCouponDto,
  ): Promise<{ message: string }> {
    return await this.couponsService.deleteCoupon(dto.id);
  }
}
