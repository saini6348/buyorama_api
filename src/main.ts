import { createApp } from './app.bootstrap';

async function bootstrap() {
  try {
    const app = await createApp();
    const port = process.env.PORT || 3011;
    await app.listen(port);
    console.log(`🚀 Buyorama API is running on port ${port}`);
  } catch (error: any) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

bootstrap();

