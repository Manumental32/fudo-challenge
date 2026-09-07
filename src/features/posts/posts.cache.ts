import type { InfiniteData } from '@tanstack/react-query';
import type { Post } from '../../types';
import type { PostsPage } from './posts.api';

export type PostsCache = InfiniteData<PostsPage, number>;

function emptyCache(): PostsCache {
  return {
    pages: [{ posts: [], page: 1, hasMore: false }],
    pageParams: [1],
  };
}

export function prependPostToCache(
  cache: PostsCache | undefined,
  post: Post,
): PostsCache {
  const current = cache ?? emptyCache();
  const alreadyListed = current.pages.some((page) =>
    page.posts.some((item) => item.id === post.id),
  );

  if (alreadyListed) {
    return current;
  }

  const [first, ...rest] = current.pages;

  if (!first) {
    return {
      pages: [{ posts: [post], page: 1, hasMore: false }],
      pageParams: [1],
    };
  }

  return {
    ...current,
    pages: [{ ...first, posts: [post, ...first.posts] }, ...rest],
  };
}
