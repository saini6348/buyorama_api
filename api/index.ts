import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from '../src/app.bootstrap';

// Cache the Nest application across warm invocations.
let cachedApp: Awaited<ReturnType<typeof createApp>> | null = null;

async function getApp() {
  if (!cachedApp) {
    cachedApp = await createApp();
  }
  return cachedApp;
}

// Vercel Node.js serverless handler — routes every request through Nest.
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const app = await getApp();
    app.getHttpAdapter().getInstance()(req, res);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Vercel handler error:', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ message: 'Internal server error' }));
    }
  }
}
