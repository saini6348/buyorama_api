import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandCouponsService } from './brand-coupons.service';
import { BrandCouponsController } from './brand-coupons.controller';
import { BrandCoupon } from '../entities/brand-coupon.entity';
import { Brand } from '../entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BrandCoupon, Brand])],
  controllers: [BrandCouponsController],
  providers: [BrandCouponsService],
  exports: [BrandCouponsService],
})
export class BrandCouponsModule {}
