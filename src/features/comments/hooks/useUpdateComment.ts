import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '../../../lib/errors';
import { useToast } from '../../../ui/toastContext';
import { commentKeys } from '../commentKeys';
import {
  patchCommentInCache,
  type CommentsCache,
} from '../comments.cache';
import { updateComment } from '../comments.api';

export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient();
  const { showError } = useToast();

  return useMutation({
    mutationFn: ({
      commentId,
      payload,
    }: {
      commentId: string;
      payload: Parameters<typeof updateComment>[2];
    }) => updateComment(postId, commentId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData<CommentsCache>(
        commentKeys.byPost(postId),
        (current) => patchCommentInCache(current, updated),
      );
    },
    onError: (error) => {
      showError(getErrorMessage(error, 'No se pudo guardar el comentario.'));
    },
  });
}
