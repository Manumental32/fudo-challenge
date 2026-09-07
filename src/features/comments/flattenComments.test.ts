import { afterEach, describe, expect, it, vi } from 'vitest';
import { flattenComments } from './flattenComments';

describe('flattenComments', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns an empty list for invalid payloads', () => {
    expect(flattenComments(null)).toEqual([]);
    expect(flattenComments({})).toEqual([]);
  });

  it('flattens nested children and drops duplicates', () => {
    const payload = [
      {
        id: '1',
        name: 'Ana',
        avatar: '',
        content: 'root',
        parentId: null,
        postId: '3',
        createdAt: '2026-01-01T00:00:00.000Z',
        children: [
          {
            id: '2',
            name: 'Beto',
            avatar: '',
            content: 'reply',
            parentId: '1',
            postId: '3',
            createdAt: '2026-01-01T01:00:00.000Z',
            children: [],
          },
        ],
      },
      {
        id: '2',
        name: 'Beto',
        avatar: '',
        content: 'reply',
        parentId: '1',
        postId: '3',
        createdAt: '2026-01-01T01:00:00.000Z',
        children: [],
      },
    ];

    const flat = flattenComments(payload, '3');

    expect(flat.map((comment) => comment.id)).toEqual(['1', '2']);
    expect(flat[1]?.parentId).toBe('1');
    expect(flat[0]).not.toHaveProperty('children');
  });

  it('filters by postId and treats empty parentId as null', () => {
    const payload = [
      {
        id: 'a',
        name: 'A',
        avatar: '',
        content: 'mine',
        parentId: '',
        postId: '10',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'b',
        name: 'B',
        avatar: '',
        content: 'other',
        parentId: null,
        postId: '99',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ];

    const flat = flattenComments(payload, '10');

    expect(flat).toHaveLength(1);
    expect(flat[0]?.id).toBe('a');
    expect(flat[0]?.parentId).toBeNull();
  });
});
