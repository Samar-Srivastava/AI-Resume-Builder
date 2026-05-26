module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    // Required for strapi::session — set APP_KEYS in backend/.env (comma-separated)
    keys: env.array('APP_KEYS', ['toBeModified1', 'toBeModified2']),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
