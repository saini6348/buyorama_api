import { Controller, Post, Body, Query, HttpCode } from '@nestjs/common';
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Bank } from '../entities/bank.entity';

@Controller('api/banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Post('list')
  @HttpCode(200)
  async getAllBanks(
    @Query('status') status?: string,
    @Query('limit') limit: number = 100,
    @Query('offset') offset: number = 0,
  ): Promise<{ data: Bank[]; total: number; message: string }> {
    const statusNum = status ? parseInt(status) : undefined;
    // Bound limit/offset to prevent resource exhaustion (M-02)
    const boundedLimit = Math.min(Math.max(parseInt(String(limit)) || 100, 1), 500);
    const boundedOffset = Math.max(parseInt(String(offset)) || 0, 0);
    const result = await this.banksService.getAllBanks(
      statusNum,
      boundedLimit,
      boundedOffset,
    );
    return {
      ...result,
      message: 'Banks retrieved successfully',
    };
  }

  @Post('create')
  @HttpCode(201)
  async addBank(
    @Body() createDto: CreateBankDto,
  ): Promise<{ data: Bank; message: string }> {
    const data = await this.banksService.addBank(createDto);
    return {
      data,
      message: 'Bank created successfully',
    };
  }

  @Post('update')
  @HttpCode(200)
  async updateBank(
    @Body() updateDto: UpdateBankDto,
  ): Promise<{ data: Bank; message: string }> {
    const data = await this.banksService.updateBank(updateDto);
    return {
      data,
      message: 'Bank updated successfully',
    };
  }

  @Post('update-status')
  @HttpCode(200)
  async updateStatus(
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<{ data: Bank; message: string }> {
    const data = await this.banksService.updateStatus(updateStatusDto);
    return {
      data,
      message: 'Bank status updated successfully',
    };
  }
}

