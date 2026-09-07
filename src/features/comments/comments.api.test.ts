import axios, { AxiosError } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { http } from '../../lib/http';
import { createComment, deleteComment } from './comments.api';

vi.mock('../../lib/http', () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedHttp = vi.mocked(http);

function quotaError(): AxiosError {
  const error = new AxiosError('Request failed');
  error.response = {
    data: 'Max number of elements reached for this resource',
    status: 400,
    statusText: 'Bad Request',
    headers: {},
    config: { headers: new axios.AxiosHeaders() },
  };

  return error;
}

describe('createComment', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('returns the remote comment when the POST succeeds', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-05T04:00:00.000Z'));
    mockedHttp.post.mockResolvedValue({
      data: {
        id: '200',
        createdAt: '2026-09-04T12:00:00.000Z',
        name: 'Ana',
        avatar: '',
        content: 'hola',
        parentId: null,
        postId: '4',
      },
    });

    const created = await createComment('4', {
      name: 'Ana',
      avatar: '',
      content: 'hola',
      parentId: null,
    });

    expect(created.id).toBe('200');
    expect(created.createdAt).toBe('2026-09-05T04:00:00.000Z');
    expect(mockedHttp.post).toHaveBeenCalledWith('/comment', {
      name: 'Ana',
      avatar: '',
      content: 'hola',
      postId: '4',
      parentId: null,
      createdAt: '2026-09-05T04:00:00.000Z',
    });
    vi.useRealTimers();
  });

  it('throws when MockAPI rejects the create', async () => {
    mockedHttp.post.mockRejectedValue(quotaError());

    await expect(
      createComment('4', {
        name: 'Ana',
        avatar: '',
        content: 'hola',
        parentId: null,
      }),
    ).rejects.toBeInstanceOf(AxiosError);
    expect(mockedHttp.delete).not.toHaveBeenCalled();
  });
});

describe('deleteComment', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('deletes through the nested post comment path', async () => {
    mockedHttp.delete.mockResolvedValue({ data: {} });

    await deleteComment('3', '62');

    expect(mockedHttp.delete).toHaveBeenCalledWith('/post/3/comment/62');
  });
});
