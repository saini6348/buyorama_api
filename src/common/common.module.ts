import { Module, Global } from '@nestjs/common';
import { SanitizeHtmlService } from './sanitize-html.service';

@Global()
@Module({
  providers: [SanitizeHtmlService],
  exports: [SanitizeHtmlService],
})
export class CommonModule {}
