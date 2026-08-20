import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { BrandFeed } from '../entities/brand-feed.entity';
import { AllCoupon } from '../entities/all-coupon.entity';
import { BrandCoupon } from '../entities/brand-coupon.entity';
import { CardsFeed } from '../cards-feeds/cards-feed.entity';
import { PublicListCardsFeedDto } from './dto/list-cards-feed.dto';

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
    @InjectRepository(CardsFeed)
    private cardsFeedsRepository: Repository<CardsFeed>,
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

  // ---------- Cards feeds (public, POST /api/public/cards-feed/list) ----------

  /**
   * List active credit card feeds (status = 1), filtered by NAME arrays:
   * { page, limit, tags[], categories[], banks[] }.
   * Within each filter the selections OR together; across filters AND.
   */
  async getActiveCardsFeeds(dto: PublicListCardsFeedDto): Promise<{ data: unknown[]; total: number }> {
    const {
      page = 0,
      limit = 20,
      tags = [],
      categories = [],
      banks = [],
    } = dto;

    const query = this.cardsFeedsRepository
      .createQueryBuilder('card')
      .leftJoinAndSelect('card.bank', 'bank')
      .leftJoinAndSelect('card.creditCardCategories', 'category')
      .leftJoinAndSelect('card.tags', 'tag')
      .where('card.status = :status', { status: 1 });

    if (banks.length > 0) {
      query.andWhere('LOWER(bank.name) IN (:...banks)', {
        banks: banks.map((b) => b.toLowerCase()),
      });
    }

    if (categories.length > 0) {
      query.andWhere('LOWER(category.name) IN (:...categories)', {
        categories: categories.map((c) => c.toLowerCase()),
      });
    }

    if (tags.length > 0) {
      query.andWhere('LOWER(tag.name) IN (:...tags)', {
        tags: tags.map((t) => t.toLowerCase()),
      });
    }

    const [feeds, total] = await query
      .orderBy('card.createdAt', 'DESC')
      .skip(page * limit)
      .take(limit)
      .getManyAndCount();

    return { data: feeds.map((f) => this.mapCardsFeed(f)), total };
  }

  /** Map a CardsFeed entity into a public, frontend-friendly card shape. */
  private mapCardsFeed(feed: CardsFeed) {
    return {
      id: feed.id,
      title: feed.title,
      description: feed.description,
      image: feed.image,
      link: this.resolveLink(feed.link),
      bank: feed.bank
        ? {
            id: feed.bank.id,
            name: feed.bank.name,
          }
        : null,
      categories: (feed.creditCardCategories ?? []).map((c) => ({
        id: c.id,
        name: c.name,
      })),
      tags: (feed.tags ?? []).map((t) => ({
        id: t.id,
        name: t.name,
      })),
      status: feed.status,
      createdAt: feed.createdAt,
    };
  }
}


