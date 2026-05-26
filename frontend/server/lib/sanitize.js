import DOMPurify from 'isomorphic-dompurify';

const HTML_CONFIG = {
  ALLOWED_TAGS: ['p', 'ul', 'ol', 'li', 'b', 'i', 'strong', 'em', 'br', 'span'],
  ALLOWED_ATTR: [],
};

export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, HTML_CONFIG);
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
