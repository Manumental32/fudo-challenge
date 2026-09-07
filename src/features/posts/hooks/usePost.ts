import {
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from '@tanstack/react-query';
import { getPost, type PostsPage } from '../posts.api';
import { postKeys } from '../postKeys';

function postFromListCache(queryClient: QueryClient, postId: string) {
  const cached = queryClient.getQueryData<InfiniteData<PostsPage>>(
    postKeys.all,
  );

  return cached?.pages
    .flatMap((page) => page.posts)
    .find((post) => post.id === postId);
}

export function usePost(postId: string) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPost(postId),
    enabled: postId.length > 0,
    placeholderData: () => postFromListCache(queryClient, postId),
  });
}

export function usePrefetchPost() {
  const queryClient = useQueryClient();

  return (postId: string) => {
    void queryClient.prefetchQuery({
      queryKey: postKeys.detail(postId),
      queryFn: () => getPost(postId),
    });
  };
}
