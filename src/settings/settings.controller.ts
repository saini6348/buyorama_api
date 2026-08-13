import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SiteSettings } from '../entities/site-settings.entity';

@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post('get')
  @HttpCode(200)
  async getSettings(): Promise<{ data: SiteSettings; message: string }> {
    const data = await this.settingsService.getSettings();
    return {
      data,
      message: 'Settings retrieved successfully',
    };
  }

  @Post('update')
  @HttpCode(200)
  async updateSettings(
    @Body() updateSettingsDto: UpdateSettingsDto,
  ): Promise<{ data: SiteSettings; message: string }> {
    const data = await this.settingsService.updateSettings(updateSettingsDto);
    return {
      data,
      message: 'Settings updated successfully',
    };
  }
}
