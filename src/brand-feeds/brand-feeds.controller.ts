import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BrandFeedsService } from './brand-feeds.service';
import { CreateBrandFeedDto } from './dto/create-brand-feed.dto';
import { UpdateBrandFeedDto } from './dto/update-brand-feed.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ListBrandFeedDto } from './dto/list-brand-feed.dto';
import { DeleteBrandFeedDto } from './dto/delete-brand-feed.dto';
import { BrandFeed } from '../entities/brand-feed.entity';

@Controller('api/brand-feeds')
@UsePipes(new ValidationPipe())
export class BrandFeedsController {
  constructor(private readonly brandFeedsService: BrandFeedsService) {}

  @Post('list')
  @HttpCode(200)
  async getAllBrandFeeds(
    @Body() listDto: ListBrandFeedDto,
  ): Promise<{ data: BrandFeed[]; total: number; message: string }> {
    const result = await this.brandFeedsService.getAllBrandFeeds(listDto);
    return {
      ...result,
      message: 'Brand feeds retrieved successfully',
    };
  }

  @Post('create')
  @HttpCode(201)
  async addBrandFeed(
    @Body() dto: CreateBrandFeedDto,
  ): Promise<{ data: BrandFeed; message: string }> {
    const data = await this.brandFeedsService.addBrandFeed(dto);
    return {
      data,
      message: 'Brand feed created successfully',
    };
  }

  @Post('update')
  @HttpCode(200)
  async updateBrandFeed(
    @Body() dto: UpdateBrandFeedDto,
  ): Promise<{ data: BrandFeed; message: string }> {
    const data = await this.brandFeedsService.updateBrandFeed(dto);
    return {
      data,
      message: 'Brand feed updated successfully',
    };
  }

  @Post('update-status')
  @HttpCode(200)
  async updateStatus(
    @Body() dto: UpdateStatusDto,
  ): Promise<{ data: BrandFeed; message: string }> {
    const data = await this.brandFeedsService.updateStatus(dto);
    return {
      data,
      message: 'Brand feed status updated successfully',
    };
  }

  @Post('delete')
  @HttpCode(200)
  async deleteBrandFeed(
    @Body() dto: DeleteBrandFeedDto,
  ): Promise<{ message: string }> {
    return await this.brandFeedsService.deleteBrandFeed(dto.id);
  }
}
