import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Get()
  getInfo() {
    return {
      name: 'Buyorama Backoffice API',
      version: '1.0.0',
      description: 'Backend API services for Buyorama admin panel',
      endpoints: {
        health: '/api/health',
        coupons: '/api/coupons',
        stores: '/api/stores',
        deals: '/api/deals',
      },
    };
  }
}
