module.exports = [
  'strapi::logger',
  'strapi::errors',

  {
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
            'https://ai-resume-builder-snowy-xi.vercel.app',
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
    },
  },

  {
    name: 'strapi::cors',
    config: {
      headers: '*',
      origin: [
        'https://ai-resume-builder-snowy-xi.vercel.app',
        'http://localhost:5173',
        'http://localhost:1337',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    },
  },

  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
