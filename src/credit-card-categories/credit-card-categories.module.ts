import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditCardCategoriesService } from './credit-card-categories.service';
import { CreditCardCategoriesController } from './credit-card-categories.controller';
import { CreditCardCategory } from '../entities/credit-card-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreditCardCategory])],
  controllers: [CreditCardCategoriesController],
  providers: [CreditCardCategoriesService],
  exports: [CreditCardCategoriesService],
})
export class CreditCardCategoriesModule {}
