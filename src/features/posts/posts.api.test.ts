import { afterEach, describe, expect, it, vi } from 'vitest';
import { http } from '../../lib/http';
import { getPostsPage } from './posts.api';

vi.mock('../../lib/http', () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedHttp = vi.mocked(http);

describe('getPostsPage', () => {
  afterEach(() => {
    delete window.__FUDO_POSTS_PREFETCH;
    vi.clearAllMocks();
  });

  it('uses the HTML prefetch for the first page', async () => {
    window.__FUDO_POSTS_PREFETCH = Promise.resolve(
      new Response(
        JSON.stringify([
          {
            id: '1',
            title: 'Hola',
            content: 'Texto',
            name: 'Ana',
            avatar: '',
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        ]),
        { status: 200 },
      ),
    );

    const page = await getPostsPage(1);

    expect(page.posts).toHaveLength(1);
    expect(page.posts[0]?.title).toBe('Hola');
    expect(mockedHttp.get).not.toHaveBeenCalled();
  });

  it('falls back to the API when the prefetch fails', async () => {
    window.__FUDO_POSTS_PREFETCH = Promise.resolve(
      new Response('no', { status: 500 }),
    );
    mockedHttp.get.mockResolvedValue({
      data: [
        {
          id: '2',
          title: 'Otro',
          content: 'Texto',
          name: 'Ana',
          avatar: '',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ],
    });

    const page = await getPostsPage(1);

    expect(page.posts[0]?.title).toBe('Otro');
    expect(mockedHttp.get).toHaveBeenCalledOnce();
  });
});
