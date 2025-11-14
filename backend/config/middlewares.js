module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    // CONSOLIDATED BLOCK: This single block handles ALL security, including CORS and CSP.
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            'https://ai-resume-builder-snowy-xi.vercel.app', // Vercel for Images
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
      // === CRITICAL FIX: CORS SETTINGS GO HERE ===
      cors: {
        enabled: true,
        headers: '*',
        origin: ['https://ai-resume-builder-snowy-xi.vercel.app', 'http://localhost:5173'], // Explicitly allow Vercel and local
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        // credentials: true, // Enable this if using auth headers that require credentials
      },
    },
  },
  // 'strapi::cors', <--- REMOVED: CORS is now handled by strapi::security
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];