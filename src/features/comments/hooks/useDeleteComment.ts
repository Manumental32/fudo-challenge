import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../../lib/errors';
import { useToast } from '../../../ui/toastContext';
import { commentKeys } from '../commentKeys';
import {
  dropCommentFromCache,
  type CommentsCache,
} from '../comments.cache';
import { deleteComment } from '../comments.api';

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();
  const { showError } = useToast();

  return useMutation({
    mutationFn: (commentId: string) => deleteComment(postId, commentId),
    onSuccess: (_result, commentId) => {
      queryClient.setQueryData<CommentsCache>(
        commentKeys.byPost(postId),
        (current) => dropCommentFromCache(current, commentId),
      );
    },
    onError: (error) => {
      showError(getErrorMessage(error, 'No se pudo borrar el comentario.'));
    },
  });
}
