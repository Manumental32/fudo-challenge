import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../../lib/errors';
import { useToast } from '../../../ui/toastContext';
import { commentKeys } from '../commentKeys';
import {
  appendCommentToCache,
  type CommentsCache,
} from '../comments.cache';
import { createComment } from '../comments.api';

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  const { showError } = useToast();

  return useMutation({
    mutationFn: (payload: Parameters<typeof createComment>[1]) =>
      createComment(postId, payload),
    onSuccess: (created) => {
      queryClient.setQueryData<CommentsCache>(
        commentKeys.byPost(postId),
        (current) => appendCommentToCache(current, created),
      );
    },
    onError: (error) => {
      showError(
        getErrorMessage(error, 'No se pudo publicar el comentario.'),
      );
    },
  });
}
