import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadImageDto, DeleteUploadedImageDto } from './dto/upload-image.dto';

/**
 * Admin image upload endpoints. JWT-protected by the global guard, so only
 * authenticated backoffice users can upload / delete images.
 */
@Controller('api/uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  /** Upload an image (base64 data URL) into /uploads and return its URL. */
  @Post()
  @HttpCode(201)
  uploadImage(@Body() dto: UploadImageDto): { url: string; message: string } {
    const { url } = this.uploadsService.upload(dto.dataUrl);
    return { url, message: 'Image uploaded successfully' };
  }

  /** Delete an uploaded image file from /uploads by its URL. */
  @Post('delete')
  @HttpCode(200)
  deleteImage(@Body() dto: DeleteUploadedImageDto): { message: string } {
    return this.uploadsService.delete(dto.url);
  }
}
