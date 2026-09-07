export const POSTS_PAGE_SIZE = 10;

export function nextPostsPage(
  fetchedCount: number,
  currentPage: number,
  pageSize = POSTS_PAGE_SIZE,
): number | undefined {
  if (fetchedCount < pageSize) {
    return undefined;
  }

  return currentPage + 1;
}
