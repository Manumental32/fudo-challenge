import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { commentKeys } from '../commentKeys';
import { getCommentsPage } from '../comments.api';
import { commentsToTree } from '../comments.order';
import type { Comment } from '../../../types';

function uniqueComments(comments: Comment[]): Comment[] {
  const seen = new Set<string>();
  const result: Comment[] = [];

  for (const comment of comments) {
    if (seen.has(comment.id)) {
      continue;
    }

    seen.add(comment.id);
    result.push(comment);
  }

  return result;
}

export function useComments(postId: string) {
  const query = useInfiniteQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: ({ pageParam }) => getCommentsPage(postId, pageParam),
    initialPageParam: 1,
    enabled: postId.length > 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });

  const tree = useMemo(() => {
    const pages = query.data?.pages ?? [];
    const merged = uniqueComments(pages.flatMap((page) => page.comments));
    return commentsToTree(merged);
  }, [query.data]);

  return { ...query, tree };
}
