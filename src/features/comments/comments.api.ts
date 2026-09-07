import { isAxiosError } from 'axios';
import { http } from '../../lib/http';
import type { Comment } from '../../types';
import { COMMENTS_PAGE_SIZE, nextCommentsPage } from './comments.pagination';
import { flattenComments } from './flattenComments';

export interface CommentsPage {
  comments: Comment[];
  page: number;
  hasMore: boolean;
}

function rawItemCount(payload: unknown): number {
  if (Array.isArray(payload)) {
    return payload.length;
  }

  return payload === null || payload === undefined ? 0 : 1;
}

export async function getCommentsPage(
  postId: string,
  page: number,
): Promise<CommentsPage> {
  try {
    const { data } = await http.get<unknown>('/comment', {
      params: {
        postId,
        page,
        limit: COMMENTS_PAGE_SIZE,
      },
    });
    const comments = flattenComments(data, postId);

    return {
      comments,
      page,
      hasMore: nextCommentsPage(rawItemCount(data), page) !== undefined,
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return {
        comments: [],
        page,
        hasMore: false,
      };
    }

    throw error;
  }
}

export async function createComment(
  postId: string,
  payload: Partial<Comment>,
): Promise<Comment> {
  const createdAt = payload.createdAt ?? new Date().toISOString();
  const { data } = await http.post<unknown>('/comment', {
    name: payload.name,
    avatar: payload.avatar,
    content: payload.content,
    postId,
    parentId: payload.parentId ?? null,
    createdAt,
  });
  const [created] = flattenComments(data, postId);

  if (!created) {
    throw new Error('No se pudo publicar el comentario.');
  }

  return { ...created, createdAt };
}

export async function updateComment(
  postId: string,
  commentId: string,
  payload: Partial<Comment>,
): Promise<Comment> {
  const { data } = await http.put<unknown>(`/comment/${commentId}`, {
    ...payload,
    postId,
  });
  const [updated] = flattenComments(data, postId);

  if (!updated) {
    throw new Error('No se pudo guardar el comentario.');
  }

  return updated;
}

export async function deleteComment(
  postId: string,
  commentId: string,
): Promise<void> {
  await http.delete(`/post/${postId}/comment/${commentId}`);
}
