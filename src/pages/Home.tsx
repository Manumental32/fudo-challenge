import { useDocumentTitle } from '../lib/useDocumentTitle';
import { PostList } from '../features/posts/PostList';

export function HomePage() {
  useDocumentTitle('Feed · Fudo');

  return <PostList />;
}
