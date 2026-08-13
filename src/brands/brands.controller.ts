import { Controller, Post, Body, Query, HttpCode } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Brand } from '../entities/brand.entity';

@Controller('api/brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post('list')
  @HttpCode(200)
  async getAllBrands(
    @Query('status') status?: string,
    @Query('limit') limit: number = 10,
    @Query('offset') offset: number = 0,
  ): Promise<{ data: Brand[]; total: number; message: string }> {
    const statusNum = status ? parseInt(status) : undefined;
    // Bound limit/offset to prevent resource exhaustion (M-02)
    const boundedLimit = Math.min(Math.max(parseInt(String(limit)) || 10, 1), 500);
    const boundedOffset = Math.max(parseInt(String(offset)) || 0, 0);
    const result = await this.brandsService.getAllBrands(
      statusNum,
      boundedLimit,
      boundedOffset,
    );
    return {
      ...result,
      message: 'Brands retrieved successfully',
    };
  }

  @Post('create')
  @HttpCode(201)
  async addBrand(
    @Body() createBrandDto: CreateBrandDto,
  ): Promise<{ data: Brand; message: string }> {
    const data = await this.brandsService.addBrand(createBrandDto);
    return {
      data,
      message: 'Brand created successfully',
    };
  }

  @Post('update')
  @HttpCode(200)
  async updateBrand(
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<{ data: Brand; message: string }> {
    const data = await this.brandsService.updateBrand(updateBrandDto);
    return {
      data,
      message: 'Brand updated successfully',
    };
  }

  @Post('update-status')
  @HttpCode(200)
  async updateStatus(
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<{ data: Brand; message: string }> {
    const data = await this.brandsService.updateStatus(updateStatusDto);
    return {
      data,
      message: 'Brand status updated successfully',
    };
  }
}

