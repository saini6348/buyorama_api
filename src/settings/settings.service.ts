import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSettings } from '../entities/site-settings.entity';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SiteSettings)
    private settingsRepository: Repository<SiteSettings>,
  ) {}

  async getSettings(): Promise<SiteSettings> {
    let settings = await this.settingsRepository.findOne({
      order: { createdAt: 'DESC' },
    });

    if (!settings) {
      settings = this.settingsRepository.create({
        siteName: 'Buyorama',
        siteLogo: null,
        tagline: 'Find Amazing Deals & Save Big',
      });
      return await this.settingsRepository.save(settings);
    }

    return settings;
  }

  async updateSettings(
    updateSettingsDto: UpdateSettingsDto,
  ): Promise<SiteSettings> {
    let settings = await this.settingsRepository.findOne({
      order: { createdAt: 'DESC' },
    });

    if (!settings) {
      settings = this.settingsRepository.create(updateSettingsDto);
      return await this.settingsRepository.save(settings);
    }

    if (updateSettingsDto.siteName) {
      settings.siteName = updateSettingsDto.siteName;
    }

    if (updateSettingsDto.siteLogo !== undefined) {
      settings.siteLogo = updateSettingsDto.siteLogo || null;
    }

    if (updateSettingsDto.tagline !== undefined) {
      settings.tagline = updateSettingsDto.tagline || null;
    }

    return await this.settingsRepository.save(settings);
  }
}
