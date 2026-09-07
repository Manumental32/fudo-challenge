import { useMemo, useState } from 'react';
import { requestLogin, useSession } from '../../lib/author';
import { getErrorMessage } from '../../lib/errors';
import { useOnVisible } from '../../lib/useOnVisible';
import type { Post } from '../../types';
import { Button } from '../../ui/Button';
import { ErrorBanner } from '../../ui/ErrorBanner';
import { LoadMoreTail } from '../../ui/LoadMoreTail';
import { Modal } from '../../ui/Modal';
import { PostCard, PostCardSkeleton } from './PostCard';
import { PostForm } from './PostForm';
import { useCreatePost } from './hooks/useCreatePost';
import { useDeletePost } from './hooks/useDeletePost';
import { usePosts } from './hooks/usePosts';
import { useUpdatePost } from './hooks/useUpdatePost';

export function PostList() {
  const postsQuery = usePosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const canLoadMore = Boolean(postsQuery.hasNextPage);
  const isFetchingMore = postsQuery.isFetchingNextPage;
  const failedMore = postsQuery.isFetchNextPageError;
  const sentinelRef = useOnVisible(
    canLoadMore && !isFetchingMore && !failedMore,
    () => {
      void postsQuery.fetchNextPage();
    },
  );

  const session = useSession();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState<Post | null>(null);

  const posts = useMemo(() => {
    const merged = postsQuery.data?.pages.flatMap((page) => page.posts) ?? [];
    const seen = new Set<string>();
    const unique: Post[] = [];

    for (const post of merged) {
      if (seen.has(post.id)) {
        continue;
      }

      seen.add(post.id);
      unique.push(post);
    }

    return unique.sort(
      (left, right) =>
        Date.parse(right.createdAt) - Date.parse(left.createdAt),
    );
  }, [postsQuery.data]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-muted">
            Feed
          </p>
          <h1 className="text-xl font-extrabold tracking-tight text-ink">
            r/fudo
          </h1>
        </div>
        <Button
          onClick={() => {
            if (!session) {
              requestLogin();
              return;
            }

            setCreateOpen(true);
          }}
        >
          Crear post
        </Button>
      </div>

      {postsQuery.isPending ? (
        <ul
          className="flex flex-col gap-2.5"
          aria-busy="true"
          aria-label="Cargando publicaciones"
        >
          {['one', 'two', 'three', 'four', 'five'].map((slot) => (
            <li key={slot}>
              <PostCardSkeleton />
            </li>
          ))}
        </ul>
      ) : null}
      {postsQuery.isError ? (
        <ErrorBanner message="No se pudieron cargar las publicaciones." />
      ) : null}
      {postsQuery.isSuccess && posts.length === 0 ? (
        <p className="rounded border border-dashed border-line bg-white px-4 py-8 text-center text-sm text-muted">
          Todavía no hay publicaciones.
        </p>
      ) : null}

      <ul className="flex flex-col gap-2.5">
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard
              post={post}
              onEdit={setEditing}
              onDelete={setDeleting}
            />
          </li>
        ))}
      </ul>
      <LoadMoreTail
        canLoadMore={canLoadMore}
        isFetchingMore={isFetchingMore}
        failedMore={failedMore}
        fetchingLabel="Cargando más publicaciones"
        errorMessage="No se pudieron cargar más publicaciones."
        sentinelRef={sentinelRef}
        onRetry={() => {
          void postsQuery.fetchNextPage();
        }}
      >
        <ul className="flex flex-col gap-2.5">
          <li>
            <PostCardSkeleton />
          </li>
          <li>
            <PostCardSkeleton />
          </li>
        </ul>
      </LoadMoreTail>

      <Modal
        open={createOpen}
        title="Nueva publicación"
        onClose={() => {
          setCreateOpen(false);
          createPost.reset();
        }}
      >
        {createOpen ? (
          <PostForm
            submitLabel="Publicar"
            pending={createPost.isPending}
            errorMessage={
              createPost.isError
                ? getErrorMessage(createPost.error, 'No se pudo publicar.')
                : undefined
            }
            onSubmit={(values) => {
              createPost.mutate(values, {
                onSuccess: () => setCreateOpen(false),
              });
            }}
          />
        ) : null}
      </Modal>

      <Modal
        open={editing !== null}
        title="Editar publicación"
        onClose={() => setEditing(null)}
      >
        {editing ? (
          <PostForm
            key={editing.id}
            initial={editing}
            submitLabel="Guardar cambios"
            pending={updatePost.isPending}
            errorMessage={
              updatePost.isError
                ? getErrorMessage(updatePost.error, 'No se pudo guardar.')
                : undefined
            }
            onSubmit={(values) => {
              updatePost.mutate(
                { postId: editing.id, payload: values },
                { onSuccess: () => setEditing(null) },
              );
            }}
          />
        ) : null}
      </Modal>

      <Modal
        open={deleting !== null}
        title="Borrar publicación"
        onClose={() => setDeleting(null)}
      >
        <p className="text-sm text-copy">
          ¿Borrar “{deleting?.title}”? Esta acción no se puede deshacer.
        </p>
        {deletePost.isError ? (
          <div className="mt-3">
            <ErrorBanner
              message={getErrorMessage(deletePost.error, 'No se pudo borrar.')}
            />
          </div>
        ) : null}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(null)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            loading={deletePost.isPending}
            disabled={!deleting}
            onClick={() => {
              if (!deleting) {
                return;
              }

              deletePost.mutate(deleting.id, {
                onSuccess: () => setDeleting(null),
              });
            }}
          >
            Borrar
          </Button>
        </div>
      </Modal>
    </section>
  );
}
