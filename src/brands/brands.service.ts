import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
  ) {}

  async getAllBrands(
    status?: number,
    limit = 10,
    offset = 0,
  ): Promise<{ data: Brand[]; total: number }> {
    const query = this.brandsRepository.createQueryBuilder('brand');

    if (status !== undefined) {
      query.where('brand.status = :status', { status });
    }

    const [data, total] = await query
      .orderBy('brand.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async addBrand(createBrandDto: CreateBrandDto): Promise<Brand> {
    const { brandName, slug, logo, siteUrl } = createBrandDto;

    const existingBrand = await this.brandsRepository.findOne({
      where: [{ brandName }, { slug }],
    });

    if (existingBrand) {
      throw new BadRequestException(
        'Brand name or slug already exists',
      );
    }

    const brand = this.brandsRepository.create({
      brandName,
      slug,
      logo: logo || null,
      siteUrl: siteUrl || null,
      status: 1,
    });

    return await this.brandsRepository.save(brand);
  }

  async updateBrand(updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const { id, brandName, slug, logo, siteUrl } = updateBrandDto;

    const brand = await this.brandsRepository.findOne({ where: { id } });

    if (!brand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }

    if (brandName && brandName !== brand.brandName) {
      const existingBrand = await this.brandsRepository.findOne({
        where: { brandName },
      });
      if (existingBrand) {
        throw new BadRequestException('Brand name already exists');
      }
      brand.brandName = brandName;
    }

    if (slug && slug !== brand.slug) {
      const existingSlug = await this.brandsRepository.findOne({
        where: { slug },
      });
      if (existingSlug) {
        throw new BadRequestException('Slug already exists');
      }
      brand.slug = slug;
    }

    if (logo !== undefined) {
      brand.logo = logo || null;
    }

    if (siteUrl !== undefined) {
      brand.siteUrl = siteUrl || null;
    }

    return await this.brandsRepository.save(brand);
  }

  async updateStatus(updateStatusDto: UpdateStatusDto): Promise<Brand> {
    const { id, status } = updateStatusDto;

    if (![0, 1].includes(status)) {
      throw new BadRequestException('Status must be 0 (inactive) or 1 (active)');
    }
    const brand = await this.brandsRepository.findOne({ where: { id } });

    if (!brand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }

    brand.status = status;
    return await this.brandsRepository.save(brand);
  }

  async deleteBrand(id: string): Promise<{ message: string }> {
    const brand = await this.brandsRepository.findOne({ where: { id } });

    if (!brand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }

    await this.brandsRepository.remove(brand);

    return { message: 'Brand deleted successfully' };
  }
}

