import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandFeed } from '../entities/brand-feed.entity';
import { Brand } from '../entities/brand.entity';
import { CreateBrandFeedDto } from './dto/create-brand-feed.dto';
import { UpdateBrandFeedDto } from './dto/update-brand-feed.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ListBrandFeedDto } from './dto/list-brand-feed.dto';
import { SanitizeHtmlService } from '../common/sanitize-html.service';

@Injectable()
export class BrandFeedsService {
  constructor(
    @InjectRepository(BrandFeed)
    private brandFeedsRepository: Repository<BrandFeed>,
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
    private sanitizeHtml: SanitizeHtmlService,
  ) {}

  async getAllBrandFeeds(
    listDto: ListBrandFeedDto,
  ): Promise<{ data: BrandFeed[]; total: number }> {
    const { brandId, status, limit = 10, offset = 0 } = listDto;

    const query = this.brandFeedsRepository
      .createQueryBuilder('feed')
      .where('feed.brandId = :brandId', { brandId });

    if (status !== undefined) {
      query.andWhere('feed.status = :status', { status });
    }

    const [data, total] = await query
      .orderBy('feed.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async addBrandFeed(dto: CreateBrandFeedDto): Promise<BrandFeed> {
    const brand = await this.brandsRepository.findOne({
      where: { id: dto.brandId },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with id ${dto.brandId} not found`);
    }

    const description = dto.description
      ? this.sanitizeHtml.sanitize(dto.description)
      : null;

    const feed = this.brandFeedsRepository.create({
      ...dto,
      description,
      subtitle: dto.subtitle || null,
      image: dto.image || null,
      status: 1,
    });

    return await this.brandFeedsRepository.save(feed);
  }

  async updateBrandFeed(dto: UpdateBrandFeedDto): Promise<BrandFeed> {
    const { id, ...rest } = dto;

    const feed = await this.brandFeedsRepository.findOne({
      where: { id },
    });

    if (!feed) {
      throw new NotFoundException(`Brand feed with id ${id} not found`);
    }

    // Explicit field-by-field assignment (M-02: prevent mass assignment)
    if (rest.title !== undefined) {
      feed.title = rest.title;
    }
    if (rest.subtitle !== undefined) {
      feed.subtitle = rest.subtitle;
    }
    if (rest.description !== undefined) {
      feed.description = this.sanitizeHtml.sanitize(rest.description);
    }
    if (rest.image !== undefined) {
      feed.image = rest.image;
    }

    return await this.brandFeedsRepository.save(feed);
  }

  async updateStatus(dto: UpdateStatusDto): Promise<BrandFeed> {
    const feed = await this.brandFeedsRepository.findOne({
      where: { id: dto.id },
    });

    if (!feed) {
      throw new NotFoundException(`Brand feed with id ${dto.id} not found`);
    }

    feed.status = dto.status;

    return await this.brandFeedsRepository.save(feed);
  }

  async deleteBrandFeed(id: string): Promise<{ message: string }> {
    const feed = await this.brandFeedsRepository.findOne({
      where: { id },
    });

    if (!feed) {
      throw new NotFoundException(`Brand feed with id ${id} not found`);
    }

    await this.brandFeedsRepository.remove(feed);

    return { message: 'Brand feed deleted successfully' };
  }
}
