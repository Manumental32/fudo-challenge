import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Post } from '../../types';
import { prependPostToCache, type PostsCache } from './posts.cache';

function post(partial: Partial<Post> & Pick<Post, 'id'>): Post {
  return {
    createdAt: '2026-09-05T00:00:00.000Z',
    name: 'Ana',
    avatar: '',
    content: 'texto',
    title: 'Título',
    ...partial,
  };
}

function cacheWith(posts: Post[]): PostsCache {
  return {
    pages: [{ posts, page: 1, hasMore: false }],
    pageParams: [1],
  };
}

describe('prependPostToCache', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('puts a created post at the top of the first page', () => {
    const existing = post({ id: '1', title: 'Viejo' });
    const created = post({ id: '2', title: 'Nuevo' });
    const next = prependPostToCache(cacheWith([existing]), created);

    expect(next.pages[0]?.posts.map((item) => item.id)).toEqual(['2', '1']);
  });

  it('does not duplicate a post already in cache', () => {
    const existing = post({ id: '1' });
    const next = prependPostToCache(cacheWith([existing]), existing);

    expect(next.pages[0]?.posts).toHaveLength(1);
  });
});
