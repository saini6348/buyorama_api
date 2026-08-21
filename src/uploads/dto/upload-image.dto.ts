import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class UploadImageDto {
  /**
   * The image as a base64 data URL, e.g.
   * "data:image/png;base64,iVBORw0KGgo...".
   */
  @IsNotEmpty()
  @IsString()
  dataUrl: string;
}

export class DeleteUploadedImageDto {
  /** A relative or absolute URL/path under /uploads/, e.g.
   *  "/uploads/2026/aug/abc.png" or "http://host/uploads/..." */
  @IsNotEmpty()
  @IsString()
  @Matches(/^(https?:\/\/.*)?\/uploads\/.+$/, {
    message: 'Image URL must be under the /uploads/ location',
  })
  url: string;
}
