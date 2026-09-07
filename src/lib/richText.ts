import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'em',
  'u',
  's',
  'ul',
  'ol',
  'li',
  'a',
  'blockquote',
  'code',
  'pre',
  'h2',
  'h3',
];

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function isRichTextEmpty(html: string): boolean {
  return (
    html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .trim().length === 0
  );
}

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

export function toDisplayHtml(content: string): string {
  const trimmed = content.trim();

  if (!trimmed) {
    return '';
  }

  if (!/<[a-z][\s\S]*>/i.test(trimmed)) {
    const paragraphs = trimmed
      .split('\n')
      .map((line) => `<p>${escapeHtml(line) || '<br>'}</p>`)
      .join('');

    return sanitizeHtml(paragraphs);
  }

  return sanitizeHtml(trimmed);
}
