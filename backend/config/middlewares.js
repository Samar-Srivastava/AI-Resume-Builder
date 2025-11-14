module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    // Use the security middleware to explicitly configure CORS
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
            // Add your Vercel domain to image sources if needed for content loading
            'https://ai-resume-builder-snowy-xi.vercel.app', 
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
          ],
          upgradeInsecureRequests: null, // Allow HTTP connections locally
        },
      },
    },
  },
  {
    // Configure CORS explicitly to allow your frontend domain
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: ['https://ai-resume-builder-snowy-xi.vercel.app', 'http://localhost:5173'], // Add your Vercel URL here!
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      // Credentials true is often required for auth tokens (Clerk integration)
      // credentials: true, 
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];