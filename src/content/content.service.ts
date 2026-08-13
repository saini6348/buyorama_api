import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from '../entities/content.entity';
import { SanitizeHtmlService } from '../common/sanitize-html.service';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);

  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    private sanitizeHtml: SanitizeHtmlService,
  ) {}

  async getAllListing(limit: number = 100, offset: number = 0) {
    try {
      const [data, total] = await this.contentRepository.findAndCount({
        where: { status: 1 },
        order: { created_at: 'DESC' },
        take: limit,
        skip: offset,
        relations: ['brand'],
      });

      return {
        statusCode: 200,
        data,
        total,
        message: 'Content listed successfully',
      };
    } catch (error) {
      this.logger.error('Error fetching content listing', error instanceof Error ? error.stack : String(error));
      return {
        statusCode: 500,
        message: 'An error occurred while fetching content',
      };
    }
  }

  async getContentByBrand(brand_id: string, limit: number = 100, offset: number = 0) {
    try {
      const [data, total] = await this.contentRepository.findAndCount({
        where: { brand_id, status: 1 },
        order: { created_at: 'DESC' },
        take: limit,
        skip: offset,
        relations: ['brand'],
      });

      return {
        statusCode: 200,
        data,
        total,
        message: 'Brand content listed successfully',
      };
    } catch (error) {
      this.logger.error('Error fetching brand content', error instanceof Error ? error.stack : String(error));
      return {
        statusCode: 500,
        message: 'An error occurred while fetching content',
      };
    }
  }

  async createContent(createContentDto: {
    brand_id: string;
    title: string;
    description: string;
    image_path?: string;
    status?: number;
  }) {
    try {
      const sanitizedDescription = this.sanitizeHtml.sanitize(
        createContentDto.description,
      );

      const content = this.contentRepository.create({
        ...createContentDto,
        description: sanitizedDescription,
        status: createContentDto.status ?? 1,
      });

      const savedContent = await this.contentRepository.save(content);

      return {
        statusCode: 201,
        data: savedContent,
        message: 'Content created successfully',
      };
    } catch (error) {
      this.logger.error('Error creating content', error instanceof Error ? error.stack : String(error));
      return {
        statusCode: 500,
        message: 'An error occurred while creating content',
      };
    }
  }

  async updateContent(
    id: string,
    updateContentDto: {
      title?: string;
      description?: string;
      image_path?: string;
      status?: number;
    },
  ) {
    try {
      const sanitizedUpdate: typeof updateContentDto = { ...updateContentDto };

      if (sanitizedUpdate.description !== undefined) {
        sanitizedUpdate.description = this.sanitizeHtml.sanitize(
          sanitizedUpdate.description,
        );
      }

      await this.contentRepository.update(id, sanitizedUpdate);

      const updatedContent = await this.contentRepository.findOne({
        where: { id },
        relations: ['brand'],
      });

      if (!updatedContent) {
        return {
          statusCode: 404,
          message: 'Content not found',
        };
      }

      return {
        statusCode: 200,
        data: updatedContent,
        message: 'Content updated successfully',
      };
    } catch (error) {
      this.logger.error('Error updating content', error instanceof Error ? error.stack : String(error));
      return {
        statusCode: 500,
        message: 'An error occurred while updating content',
      };
    }
  }

  async updateStatus(id: string, status: number) {
    try {
      await this.contentRepository.update(id, { status });

      const updatedContent = await this.contentRepository.findOne({
        where: { id },
        relations: ['brand'],
      });

      if (!updatedContent) {
        return {
          statusCode: 404,
          message: 'Content not found',
        };
      }

      return {
        statusCode: 200,
        data: updatedContent,
        message: 'Content status updated successfully',
      };
    } catch (error) {
      this.logger.error('Error updating content status', error instanceof Error ? error.stack : String(error));
      return {
        statusCode: 500,
        message: 'An error occurred while updating content status',
      };
    }
  }

  async deleteContent(id: string) {
    try {
      const result = await this.contentRepository.delete(id);

      if (result.affected === 0) {
        return {
          statusCode: 404,
          message: 'Content not found',
        };
      }

      return {
        statusCode: 200,
        message: 'Content deleted successfully',
      };
    } catch (error) {
      this.logger.error('Error deleting content', error instanceof Error ? error.stack : String(error));
      return {
        statusCode: 500,
        message: 'An error occurred while deleting content',
      };
    }
  }

  async getAllContent(limit: number = 100, offset: number = 0) {
    try {
      const [data, total] = await this.contentRepository.findAndCount({
        order: { created_at: 'DESC' },
        take: limit,
        skip: offset,
        relations: ['brand'],
      });

      return {
        statusCode: 200,
        data,
        total,
        message: 'All content listed successfully',
      };
    } catch (error) {
      this.logger.error('Error fetching all content', error instanceof Error ? error.stack : String(error));
      return {
        statusCode: 500,
        message: 'An error occurred while fetching content',
      };
    }
  }
}

