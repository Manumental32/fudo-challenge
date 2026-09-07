import type { Comment, CommentNode } from '../../types';
import { buildCommentTree } from './buildCommentTree';

export function commentsToTree(comments: Comment[]): CommentNode[] {
  const chronological = [...comments].sort(
    (left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt),
  );

  return [...buildCommentTree(chronological)].reverse();
}
