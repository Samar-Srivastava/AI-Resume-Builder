import DOMPurify from 'isomorphic-dompurify';

const HTML_CONFIG = {
  ALLOWED_TAGS: ['p', 'ul', 'ol', 'li', 'b', 'i', 'strong', 'em', 'br', 'span'],
  ALLOWED_ATTR: [],
};

export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return DOMPurify.sanitize(html, HTML_CONFIG);
}
