import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../src/app.bootstrap';

// Cache the Nest application across warm invocations.
let cachedApp: Awaited<ReturnType<typeof createApp>> | null = null;

async function getApp() {
  if (!cachedApp) {
    cachedApp = await createApp();
  }
  return cachedApp;
}

// Vercel Node.js serverless function — routes every request through Nest.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const app = await getApp();
    app.getHttpAdapter().getInstance()(req, res);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Vercel handler error:', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({ message: 'Internal server error' });
    }
  }
}
