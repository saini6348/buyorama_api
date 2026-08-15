import { createApp } from './app.bootstrap';

async function bootstrap() {
  try {
    const app = await createApp();
    const port = Number(process.env.PORT) || 3011;
    // Bind to all interfaces so Vercel (and the default container port) can
    // reach the server. Vercel sets the PORT env var at runtime.
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Buyorama API is running on port ${port}`);
  } catch (error: any) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

bootstrap();

