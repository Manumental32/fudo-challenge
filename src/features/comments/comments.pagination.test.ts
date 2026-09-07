import { afterEach, describe, expect, it, vi } from 'vitest';
import { COMMENTS_PAGE_SIZE, nextCommentsPage } from './comments.pagination';

describe('nextCommentsPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns undefined when the page is shorter than the page size', () => {
    expect(nextCommentsPage(3, 1, COMMENTS_PAGE_SIZE)).toBeUndefined();
  });

  it('returns the next page when the current page is full', () => {
    expect(nextCommentsPage(COMMENTS_PAGE_SIZE, 1)).toBe(2);
    expect(nextCommentsPage(COMMENTS_PAGE_SIZE, 2)).toBe(3);
  });
});
