import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandFeedsService } from './brand-feeds.service';
import { BrandFeedsController } from './brand-feeds.controller';
import { BrandFeed } from '../entities/brand-feed.entity';
import { Brand } from '../entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BrandFeed, Brand])],
  controllers: [BrandFeedsController],
  providers: [BrandFeedsService],
  exports: [BrandFeedsService],
})
export class BrandFeedsModule {}
