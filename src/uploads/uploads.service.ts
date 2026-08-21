import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as crypto from 'crypto';

const ALLOWED_MIME_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
};

/** Month index (0-based) -> lowercase month name, e.g. 7 -> "aug". */
const MONTH_NAMES = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
];

/** Resolve the absolute path of the uploads directory. */
function uploadsDir(): string {
  return path.join(process.cwd(), 'uploads');
}

/** Builds "/uploads/<year>/<month>/<filename>" using the current date. */
function relativeUrlFor(filename: string, now: Date): string {
  const year = now.getFullYear();
  const month = MONTH_NAMES[now.getMonth()];
  return `/uploads/${year}/${month}/${filename}`;
}

/** Resolve the absolute file path for a URL under /uploads/... */
function filePathForUrl(url: string): string {
  const m = /\/uploads\/[^?#]+$/.exec(url);
  if (!m) {
    throw new BadRequestException('Could not resolve uploaded file path.');
  }
  // e.g. "2026/aug/1787333941377-abc.jpg"
  const rel = m[0].replace(/^\/uploads\//, '');
  if (!rel || rel.includes('..')) {
    throw new BadRequestException('Invalid file path.');
  }
  return path.join(uploadsDir(), ...rel.split('/'));
}

@Injectable()
export class UploadsService {
  /**
   * Decode a base64 data URL, write it to /uploads/<year>/<month>/ and return
   * the RELATIVE file path (e.g. "/uploads/2026/aug/xxx.jpg") — no domain.
   * The frontend prepends the backend origin at display time.
   */
  upload(dataUrl: string): { url: string } {
    const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
    if (!match) {
      throw new BadRequestException('Invalid image data. Expected a base64 data URL.');
    }

    const mime = match[1].toLowerCase();
    const ext = ALLOWED_MIME_MAP[mime];
    if (!ext) {
      throw new BadRequestException(
        'Unsupported image type. Allowed: JPEG, PNG, WebP, GIF, SVG.',
      );
    }

    const buffer = Buffer.from(match[2], 'base64');

    // Basic sanity check: reject tiny/no-op buffers (helps guard malformed data).
    if (!buffer.length) {
      throw new BadRequestException('Image content is empty.');
    }

    const now = new Date();
    const dir = path.join(uploadsDir(), String(now.getFullYear()), MONTH_NAMES[now.getMonth()]);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, buffer);

    return { url: relativeUrlFor(filename, now) };
  }

  /** Delete an uploaded file by its (relative or full) URL. */
  delete(url: string): { message: string } {
    const filePath = filePathForUrl(url);

    if (!filePath.startsWith(uploadsDir())) {
      throw new BadRequestException('Invalid file path.');
    }

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Uploaded file not found.');
    }

    fs.unlinkSync(filePath);
    return { message: 'Image deleted successfully' };
  }
}
