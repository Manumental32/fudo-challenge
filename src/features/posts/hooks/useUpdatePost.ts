import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePost } from '../posts.api';
import { postKeys } from '../postKeys';

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      payload,
    }: {
      postId: string;
      payload: Parameters<typeof updatePost>[1];
    }) => updatePost(postId, payload),
    onSuccess: (post) => {
      void queryClient.invalidateQueries({ queryKey: postKeys.all });
      void queryClient.invalidateQueries({
        queryKey: postKeys.detail(post.id),
      });
    },
  });
}
