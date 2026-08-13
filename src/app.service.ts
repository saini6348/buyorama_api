import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { message: string; timestamp: string; status: string } {
    return {
      message: 'Buyorama Backoffice API is running',
      timestamp: new Date().toISOString(),
      status: 'healthy',
    };
  }
}
