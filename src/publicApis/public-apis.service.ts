import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { BrandFeed } from '../entities/brand-feed.entity';
import { AllCoupon } from '../entities/all-coupon.entity';
import { BrandCoupon } from '../entities/brand-coupon.entity';

/** Public-facing shape for a store,based on the Brand entity (Option A). */
export interface PublicStore {
  slug: string;
  name: string;
  logo: string | null;
  // Fields the frontend Store type expects but aren't stored on Brand.
  // Padded with empty/default values.
  categoryLine: string;
  logoBg: string;
  logoFg: string;
  monogram: string;
  officialUrl: string;
  fallbackOfferText?: string;
}

@Injectable()
export class PublicApisService {
  constructor(
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
    @InjectRepository(BrandFeed)
    private brandFeedsRepository: Repository<BrandFeed>,
    @InjectRepository(AllCoupon)
    private couponsRepository: Repository<AllCoupon>,
    @InjectRepository(BrandCoupon)
    private brandCouponsRepository: Repository<BrandCoupon>,
  ) {}

  private mapBrandToStore(brand: Brand): PublicStore {
    return {
      slug: brand.slug,
      name: brand.brandName,
      logo: brand.logo,
      categoryLine: '',
      logoBg: '',
      logoFg: '',
      monogram: brand.brandName ? brand.brandName.charAt(0).toUpperCase() : '',
      officialUrl: this.resolveLink(brand.siteUrl) ?? '',
    };
  }

  /** Ensure a link/url has an http(s) scheme; add https:// if none present. */
  private resolveLink(url?: string): string | null {
    if (!url) return null;
    const trimmed = url.trim();
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  // ---------- Stores (1-3) ----------

  async getStores(limit?: number, offset?: number): Promise<{ data: PublicStore[]; total: number }> {
    const [brands, total] = await this.brandsRepository
      .createQueryBuilder('brand')
      .where('brand.status = :status', { status: 1 })
      .orderBy('brand.createdAt', 'ASC')
      .skip(offset || 0)
      .take(limit || 100)
      .getManyAndCount();

    return { data: brands.map((b) => this.mapBrandToStore(b)), total };
  }

  async getStoreBySlug(slug: string): Promise<PublicStore> {
    const brand = await this.brandsRepository.findOne({ where: { slug } });
    if (!brand) {
      throw new NotFoundException(`Store with slug "${slug}" not found`);
    }
    return this.mapBrandToStore(brand);
  }

  async getStoreStats(slug: string): Promise<{
    brandId: string;
    totalDeals: number;
    totalCoupons: number;
    hasLiveFeed: boolean;
  }> {
    const brand = await this.brandsRepository.findOne({ where: { slug } });
    if (!brand) {
      throw new NotFoundException(`Store with slug "${slug}" not found`);
    }

    const totalDeals = await this.brandFeedsRepository.count({
      where: { brandId: brand.id, status: 1 },
    });
    const totalCoupons = await this.brandCouponsRepository.count({
      where: { brandId: brand.id, status: 1 },
    });

    return {
      brandId: brand.id,
      totalDeals,
      totalCoupons,
      hasLiveFeed: totalDeals > 0,
    };
  }

  // ---------- Deals / Brand feeds (4-6) ----------

  async getDeals(limit?: number, offset?: number) {
    const [feeds, total] = await this.brandFeedsRepository
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.brand', 'brand')
      .where('feed.status = :status', { status: 1 })
      .orderBy('feed.createdAt', 'DESC')
      .skip(offset || 0)
      .take(limit || 100)
      .getManyAndCount();

    return {
      data: feeds.map((f) => this.mapDeal(f)),
      total,
    };
  }

  async getStoreDeals(slug: string, limit?: number, offset?: number) {
    const brand = await this.brandsRepository.findOne({ where: { slug } });
    if (!brand) {
      throw new NotFoundException(`Store with slug "${slug}" not found`);
    }

    const [feeds, total] = await this.brandFeedsRepository
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.brand', 'brand')
      .where('feed.brandId = :brandId', { brandId: brand.id })
      .andWhere('feed.status = :status', { status: 1 })
      .orderBy('feed.createdAt', 'DESC')
      .skip(offset || 0)
      .take(limit || 100)
      .getManyAndCount();

    return {
      data: feeds.map((f) => this.mapDeal(f)),
      total,
    };
  }

  async getDealById(id: string) {
    const feed = await this.brandFeedsRepository
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.brand', 'brand')
      .where('feed.id = :id', { id })
      .andWhere('feed.status = :status', { status: 1 })
      .getOne();

    if (!feed) {
      throw new NotFoundException(`Deal with id "${id}" not found`);
    }

    return this.mapDeal(feed);
  }

  private mapDeal(feed: BrandFeed) {
    return {
      id: feed.id,
      storeSlug: feed.brand ? feed.brand.slug : '',
      storeName: feed.brand ? feed.brand.brandName : '',
      category: '',
      type: 'brandOffer',
      title: feed.title,
      subtitle: feed.subtitle,
      description: feed.description,
      image: feed.image,
      publishedAt: feed.createdAt,
      affiliateUrl: '',
      originalPrice: 0,
      price: 0,
      discountPercent: 0,
    };
  }

  // ---------- Coupons (7-9) ----------

  async getCoupons(limit?: number, offset?: number) {
    const [coupons, total] = await this.couponsRepository
      .createQueryBuilder('coupon')
      .orderBy('coupon.createdAt', 'DESC')
      .skip(offset || 0)
      .take(limit || 100)
      .getManyAndCount();

    return {
      data: coupons.map((c) => this.mapCoupon(c)),
      total,
    };
  }

  async getLatestCoupons(limit?: number) {
    const coupons = await this.couponsRepository.find({
      order: { createdAt: 'DESC' },
      take: limit || 4,
    });

    return coupons.map((c) => this.mapCoupon(c));
  }

  async getCouponById(id: string) {
    const coupon = await this.couponsRepository.findOne({ where: { id } });
    if (!coupon) {
      throw new NotFoundException(`Coupon with id "${id}" not found`);
    }
    return this.mapCoupon(coupon);
  }

  private mapCoupon(coupon: AllCoupon) {
    return {
      id: coupon.id,
      title: coupon.title,
      description: coupon.description,
      link: this.resolveLink(coupon.link),
      image: coupon.image,
      createdAt: coupon.createdAt,
    };
  }

  // ---------- Brand coupons (brand detail page) ----------

  async getStoreBrandCoupons(slug: string, limit?: number, offset?: number) {
    const brand = await this.brandsRepository.findOne({ where: { slug } });
    if (!brand) {
      throw new NotFoundException(`Store with slug "${slug}" not found`);
    }

    const [coupons, total] = await this.brandCouponsRepository
      .createQueryBuilder('brandCoupon')
      .where('brandCoupon.brandId = :brandId', { brandId: brand.id })
      .andWhere('brandCoupon.status = :status', { status: 1 })
      .orderBy('brandCoupon.createdAt', 'DESC')
      .skip(offset || 0)
      .take(limit || 100)
      .getManyAndCount();

    return {
      data: coupons.map((c) => this.mapBrandCoupon(c)),
      total,
    };
  }

  private mapBrandCoupon(coupon: BrandCoupon) {
    return {
      id: coupon.id,
      brandId: coupon.brandId,
      title: coupon.title,
      description: coupon.description,
      link: this.resolveLink(coupon.link),
      image: coupon.image,
      status: coupon.status,
      createdAt: coupon.createdAt,
    };
  }
}


