import type { Comment, CommentNode } from '../../types';

export function buildCommentTree(comments: Comment[]): CommentNode[] {
  const nodes = new Map<string, CommentNode>();

  for (const comment of comments) {
    nodes.set(comment.id, { ...comment, children: [] });
  }

  const roots: CommentNode[] = [];

  for (const comment of comments) {
    const node = nodes.get(comment.id);

    if (!node) {
      continue;
    }

    const parentId = comment.parentId;
    const parent =
      parentId === null || parentId === ''
        ? undefined
        : nodes.get(parentId);

    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
