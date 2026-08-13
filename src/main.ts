import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/http-exception.filter';

async function bootstrap() {
  try {
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

    const port = process.env.PORT || 3011;
    await app.listen(port);
    console.log(`🚀 Buyorama API is running on port ${port}`);
  } catch (error) {
    // If database connection fails but the app structure is valid, we still want to listen
    if (error.message && error.message.includes('Unable to connect')) {
      console.error('⚠️  Warning: Database connection failed');
      console.error('Database error:', error.message.split('\n')[0]);
      console.log('ℹ️  Starting server anyway. Database may not be configured correctly.');
      console.log('ℹ️  Please ensure PostgreSQL is running and accessible.');
      console.log('ℹ️  Provide JWT_SECRET and CORS_ORIGINS in .env file.');

      // Create a minimal app that can at least respond to health checks
      const port = process.env.PORT || 3011;
      const express = require('express');
      const app = express();

      app.get('/api/health', (req: any, res: any) => {
        res.json({ status: 'running', database: 'not connected' });
      });

      app.listen(port, () => {
        console.log(`✓ Basic server listening on port ${port}`);
      });
    } else {
      console.error('Fatal error:', error);
      process.exit(1);
    }
  }
}

bootstrap();

