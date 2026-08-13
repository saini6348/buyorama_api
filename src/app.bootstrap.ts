import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/http-exception.filter';

/**
 * Builds (and configures) the Nest application without calling listen().
 * Shared between the local dev entrypoint (src/main.ts) and the Vercel
 * serverless handler (api/index.ts) so both behave identically.
 */
export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  // Security headers (L-01: Helmet for security headers)
  app.use(helmet());

  // CORS: restrict to configured origins only (H-04)
  const allowedOrigins = (
    process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:3000'
  )
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server, etc. but requires auth token)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe (M-02: strip unknown fields, prevent mass assignment)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Global exception filter (L-01: no error details leaked to client)
  app.useGlobalFilters(new AllExceptionsFilter());

  app.init();
  return app;
}
