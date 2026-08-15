import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createApp } from '../src/app.bootstrap';

// Cache the Nest app across warm invocations for lower latency.
let cachedApp: Awaited<ReturnType<typeof createApp>> | null = null;

async function getApp() {
  if (!cachedApp) {
    cachedApp = await createApp();
  }
  return cachedApp;
}

// Vercel Node.js serverless handler — routes every request through Nest
// using the Express adapter. This is the required exported handler that
// @vercel/node looks for (unlike src/main.ts which calls app.listen()).
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
