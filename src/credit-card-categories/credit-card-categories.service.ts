import {
  Injectable,
  BadRequestException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditCardCategory } from '../entities/credit-card-category.entity';
import { CreateCreditCardCategoryDto } from './dto/create-credit-card-category.dto';
import { UpdateCreditCardCategoryDto } from './dto/update-credit-card-category.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

const DEFAULT_CATEGORIES = [
  'Cashback',
  'Rewards',
  'Shopping',
  'Travel',
  'Airport Lounge',
  'Fuel',
  'Lifetime Free',
  'RuPay (UPI)',
  'Low Forex',
  'Premium',
];

@Injectable()
export class CreditCardCategoriesService implements OnModuleInit {
  constructor(
    @InjectRepository(CreditCardCategory)
    private categoriesRepository: Repository<CreditCardCategory>,
  ) {}

  async onModuleInit() {
    const count = await this.categoriesRepository.count();
    if (count === 0) {
      const defaults = DEFAULT_CATEGORIES.map((name) =>
        this.categoriesRepository.create({ name, status: 1 }),
      );
      await this.categoriesRepository.save(defaults);
    }
  }

  async getAllCategories(
    status?: number,
    limit = 100,
    offset = 0,
  ): Promise<{ data: CreditCardCategory[]; total: number }> {
    const query = this.categoriesRepository.createQueryBuilder('category');

    if (status !== undefined) {
      query.where('category.status = :status', { status });
    }

    const [data, total] = await query
      .orderBy('category.createdAt', 'ASC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async addCategory(
    createDto: CreateCreditCardCategoryDto,
  ): Promise<CreditCardCategory> {
    const { name } = createDto;

    const existing = await this.categoriesRepository.findOne({
      where: { name },
    });

    if (existing) {
      throw new BadRequestException('Category name already exists');
    }

    const category = this.categoriesRepository.create({ name, status: 1 });

    return await this.categoriesRepository.save(category);
  }

  async updateCategory(
    updateDto: UpdateCreditCardCategoryDto,
  ): Promise<CreditCardCategory> {
    const { id, name } = updateDto;

    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    if (name && name !== category.name) {
      const existing = await this.categoriesRepository.findOne({
        where: { name },
      });
      if (existing) {
        throw new BadRequestException('Category name already exists');
      }
      category.name = name;
    }

    return await this.categoriesRepository.save(category);
  }

  async updateStatus(
    updateStatusDto: UpdateStatusDto,
  ): Promise<CreditCardCategory> {
    const { id, status } = updateStatusDto;

    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    category.status = status;

    return await this.categoriesRepository.save(category);
  }
}
