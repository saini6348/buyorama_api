import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { BrandsModule } from './brands/brands.module';
import { UsersModule } from './users/users.module';
import { SettingsModule } from './settings/settings.module';
import { ContentModule } from './content/content.module';
import { BrandCouponsModule } from './brand-coupons/brand-coupons.module';
import { CouponsModule } from './coupons/coupons.module';
import { BrandFeedsModule } from './brand-feeds/brand-feeds.module';
import { CardsFeedsModule } from './cards-feeds/cards-feed.module';
import { CreditCardCategoriesModule } from './credit-card-categories/credit-card-categories.module';
import { BanksModule } from './banks/banks.module';
import { TagsModule } from './tags/tags.module';
import { PublicApisModule } from './publicApis/public-apis.module';
import { Brand } from './entities/brand.entity';
import { User } from './entities/user.entity';
import { SiteSettings } from './entities/site-settings.entity';
import { Content } from './entities/content.entity';
import { BrandCoupon } from './entities/brand-coupon.entity';
import { AllCoupon } from './entities/all-coupon.entity';
import { BrandFeed } from './entities/brand-feed.entity';
import { CardsFeed } from './cards-feeds/cards-feed.entity';
import { CreditCardCategory } from './entities/credit-card-category.entity';
import { Bank } from './entities/bank.entity';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    // Rate limiting (M-03)
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 30, // 30 requests per minute
      },
    ]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const connectionString =
          config.get<string>('DATABASE_URL') ||
          config.get<string>('POSTGRES_URL_NON_POOLING');

        const base: Record<string, unknown> = connectionString
          ? { url: connectionString }
          : {
              host: config.get<string>('DB_HOST', 'localhost'),
              port: config.get<number>('DB_PORT', 5432),
              username: config.get<string>('DB_USERNAME', ''),
              password: config.get<string>('DB_PASSWORD', ''),
              database: config.get<string>('DB_NAME', ''),
            };

        const useSsl = config.get<string>('DB_SSL') === 'true' || !!connectionString;

        return {
          type: 'postgres',
          ...base,
          autoLoadEntities: true,
          synchronize: true,
          logging: false,
          ssl: useSsl ? { rejectUnauthorized: false } : false,
          extra: useSsl ? { ssl: { rejectUnauthorized: false } } : undefined,
          entities: [
            Brand,
            User,
            SiteSettings,
            Content,
            BrandCoupon,
            AllCoupon,
            BrandFeed,
            CardsFeed,
            CreditCardCategory,
            Bank,
            Tag,
          ]
        };
      },
    }),
    AuthModule,
    BrandsModule,
    UsersModule,
    SettingsModule,
    ContentModule,
    BrandCouponsModule,
    CouponsModule,
    BrandFeedsModule,
    CardsFeedsModule,
    CreditCardCategoriesModule,
    BanksModule,
    TagsModule,
    PublicApisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

