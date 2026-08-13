import {
  Controller,
  Post,
  Body,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CardsFeedsService } from './cards-feed.service';
import { CreateCardsFeedDto } from './dto/create-card-feed.dto';
import { UpdateCardsFeedDto } from './dto/update-card-feed.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ListCardsFeedDto } from './dto/list-card-feed.dto';
import { DeleteCardsFeedDto } from './dto/delete-card-feed.dto';
import { GetCardsFeedDto } from './dto/get-card-feed.dto';
import { CardsFeed } from './cards-feed.entity';

@Controller('api/cards-feed')
@UsePipes(new ValidationPipe())
export class CardsFeedsController {
  constructor(private readonly cardsFeedsService: CardsFeedsService) {}

  @Post('list')
  @HttpCode(200)
  async getAllCardsFeeds(
    @Body() listDto: ListCardsFeedDto,
  ): Promise<{ data: CardsFeed[]; total: number; message: string }> {
    const result = await this.cardsFeedsService.getAllCardsFeeds(listDto);
    return {
      ...result,
      message: 'Card feeds retrieved successfully',
    };
  }

  @Post('get')
  @HttpCode(200)
  async getCardsFeed(
    @Body() dto: GetCardsFeedDto,
  ): Promise<{ data: CardsFeed; message: string }> {
    const data = await this.cardsFeedsService.getCardsFeed(dto.id);
    return {
      data,
      message: 'Card feed retrieved successfully',
    };
  }

  @Post('create')
  @HttpCode(201)
  async addCardsFeed(
    @Body() dto: CreateCardsFeedDto,
  ): Promise<{ data: CardsFeed; message: string }> {
    const data = await this.cardsFeedsService.addCardsFeed(dto);
    return {
      data,
      message: 'Card feed created successfully',
    };
  }

  @Post('update')
  @HttpCode(200)
  async updateCardsFeed(
    @Body() dto: UpdateCardsFeedDto,
  ): Promise<{ data: CardsFeed; message: string }> {
    const data = await this.cardsFeedsService.updateCardsFeed(dto);
    return {
      data,
      message: 'Card feed updated successfully',
    };
  }

  @Post('update-status')
  @HttpCode(200)
  async updateStatus(
    @Body() dto: UpdateStatusDto,
  ): Promise<{ data: CardsFeed; message: string }> {
    const data = await this.cardsFeedsService.updateStatus(dto);
    return {
      data,
      message: 'Card feed status updated successfully',
    };
  }

  @Post('delete')
  @HttpCode(200)
  async deleteCardsFeed(
    @Body() dto: DeleteCardsFeedDto,
  ): Promise<{ message: string }> {
    return await this.cardsFeedsService.deleteCardsFeed(dto.id);
  }
}
