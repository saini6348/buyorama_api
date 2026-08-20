import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PublicApisController } from './public-apis.controller';
import { PublicApisService } from './public-apis.service';
import { Brand } from '../entities/brand.entity';
import { BrandFeed } from '../entities/brand-feed.entity';
import { AllCoupon } from '../entities/all-coupon.entity';
import { BrandCoupon } from '../entities/brand-coupon.entity';
import { CardsFeed } from '../cards-feeds/cards-feed.entity';
import { Bank } from '../entities/bank.entity';
import { Tag } from '../entities/tag.entity';
import { CreditCardCategory } from '../entities/credit-card-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Brand,
      BrandFeed,
      AllCoupon,
      BrandCoupon,
      CardsFeed,
      Bank,
      Tag,
      CreditCardCategory,
    ]),
  ],
  controllers: [PublicApisController],
  providers: [PublicApisService],
})
export class PublicApisModule {}
