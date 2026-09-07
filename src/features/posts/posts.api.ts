import { http } from '../../lib/http';
import type { Post } from '../../types';
import { POSTS_PAGE_SIZE, nextPostsPage } from './posts.pagination';

const POSTS_PATH = '/post';

export interface PostsPage {
  posts: Post[];
  page: number;
  hasMore: boolean;
}

export async function getPostsPage(page: number): Promise<PostsPage> {
  const { data } = await http.get<Post[]>(POSTS_PATH, {
    params: {
      page,
      limit: POSTS_PAGE_SIZE,
      sortBy: 'id',
      order: 'desc',
    },
  });
  const posts = Array.isArray(data) ? data : [];

  return {
    posts,
    page,
    hasMore: nextPostsPage(posts.length, page) !== undefined,
  };
}

export async function getPost(postId: string): Promise<Post> {
  const { data } = await http.get<Post>(`${POSTS_PATH}/${postId}`);
  return data;
}

export async function createPost(payload: Partial<Post>): Promise<Post> {
  const createdAt = payload.createdAt ?? new Date().toISOString();
  const { data } = await http.post<Post>(POSTS_PATH, {
    ...payload,
    createdAt,
  });

  return { ...data, createdAt };
}

export async function updatePost(
  postId: string,
  payload: Partial<Post>,
): Promise<Post> {
  const { data } = await http.put<Post>(`${POSTS_PATH}/${postId}`, payload);
  return data;
}

export async function deletePost(postId: string): Promise<void> {
  await http.delete(`${POSTS_PATH}/${postId}`);
}
