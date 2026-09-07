import type { Comment } from '../../types';

interface CommentRecord extends Comment {
  postId?: string;
  children?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeParentId(value: unknown): Comment['parentId'] {
  if (value === null || value === undefined || value === '' || value === 'null') {
    return null;
  }

  return String(value);
}

function parseComment(value: unknown): CommentRecord | null {
  if (!isRecord(value) || typeof value.id !== 'string') {
    return null;
  }

  return {
    id: value.id,
    createdAt:
      typeof value.createdAt === 'string'
        ? value.createdAt
        : new Date().toISOString(),
    name: typeof value.name === 'string' ? value.name : 'Anónimo',
    avatar: typeof value.avatar === 'string' ? value.avatar : '',
    content: typeof value.content === 'string' ? value.content : '',
    parentId: normalizeParentId(value.parentId),
    postId: typeof value.postId === 'string' ? value.postId : undefined,
    children: value.children,
  };
}

export function flattenComments(
  payload: unknown,
  postId?: string,
): Comment[] {
  const result: Comment[] = [];
  const seen = new Set<string>();

  function visit(node: unknown): void {
    if (Array.isArray(node)) {
      for (const item of node) {
        visit(item);
      }
      return;
    }

    const comment = parseComment(node);

    if (!comment) {
      return;
    }

    const matchesPost = !postId || !comment.postId || comment.postId === postId;

    if (matchesPost && !seen.has(comment.id)) {
      seen.add(comment.id);
      result.push({
        id: comment.id,
        createdAt: comment.createdAt,
        name: comment.name,
        avatar: comment.avatar,
        content: comment.content,
        parentId: comment.parentId,
      });
    }

    visit(comment.children);
  }

  visit(payload);
  return result;
}
