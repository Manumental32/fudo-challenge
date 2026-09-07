import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postKeys } from '../postKeys';
import { createPost } from '../posts.api';
import { prependPostToCache, type PostsCache } from '../posts.cache';

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: (created) => {
      queryClient.setQueryData<PostsCache>(postKeys.all, (current) =>
        prependPostToCache(current, created),
      );
      queryClient.setQueryData(postKeys.detail(created.id), created);
    },
  });
}