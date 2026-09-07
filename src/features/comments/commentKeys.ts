export const commentKeys = {
  byPost: (postId: string) => ['posts', postId, 'comments'] as const,
};
