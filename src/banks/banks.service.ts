import {
  Injectable,
  BadRequestException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bank } from '../entities/bank.entity';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

const DEFAULT_BANKS = [
  'SBI Card',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'IDFC FIRST Bank',
  'IndusInd Bank',
  'AU Small Finance Bank',
  'Kotak Mahindra Bank',
  'YES Bank',
  'HSBC',
  'Standard Chartered',
  'American Express',
  'BOBCARD',
  'Federal Bank',
  'RBL Bank',
];

@Injectable()
export class BanksService implements OnModuleInit {
  constructor(
    @InjectRepository(Bank)
    private banksRepository: Repository<Bank>,
  ) {}

  async onModuleInit() {
    const count = await this.banksRepository.count();
    if (count === 0) {
      const defaults = DEFAULT_BANKS.map((name) =>
        this.banksRepository.create({ name, status: 1 }),
      );
      await this.banksRepository.save(defaults);
    }
  }

  async getAllBanks(
    status?: number,
    limit = 100,
    offset = 0,
  ): Promise<{ data: Bank[]; total: number }> {
    const query = this.banksRepository.createQueryBuilder('bank');

    if (status !== undefined) {
      query.where('bank.status = :status', { status });
    }

    const [data, total] = await query
      .orderBy('bank.createdAt', 'ASC')
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async addBank(createDto: CreateBankDto): Promise<Bank> {
    const { name } = createDto;

    const existing = await this.banksRepository.findOne({ where: { name } });

    if (existing) {
      throw new BadRequestException('Bank name already exists');
    }

    const bank = this.banksRepository.create({ name, status: 1 });

    return await this.banksRepository.save(bank);
  }

  async updateBank(updateDto: UpdateBankDto): Promise<Bank> {
    const { id, name } = updateDto;

    const bank = await this.banksRepository.findOne({ where: { id } });

    if (!bank) {
      throw new NotFoundException(`Bank with id ${id} not found`);
    }

    if (name && name !== bank.name) {
      const existing = await this.banksRepository.findOne({
        where: { name },
      });
      if (existing) {
        throw new BadRequestException('Bank name already exists');
      }
      bank.name = name;
    }

    return await this.banksRepository.save(bank);
  }

  async updateStatus(updateStatusDto: UpdateStatusDto): Promise<Bank> {
    const { id, status } = updateStatusDto;

    const bank = await this.banksRepository.findOne({ where: { id } });

    if (!bank) {
      throw new NotFoundException(`Bank with id ${id} not found`);
    }

    bank.status = status;

    return await this.banksRepository.save(bank);
  }
}
