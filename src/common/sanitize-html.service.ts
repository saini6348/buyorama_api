import { Injectable } from '@nestjs/common';
import sanitizeHtml from 'sanitize-html';

@Injectable()
export class SanitizeHtmlService {
  private readonly allowedTags = [
    'p', 'div', 'br', 'span', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote', 'pre', 'code',
    'a', 'img',
  ];

  private readonly allowedAttributes = {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height'],
    div: ['style'],
    p: ['style'],
    span: ['style'],
  };

  private readonly allowedSchemes = ['http', 'https', 'mailto'];

  sanitize(html: string): string {
    if (!html) return html;

    return sanitizeHtml(html, {
      allowedTags: this.allowedTags,
      allowedAttributes: this.allowedAttributes,
      allowedSchemes: this.allowedSchemes,
      allowedSchemesByTag: {
        img: ['http', 'https', 'data'],
      },
      disallowedTagsMode: 'discard',
      enforceHtmlBoundary: true,
      allowProtocolRelative: false,
    });
  }
}
