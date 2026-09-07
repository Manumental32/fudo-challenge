import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Comment } from '../../types';
import { commentsToTree } from './comments.order';

function comment(partial: Partial<Comment> & Pick<Comment, 'id'>): Comment {
  return {
    createdAt: '2026-01-01T00:00:00.000Z',
    name: 'User',
    avatar: '',
    content: '',
    parentId: null,
    ...partial,
  };
}

describe('commentsToTree', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('puts the newest root comment first', () => {
    const tree = commentsToTree([
      comment({
        id: 'old',
        content: 'antes',
        createdAt: '2026-01-01T00:00:00.000Z',
      }),
      comment({
        id: 'new',
        content: 'ahora',
        createdAt: '2026-09-05T00:00:00.000Z',
      }),
    ]);

    expect(tree.map((node) => node.id)).toEqual(['new', 'old']);
  });

  it('keeps replies in chronological order under their parent', () => {
    const tree = commentsToTree([
      comment({
        id: 'root',
        createdAt: '2026-01-01T00:00:00.000Z',
      }),
      comment({
        id: 'later',
        parentId: 'root',
        createdAt: '2026-01-03T00:00:00.000Z',
      }),
      comment({
        id: 'earlier',
        parentId: 'root',
        createdAt: '2026-01-02T00:00:00.000Z',
      }),
    ]);

    expect(tree[0]?.children.map((node) => node.id)).toEqual([
      'earlier',
      'later',
    ]);
  });
});
