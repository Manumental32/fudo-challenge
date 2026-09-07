import { APP_NAME } from '../lib/brand';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { PostList } from '../features/posts/PostList';

export function HomePage() {
  useDocumentTitle(`Feed · ${APP_NAME}`);

  return <PostList />;
}
