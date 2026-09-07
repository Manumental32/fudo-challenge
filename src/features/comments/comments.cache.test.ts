import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Comment } from '../../types';
import {
  appendCommentToCache,
  dropCommentFromCache,
  patchCommentInCache,
  type CommentsCache,
} from './comments.cache';

function comment(partial: Partial<Comment> & Pick<Comment, 'id'>): Comment {
  return {
    createdAt: '2026-01-01T00:00:00.000Z',
    name: 'User',
    avatar: '',
    content: '',
    parentId: null,
    ...partial,
  };
}

function cacheWith(comments: Comment[]): CommentsCache {
  return {
    pages: [{ comments, page: 1, hasMore: false }],
    pageParams: [1],
  };
}

describe('comments cache', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('seeds the first page when appending without cache', () => {
    const created = comment({ id: '1', content: 'hola' });
    const next = appendCommentToCache(undefined, created);

    expect(next.pages[0]?.comments).toEqual([created]);
    expect(next.pageParams).toEqual([1]);
  });

  it('appends a created comment to the first page', () => {
    const existing = comment({ id: '1', content: 'antes' });
    const created = comment({ id: '2', content: 'nuevo' });
    const next = appendCommentToCache(cacheWith([existing]), created);

    expect(next.pages[0]?.comments.map((item) => item.id)).toEqual(['1', '2']);
  });

  it('does not duplicate a comment already in cache', () => {
    const existing = comment({ id: '1', content: 'hola' });
    const next = appendCommentToCache(cacheWith([existing]), existing);

    expect(next.pages[0]?.comments).toHaveLength(1);
  });

  it('patches a comment in place', () => {
    const existing = comment({ id: '1', content: 'antes' });
    const next = patchCommentInCache(
      cacheWith([existing]),
      comment({ id: '1', content: 'después' }),
    );

    expect(next?.pages[0]?.comments[0]?.content).toBe('después');
  });

  it('removes a comment from cache', () => {
    const existing = comment({ id: '1', content: 'hola' });
    const next = dropCommentFromCache(cacheWith([existing]), '1');

    expect(next?.pages[0]?.comments).toEqual([]);
  });
});
