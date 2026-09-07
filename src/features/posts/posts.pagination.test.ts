import { afterEach, describe, expect, it, vi } from 'vitest';
import { POSTS_PAGE_SIZE, nextPostsPage } from './posts.pagination';

describe('nextPostsPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('stops when the page is incomplete', () => {
    expect(nextPostsPage(4, 1, POSTS_PAGE_SIZE)).toBeUndefined();
  });

  it('continues when the page is full', () => {
    expect(nextPostsPage(POSTS_PAGE_SIZE, 1)).toBe(2);
    expect(nextPostsPage(POSTS_PAGE_SIZE, 3)).toBe(4);
  });
});
