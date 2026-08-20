import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CommonModule,
    // Rate limiting (M-03)
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 30, // 30 requests per minute
      },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        // AWS RDS / standalone PostgreSQL only.
        // Uses discrete DB_* vars (DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD)
        // from .env, unless a connection string (DATABASE_URL) is provided.
        const connectionString =
          process.env.DATABASE_URL || process.env.POSTGRES_URL_NON_POOLING;

        const base: Record<string, unknown> = connectionString
          ? { url: connectionString }
          : {
              host: process.env.DB_HOST,
              port: parseInt(process.env.DB_PORT || '5432', 10),
              username: process.env.DB_USERNAME,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME || 'buyorama',
            };

        const useSsl = process.env.DB_SSL === 'true';

        return {
          type: 'postgres',
          ...base,
          // Set via `extra` too: when a connection string carries its own
          // sslmode (e.g. Supabase's `?sslmode=require`), pg's own parsing
          // takes precedence over the top-level `ssl` option and forces full
          // certificate verification, which fails against self-signed/managed
          // Postgres certs. `extra.ssl` is applied last and wins.
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
          ],
          synchronize: true,
          logging: false,
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

