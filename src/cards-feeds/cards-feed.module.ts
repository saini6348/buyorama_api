import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsFeedsService } from './cards-feed.service';
import { CardsFeedsController } from './cards-feed.controller';
import { CardsFeed } from './cards-feed.entity';
import { Bank } from '../entities/bank.entity';
import { Tag } from '../entities/tag.entity';
import { CreditCardCategory } from '../entities/credit-card-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CardsFeed, Bank, Tag, CreditCardCategory])],
  controllers: [CardsFeedsController],
  providers: [CardsFeedsService],
  exports: [CardsFeedsService],
})
export class CardsFeedsModule {}
