export const postKeys = {
  all: ['posts'] as const,
  detail: (postId: string) => ['posts', postId] as const,
};
