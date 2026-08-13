import { Controller, Post, Body, Query, HttpCode } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Tag } from '../entities/tag.entity';

@Controller('api/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post('list')
  @HttpCode(200)
  async getAllTags(
    @Query('status') status?: string,
    @Query('limit') limit: number = 100,
    @Query('offset') offset: number = 0,
  ): Promise<{ data: Tag[]; total: number; message: string }> {
    const statusNum = status ? parseInt(status) : undefined;
    // Bound limit/offset to prevent resource exhaustion (M-02)
    const boundedLimit = Math.min(Math.max(parseInt(String(limit)) || 100, 1), 500);
    const boundedOffset = Math.max(parseInt(String(offset)) || 0, 0);
    const result = await this.tagsService.getAllTags(
      statusNum,
      boundedLimit,
      boundedOffset,
    );
    return {
      ...result,
      message: 'Tags retrieved successfully',
    };
  }

  @Post('create')
  @HttpCode(201)
  async addTag(
    @Body() createDto: CreateTagDto,
  ): Promise<{ data: Tag; message: string }> {
    const data = await this.tagsService.addTag(createDto);
    return {
      data,
      message: 'Tag created successfully',
    };
  }

  @Post('update')
  @HttpCode(200)
  async updateTag(
    @Body() updateDto: UpdateTagDto,
  ): Promise<{ data: Tag; message: string }> {
    const data = await this.tagsService.updateTag(updateDto);
    return {
      data,
      message: 'Tag updated successfully',
    };
  }

  @Post('update-status')
  @HttpCode(200)
  async updateStatus(
    @Body() updateStatusDto: UpdateStatusDto,
  ): Promise<{ data: Tag; message: string }> {
    const data = await this.tagsService.updateStatus(updateStatusDto);
    return {
      data,
      message: 'Tag status updated successfully',
    };
  }
}

