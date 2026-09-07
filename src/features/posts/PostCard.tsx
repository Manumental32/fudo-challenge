import { Link } from 'react-router-dom';
import { isOwnAuthor, useCurrentAuthor } from '../../lib/author';
import { formatDate } from '../../lib/dates';
import type { Post } from '../../types';
import { Avatar } from '../../ui/Avatar';
import { Button } from '../../ui/Button';
import { Skeleton } from '../../ui/Skeleton';
import { PostBody } from './PostBody';
import { usePrefetchPost } from './hooks/usePost';

interface PostCardProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

export function PostCard({ post, onEdit, onDelete }: PostCardProps) {
  const currentAuthor = useCurrentAuthor();
  const canModerate = isOwnAuthor(post.name, currentAuthor);
  const prefetchPost = usePrefetchPost();

  return (
    <article className="overflow-hidden rounded border border-line bg-white hover:border-muted">
      <div className="min-w-0 px-3 py-2 sm:px-4">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <Avatar name={post.name} src={post.avatar} size="sm" />
          <span className="font-bold text-ink">u/{post.name}</span>
          <span aria-hidden="true">•</span>
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        </div>
        <h2 className="mt-1 text-base font-extrabold leading-snug text-ink sm:text-lg">
          <Link
            to={`/posts/${post.id}`}
            className="hover:underline"
            onFocus={() => prefetchPost(post.id)}
            onMouseEnter={() => prefetchPost(post.id)}
          >
            {post.title}
          </Link>
        </h2>
        <div className="mt-1">
          <PostBody content={post.content} />
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1">
          <Link
            to={`/posts/${post.id}`}
            className="inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-bold text-muted hover:bg-sage hover:text-ink"
            aria-label={`Comentarios de ${post.title}`}
          >
            Comentarios
          </Link>
          {canModerate ? (
            <>
              <Button variant="ghost" className="text-xs" onClick={() => onEdit(post)}>
                Editar
              </Button>
              <Button
                variant="ghost"
                className="text-xs"
                onClick={() => onDelete(post)}
              >
                Borrar
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <article className="overflow-hidden rounded border border-line bg-white">
      <div className="min-w-0 px-3 py-2 sm:px-4">
        <div className="flex items-center gap-1.5">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="mt-2 h-5 w-3/4" />
        <Skeleton className="mt-2 h-3 w-full" />
        <Skeleton className="mt-1.5 h-3 w-5/6" />
        <Skeleton className="mt-3 h-3 w-20" />
      </div>
    </article>
  );
}
