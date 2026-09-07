import { useOnVisible } from '../../lib/useOnVisible';
import { ErrorBanner } from '../../ui/ErrorBanner';
import { LoadMoreTail } from '../../ui/LoadMoreTail';
import { Skeleton } from '../../ui/Skeleton';
import { CommentForm } from './CommentForm';
import { CommentThread } from './CommentThread';
import { useComments } from './hooks/useComments';
import { useCreateComment } from './hooks/useCreateComment';

interface CommentsSectionProps {
  postId: string;
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const commentsQuery = useComments(postId);
  const createComment = useCreateComment(postId);
  const canLoadMore = Boolean(commentsQuery.hasNextPage);
  const isFetchingMore = commentsQuery.isFetchingNextPage;
  const failedMore = commentsQuery.isFetchNextPageError;
  const sentinelRef = useOnVisible(
    canLoadMore && !isFetchingMore && !failedMore,
    () => {
      void commentsQuery.fetchNextPage();
    },
  );

  return (
    <section className="flex flex-col gap-3">
      <div className="rounded border border-line bg-white p-3">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
          Comentarios
        </h2>
        <CommentForm
          submitLabel="Comentar"
          pending={createComment.isPending}
          onSubmit={(values) =>
            createComment.mutateAsync({ ...values, parentId: null })
          }
        />
      </div>
      {commentsQuery.isPending ? (
        <div
          className="overflow-hidden rounded border border-line bg-white px-3 py-3"
          aria-busy="true"
          aria-label="Cargando comentarios"
        >
          {['one', 'two', 'three'].map((slot) => (
            <div key={slot} className="py-2">
              <div className="flex items-center gap-1.5">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="mt-2 h-3 w-5/6" />
            </div>
          ))}
        </div>
      ) : null}
      {commentsQuery.isError ? (
        <ErrorBanner message="No se pudieron cargar los comentarios." />
      ) : null}
      {commentsQuery.isSuccess && commentsQuery.tree.length === 0 ? (
        <p className="rounded border border-line bg-white px-3 py-6 text-center text-sm text-muted">
          Todavía no hay comentarios. Sé el primero en responder.
        </p>
      ) : null}
      {commentsQuery.tree.length > 0 ? (
        <div className="flex flex-col gap-0 overflow-hidden rounded border border-line bg-white">
          {commentsQuery.tree.map((node) => (
            <CommentThread key={node.id} postId={postId} node={node} />
          ))}
          <LoadMoreTail
            canLoadMore={canLoadMore}
            isFetchingMore={isFetchingMore}
            failedMore={failedMore}
            fetchingLabel="Cargando más comentarios"
            errorMessage="No se pudieron cargar más comentarios."
            sentinelRef={sentinelRef}
            className="border-t border-line px-3 py-3"
            onRetry={() => {
              void commentsQuery.fetchNextPage();
            }}
          >
            <div className="py-1">
              <div className="flex items-center gap-1.5">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="mt-2 h-3 w-4/5" />
            </div>
          </LoadMoreTail>
        </div>
      ) : null}
    </section>
  );
}
