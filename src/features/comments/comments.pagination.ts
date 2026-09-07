export const COMMENTS_PAGE_SIZE = 8;

export function nextCommentsPage(
  fetchedCount: number,
  currentPage: number,
  pageSize = COMMENTS_PAGE_SIZE,
): number | undefined {
  if (fetchedCount < pageSize) {
    return undefined;
  }

  return currentPage + 1;
}
