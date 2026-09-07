import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Comment } from '../../types';
import { buildCommentTree } from './buildCommentTree';

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

describe('buildCommentTree', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns an empty list when there are no comments', () => {
    expect(buildCommentTree([])).toEqual([]);
  });

  it('keeps top-level comments as roots in input order', () => {
    const comments = [
      comment({ id: 'a', content: 'first' }),
      comment({ id: 'b', content: 'second' }),
    ];

    const tree = buildCommentTree(comments);

    expect(tree.map((node) => node.id)).toEqual(['a', 'b']);
    expect(tree[0]?.children).toEqual([]);
    expect(tree[1]?.children).toEqual([]);
  });

  it('nests replies under their parent', () => {
    const comments = [
      comment({ id: 'root', content: 'post reply' }),
      comment({ id: 'child', content: 'nested', parentId: 'root' }),
    ];

    const tree = buildCommentTree(comments);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.id).toBe('root');
    expect(tree[0]?.children).toHaveLength(1);
    expect(tree[0]?.children[0]?.id).toBe('child');
    expect(tree[0]?.children[0]?.children).toEqual([]);
  });

  it('builds multiple nesting levels', () => {
    const comments = [
      comment({ id: '1' }),
      comment({ id: '2', parentId: '1' }),
      comment({ id: '3', parentId: '2' }),
    ];

    const tree = buildCommentTree(comments);

    expect(tree[0]?.children[0]?.children[0]?.id).toBe('3');
  });

  it('treats an empty parentId as a root comment', () => {
    const comments = [comment({ id: 'root', parentId: '' })];

    expect(buildCommentTree(comments)[0]?.id).toBe('root');
    expect(buildCommentTree(comments)[0]?.children).toEqual([]);
  });

  it('treats comments with a missing parent as roots', () => {
    const comments = [
      comment({ id: 'orphan', parentId: 'missing' }),
      comment({ id: 'root' }),
    ];

    const tree = buildCommentTree(comments);

    expect(tree.map((node) => node.id)).toEqual(['orphan', 'root']);
  });

  it('attaches children even when the parent appears later in the list', () => {
    const comments = [
      comment({ id: 'child', parentId: 'parent' }),
      comment({ id: 'parent' }),
    ];

    const tree = buildCommentTree(comments);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.id).toBe('parent');
    expect(tree[0]?.children[0]?.id).toBe('child');
  });
});
