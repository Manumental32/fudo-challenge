import { useInfiniteQuery } from '@tanstack/react-query';
import { getPostsPage } from '../posts.api';
import { postKeys } from '../postKeys';

export function usePosts() {
  return useInfiniteQuery({
    queryKey: postKeys.all,
    queryFn: ({ pageParam }) => getPostsPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
