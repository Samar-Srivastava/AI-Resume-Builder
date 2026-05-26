import { handleRequest } from './handleRequest.js';

/** Vite dev server middleware — serves /api/* with the same handlers as production */
export function devApiMiddleware() {
  return async (req, res, next) => {
    if (!req.url?.startsWith('/api')) {
      next();
      return;
    }

    try {
      await handleRequest(req, res);
    } catch (err) {
      console.error('[dev-api]', err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    }
  };
}
