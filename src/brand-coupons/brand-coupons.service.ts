import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandCoupon } from '../entities/brand-coupon.entity';
import { Brand } from '../entities/brand.entity';
import { CreateBrandCouponDto } from './dto/create-brand-coupon.dto';
import { UpdateBrandCouponDto } from './dto/update-brand-coupon.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ListBrandCouponDto } from './dto/list-brand-coupon.dto';

@Injectable()
export class BrandCouponsService {
  constructor(
    @InjectRepository(BrandCoupon)
    private brandCouponsRepository: Repository<BrandCoupon>,
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
  ) {}

  async getAllBrandCoupons(
    listDto: ListBrandCouponDto,
  ): Promise<{ data: BrandCoupon[]; total: number }> {
    const { brandId, status, limit = 10, offset = 0 } = listDto;

    const query = this.brandCouponsRepository
      .createQueryBuilder('coupon')
      .where('coupon.brandId = :brandId', { brandId });

    if (status !== undefined) {
      query.andWhere('coupon.status = :status', { status });
    }

    const [data, total] = await query
      .orderBy('coupon.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async addBrandCoupon(dto: CreateBrandCouponDto): Promise<BrandCoupon> {
    const brand = await this.brandsRepository.findOne({
      where: { id: dto.brandId },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with id ${dto.brandId} not found`);
    }

    const coupon = this.brandCouponsRepository.create({
      ...dto,
      image: dto.image || null,
      status: 1,
    });

    return await this.brandCouponsRepository.save(coupon);
  }

  async updateBrandCoupon(dto: UpdateBrandCouponDto): Promise<BrandCoupon> {
    const { id, ...rest } = dto;

    const coupon = await this.brandCouponsRepository.findOne({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException(`Brand coupon with id ${id} not found`);
    }

    // Explicit field-by-field assignment (M-02: prevent mass assignment)
    if (rest.title !== undefined) {
      coupon.title = rest.title;
    }
    if (rest.description !== undefined) {
      coupon.description = rest.description;
    }
    if (rest.link !== undefined) {
      coupon.link = rest.link;
    }
    if (rest.image !== undefined) {
      coupon.image = rest.image;
    }

    return await this.brandCouponsRepository.save(coupon);
  }

  async updateStatus(dto: UpdateStatusDto): Promise<BrandCoupon> {
    const coupon = await this.brandCouponsRepository.findOne({
      where: { id: dto.id },
    });

    if (!coupon) {
      throw new NotFoundException(`Brand coupon with id ${dto.id} not found`);
    }

    coupon.status = dto.status;

    return await this.brandCouponsRepository.save(coupon);
  }

  async deleteBrandCoupon(id: string): Promise<{ message: string }> {
    const coupon = await this.brandCouponsRepository.findOne({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException(`Brand coupon with id ${id} not found`);
    }

    await this.brandCouponsRepository.remove(coupon);

    return { message: 'Brand coupon deleted successfully' };
  }
}
