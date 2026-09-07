import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePost } from '../posts.api';
import { postKeys } from '../postKeys';

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_data, postId) => {
      void queryClient.invalidateQueries({ queryKey: postKeys.all });
      void queryClient.removeQueries({ queryKey: postKeys.detail(postId) });
    },
  });
}
