import { afterEach, describe, expect, it, vi } from 'vitest';
import { isRichTextEmpty, toDisplayHtml } from './richText';

describe('richText', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('treats empty editor markup as empty', () => {
    expect(isRichTextEmpty('<p></p>')).toBe(true);
    expect(isRichTextEmpty('<p><br></p>')).toBe(true);
    expect(isRichTextEmpty('<p>Hola</p>')).toBe(false);
  });

  it('keeps plain text readable and wraps it in paragraphs', () => {
    expect(toDisplayHtml('Hola\nmundo')).toContain('Hola');
    expect(toDisplayHtml('Hola\nmundo')).toContain('<p>');
  });

  it('strips unsafe HTML from a post body', () => {
    const html = toDisplayHtml('<p>ok</p><script>alert(1)</script>');

    expect(html).toContain('ok');
    expect(html.toLowerCase()).not.toContain('script');
  });
});
