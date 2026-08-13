import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllCoupon } from '../entities/all-coupon.entity';
import { CreateAllCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ListCouponDto } from './dto/list-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(AllCoupon)
    private couponsRepository: Repository<AllCoupon>,
  ) {}

  async getAllCoupons(
    listDto: ListCouponDto,
  ): Promise<{ data: AllCoupon[]; total: number }> {
    const { limit = 200, offset = 0 } = listDto;

    const [data, total] = await this.couponsRepository
      .createQueryBuilder('coupon')
      .orderBy('coupon.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async addCoupon(dto: CreateAllCouponDto): Promise<AllCoupon> {
    const coupon = this.couponsRepository.create({
      ...dto,
      image: dto.image || null,
    });

    return await this.couponsRepository.save(coupon);
  }

  async updateCoupon(dto: UpdateCouponDto): Promise<AllCoupon> {
    const { id, ...rest } = dto;

    const coupon = await this.couponsRepository.findOne({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with id ${id} not found`);
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

    return await this.couponsRepository.save(coupon);
  }

  async deleteCoupon(id: string): Promise<{ message: string }> {
    const coupon = await this.couponsRepository.findOne({
      where: { id },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon with id ${id} not found`);
    }

    await this.couponsRepository.remove(coupon);

    return { message: 'Coupon deleted successfully' };
  }
}
