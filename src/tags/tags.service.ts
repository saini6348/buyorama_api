import {
  Injectable,
  BadRequestException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

const DEFAULT_TAGS = [
  'Cashback Credit Cards',
  'Lifetime Free Credit Cards',
  'Travel Credit Cards',
  'Airport Lounge Credit Cards',
  'Fuel Credit Cards',
  'Low Forex Credit Cards',
  'RuPay Credit Cards',
];

@Injectable()
export class TagsService implements OnModuleInit {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async onModuleInit() {
    const count = await this.tagsRepository.count();
    if (count === 0) {
      const defaults = DEFAULT_TAGS.map((name) =>
        this.tagsRepository.create({ name, status: 1 }),
      );
      await this.tagsRepository.save(defaults);
    }
  }

  async getAllTags(
    status?: number,
    limit = 100,
    offset = 0,
  ): Promise<{ data: Tag[]; total: number }> {
    const query = this.tagsRepository.createQueryBuilder('tag');

    if (status !== undefined) {
      query.where('tag.status = :status', { status });
    }

    const [data, total] = await query
      .orderBy('tag.createdAt', 'ASC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async addTag(createDto: CreateTagDto): Promise<Tag> {
    const { name } = createDto;

    const existing = await this.tagsRepository.findOne({ where: { name } });

    if (existing) {
      throw new BadRequestException('Tag name already exists');
    }

    const tag = this.tagsRepository.create({ name, status: 1 });

    return await this.tagsRepository.save(tag);
  }

  async updateTag(updateDto: UpdateTagDto): Promise<Tag> {
    const { id, name } = updateDto;

    const tag = await this.tagsRepository.findOne({ where: { id } });

    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    if (name && name !== tag.name) {
      const existing = await this.tagsRepository.findOne({
        where: { name },
      });
      if (existing) {
        throw new BadRequestException('Tag name already exists');
      }
      tag.name = name;
    }

    return await this.tagsRepository.save(tag);
  }

  async updateStatus(updateStatusDto: UpdateStatusDto): Promise<Tag> {
    const { id, status } = updateStatusDto;

    const tag = await this.tagsRepository.findOne({ where: { id } });

    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found`);
    }

    tag.status = status;

    return await this.tagsRepository.save(tag);
  }
}
