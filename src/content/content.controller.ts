import { Controller, Post, Body } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('api/content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post('getAllListing')
  getAllListing(@Body() body: { limit?: number; offset?: number }) {
    const limit = Math.min(Math.max(body.limit || 100, 1), 500);
    const offset = Math.max(body.offset || 0, 0);
    return this.contentService.getAllListing(limit, offset);
  }

  @Post('getContentByBrand')
  getContentByBrand(
    @Body() body: { brand_id: string; limit?: number; offset?: number },
  ) {
    const { brand_id } = body;
    const limit = Math.min(Math.max(body.limit || 100, 1), 500);
    const offset = Math.max(body.offset || 0, 0);
    return this.contentService.getContentByBrand(brand_id, limit, offset);
  }

  @Post('create')
  createContent(
    @Body()
    body: {
      brand_id: string;
      title: string;
      description: string;
      image_path?: string;
      status?: number;
    },
  ) {
    return this.contentService.createContent(body);
  }

  @Post('update')
  updateContent(
    @Body()
    body: {
      id: string;
      title?: string;
      description?: string;
      image_path?: string;
      status?: number;
    },
  ) {
    const { id, ...updateData } = body;
    return this.contentService.updateContent(id, updateData);
  }

  @Post('update-status')
  updateStatus(@Body() body: { id: string; status: number }) {
    return this.contentService.updateStatus(body.id, body.status);
  }

  @Post('delete')
  deleteContent(@Body() body: { id: string }) {
    return this.contentService.deleteContent(body.id);
  }

  @Post('getAll')
  getAllContent(@Body() body: { limit?: number; offset?: number }) {
    const limit = Math.min(Math.max(body.limit || 100, 1), 500);
    const offset = Math.max(body.offset || 0, 0);
    return this.contentService.getAllContent(limit, offset);
  }
}

