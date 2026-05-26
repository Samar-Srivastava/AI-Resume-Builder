import sanitizeHtmlLib from 'sanitize-html';

const HTML_CONFIG = {
  // sanitize-html uses camelCase for config keys
  allowedTags: ['p', 'ul', 'ol', 'li', 'b', 'i', 'strong', 'em', 'br', 'span'],
  // This explicitly strips all attributes, matching your previous ALLOWED_ATTR: []
  allowedAttributes: {}, 
};

export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return sanitizeHtmlLib(html, HTML_CONFIG);
}

/** Sanitize resume payload fields before persisting to Strapi */
export function sanitizeResumePayload(data) {
  if (!data || typeof data !== 'object') return data;

  const sanitized = { ...data };

  if (Array.isArray(sanitized.Experience)) {
    sanitized.Experience = sanitized.Experience.map((exp) => ({
      ...exp,
      workSummery: sanitizeHtml(exp.workSummery),
    }));
  }

  return sanitized;
}