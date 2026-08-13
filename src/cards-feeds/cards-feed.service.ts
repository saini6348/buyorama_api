import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CardsFeed } from './cards-feed.entity';
import { Bank } from '../entities/bank.entity';
import { Tag } from '../entities/tag.entity';
import { CreditCardCategory } from '../entities/credit-card-category.entity';
import { CreateCardsFeedDto } from './dto/create-card-feed.dto';
import { UpdateCardsFeedDto } from './dto/update-card-feed.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ListCardsFeedDto } from './dto/list-card-feed.dto';
import { SanitizeHtmlService } from '../common/sanitize-html.service';

@Injectable()
export class CardsFeedsService {
  constructor(
    @InjectRepository(CardsFeed)
    private cardsFeedsRepository: Repository<CardsFeed>,
    @InjectRepository(Bank)
    private banksRepository: Repository<Bank>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
    @InjectRepository(CreditCardCategory)
    private categoriesRepository: Repository<CreditCardCategory>,
    private sanitizeHtml: SanitizeHtmlService,
  ) {}

  async getAllCardsFeeds(
    listDto: ListCardsFeedDto,
  ): Promise<{ data: CardsFeed[]; total: number }> {
    const {
      status,
      bankId,
      categoryIds,
      tagIds,
      limit = 10,
      offset = 0,
    } = listDto;

    const query = this.cardsFeedsRepository
      .createQueryBuilder('card')
      .leftJoinAndSelect('card.bank', 'bank')
      .leftJoinAndSelect('card.creditCardCategories', 'category')
      .leftJoinAndSelect('card.tags', 'tag');

    if (status !== undefined) {
      query.andWhere('card.status = :status', { status });
    }

    if (bankId) {
      query.andWhere('card.bankId = :bankId', { bankId });
    }

    if (categoryIds && categoryIds.length > 0) {
      query
        .innerJoin('card.creditCardCategories', 'filterCategory')
        .andWhere('filterCategory.id IN (:...categoryIds)', { categoryIds });
    }

    if (tagIds && tagIds.length > 0) {
      query
        .innerJoin('card.tags', 'filterTag')
        .andWhere('filterTag.id IN (:...tagIds)', { tagIds });
    }

    const [data, total] = await query
      .orderBy('card.createdAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async getCardsFeed(id: string): Promise<CardsFeed> {
    const card = await this.cardsFeedsRepository
      .createQueryBuilder('card')
      .leftJoinAndSelect('card.bank', 'bank')
      .leftJoinAndSelect('card.creditCardCategories', 'category')
      .leftJoinAndSelect('card.tags', 'tag')
      .where('card.id = :id', { id })
      .getOne();

    if (!card) {
      throw new NotFoundException(`Card feed with id ${id} not found`);
    }

    return card;
  }

  async addCardsFeed(dto: CreateCardsFeedDto): Promise<CardsFeed> {
    const {
      creditCardCategoryIds,
      tagIds,
      bankId,
      ...rest
    } = dto;

    let bank: Bank | undefined;
    if (bankId) {
      bank = await this.banksRepository.findOne({ where: { id: bankId } });
      if (!bank) {
        throw new NotFoundException(`Bank with id ${bankId} not found`);
      }
    }

    let categories: CreditCardCategory[] = [];
    if (creditCardCategoryIds && creditCardCategoryIds.length > 0) {
      categories = await this.categoriesRepository.find({
        where: { id: In(creditCardCategoryIds) },
      });
    }

    let tags: Tag[] = [];
    if (tagIds && tagIds.length > 0) {
      tags = await this.tagsRepository.find({ where: { id: In(tagIds) } });
    }

    const description = rest.description
      ? this.sanitizeHtml.sanitize(rest.description)
      : null;

    const card = this.cardsFeedsRepository.create({
      ...rest,
      description,
      bankId: bankId || null,
      image: rest.image || null,
      link: rest.link || null,
      creditCardCategories: categories,
      tags,
      status: 1,
    });

    return await this.cardsFeedsRepository.save(card);
  }

  async updateCardsFeed(dto: UpdateCardsFeedDto): Promise<CardsFeed> {
    const {
      id,
      creditCardCategoryIds,
      tagIds,
      bankId,
      status,
      ...rest
    } = dto;

    const card = await this.cardsFeedsRepository.findOne({
      where: { id },
      relations: ['bank'],
    });

    if (!card) {
      throw new NotFoundException(`Card feed with id ${id} not found`);
    }

    if (bankId !== undefined) {
      if (bankId) {
        const bank = await this.banksRepository.findOne({ where: { id: bankId } });
        if (!bank) {
          throw new NotFoundException(`Bank with id ${bankId} not found`);
        }
      }
      card.bankId = bankId || null;
    }

    if (creditCardCategoryIds !== undefined) {
      card.creditCardCategories = creditCardCategoryIds.length
        ? await this.categoriesRepository.find({
            where: { id: In(creditCardCategoryIds) },
          })
        : [];
    }

    if (tagIds !== undefined) {
      card.tags = tagIds.length
        ? await this.tagsRepository.find({ where: { id: In(tagIds) } })
        : [];
    }

    // Explicit field-by-field assignment (M-02: prevent mass assignment)
    if (rest.title !== undefined) {
      card.title = rest.title;
    }
    if (rest.description !== undefined) {
      card.description = this.sanitizeHtml.sanitize(rest.description);
    }
    if (rest.image !== undefined) {
      card.image = rest.image;
    }
    if (rest.link !== undefined) {
      card.link = rest.link;
    }

    if (status !== undefined) {
      card.status = status;
    }

    return await this.cardsFeedsRepository.save(card);
  }

  async updateStatus(dto: UpdateStatusDto): Promise<CardsFeed> {
    const card = await this.cardsFeedsRepository.findOne({
      where: { id: dto.id },
    });

    if (!card) {
      throw new NotFoundException(`Card feed with id ${dto.id} not found`);
    }

    card.status = dto.status;

    return await this.cardsFeedsRepository.save(card);
  }

  async deleteCardsFeed(id: string): Promise<{ message: string }> {
    const card = await this.cardsFeedsRepository.findOne({
      where: { id },
    });

    if (!card) {
      throw new NotFoundException(`Card feed with id ${id} not found`);
    }

    await this.cardsFeedsRepository.remove(card);

    return { message: 'Card feed deleted successfully' };
  }
}
