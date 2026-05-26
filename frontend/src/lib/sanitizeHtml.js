import sanitizeHtmlLib from 'sanitize-html';

const HTML_CONFIG = {
  allowedTags: ['p', 'ul', 'ol', 'li', 'b', 'i', 'strong', 'em', 'br', 'span'],
  allowedAttributes: {},
};

export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return sanitizeHtmlLib(html, HTML_CONFIG);
}