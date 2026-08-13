import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { AllCoupon } from '../entities/all-coupon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AllCoupon])],
  controllers: [CouponsController],
  providers: [CouponsService],
  exports: [CouponsService],
})
export class CouponsModule {}
