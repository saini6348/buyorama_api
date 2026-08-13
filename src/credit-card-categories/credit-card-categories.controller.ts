import { Controller, Post, Body, Query, HttpCode } from '@nestjs/common';
import { CreditCardCategoriesService } from './credit-card-categories.service';
import { CreateCreditCardCategoryDto } from './dto/create-credit-card-category.dto';
import { UpdateCreditCardCategoryDto } from './dto/update-credit-card-category.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CreditCardCategory } from '../entities/credit-card-category.entity';

@Controller('api/card-categories')
export class CreditCardCategoriesController {
  constructor(
    private readonly categoriesService: CreditCardCategoriesService,
  ) {}

  @Post('list')
  @HttpCode(200)
  async getAllCategories(
    @Query('status') status?: string,
    @Query('limit') limit: number = 100,
    @Query('offset') offset: number = 0,
  ): Promise<{ data: CreditCardCategory[]; total: number; message: string }> {
    const statusNum = status ? parseInt(status) : undefined;
    // Bound limit/offset to prevent resource exhaustion (M-02)
    const boundedLimit = Math.min(Math.max(parseInt(String(limit)) || 100, 1), 500);
    const boundedOffset = Math.max(parseInt(String(offset)) || 0, 0);
    const result = await this.categoriesService.getAllCategories(
      statusNum,
      boundedLimit,
      boundedOffset,
    );
    return {
      ...result,
      message: 'Categories retrieved successfully',
    };
  }

  @Post('create')
  @HttpCode(201)
  async addCategory(
    @Body() createDto: CreateCreditCardCategoryDto,
  ): Promise<{ data: CreditCardCategory; message: string }> {
    const data = await this.categoriesService.addCategory(createDto);
    return {
      data,
      message: 'Category created successfully',
    };
  }

  @Post('update')
  @HttpCode(200)
  async updateCategory(
    @Body() updateDto: UpdateCreditCardCategoryDto,
  ): Promise<{ data: CreditCardCategory; message: string }> {
    const data = await this.categoriesService.updateCategory(updateDto);
    return {
      data,
      message: 'Category updated successfully',
    };
  }

  @Post('update-status')
  @HttpCode(200)
  async updateStatus(
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<{ data: CreditCardCategory; message: string }> {
    const data = await this.categoriesService.updateStatus(updateStatusDto);
    return {
      data,
      message: 'Category status updated successfully',
    };
  }
}

