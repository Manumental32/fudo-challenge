import type { InfiniteData } from '@tanstack/react-query';
import type { Comment } from '../../types';
import type { CommentsPage } from './comments.api';

export type CommentsCache = InfiniteData<CommentsPage, number>;

function emptyCache(): CommentsCache {
  return {
    pages: [{ comments: [], page: 1, hasMore: false }],
    pageParams: [1],
  };
}

export function appendCommentToCache(
  cache: CommentsCache | undefined,
  comment: Comment,
): CommentsCache {
  const current = cache ?? emptyCache();
  const alreadyListed = current.pages.some((page) =>
    page.comments.some((item) => item.id === comment.id),
  );

  if (alreadyListed) {
    return current;
  }

  const [first, ...rest] = current.pages;

  if (!first) {
    return {
      pages: [{ comments: [comment], page: 1, hasMore: false }],
      pageParams: [1],
    };
  }

  return {
    ...current,
    pages: [{ ...first, comments: [...first.comments, comment] }, ...rest],
  };
}

export function patchCommentInCache(
  cache: CommentsCache | undefined,
  comment: Comment,
): CommentsCache | undefined {
  if (!cache) {
    return cache;
  }

  return {
    ...cache,
    pages: cache.pages.map((page) => ({
      ...page,
      comments: page.comments.map((item) =>
        item.id === comment.id ? { ...item, ...comment } : item,
      ),
    })),
  };
}

export function dropCommentFromCache(
  cache: CommentsCache | undefined,
  commentId: string,
): CommentsCache | undefined {
  if (!cache) {
    return cache;
  }

  return {
    ...cache,
    pages: cache.pages.map((page) => ({
      ...page,
      comments: page.comments.filter((item) => item.id !== commentId),
    })),
  };
}
