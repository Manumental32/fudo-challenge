import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { CommentsSection } from '../features/comments/CommentsSection';
import { PostBody } from '../features/posts/PostBody';
import { PostForm } from '../features/posts/PostForm';
import { useDeletePost } from '../features/posts/hooks/useDeletePost';
import { usePost } from '../features/posts/hooks/usePost';
import { useUpdatePost } from '../features/posts/hooks/useUpdatePost';
import { isOwnAuthor, useCurrentAuthor } from '../lib/author';
import { formatDate } from '../lib/dates';
import { getErrorMessage } from '../lib/errors';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { ErrorBanner } from '../ui/ErrorBanner';
import { Modal } from '../ui/Modal';
import { Skeleton } from '../ui/Skeleton';

export function PostDetailPage() {
  const { postId = '' } = useParams();
  const navigate = useNavigate();
  const postQuery = usePost(postId);
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const currentAuthor = useCurrentAuthor();

  let pageTitle = 'Cargando · Fudo';

  if (postQuery.isSuccess && postQuery.data) {
    pageTitle = `${postQuery.data.title} · Fudo`;
  } else if (postQuery.isError) {
    pageTitle = 'Publicación no encontrada · Fudo';
  }

  useDocumentTitle(pageTitle);

  if (postQuery.isPending) {
    return (
      <div
        className="flex flex-col gap-3"
        aria-busy="true"
        aria-label="Cargando publicación"
      >
        <Skeleton className="h-3 w-28" />
        <article className="overflow-hidden rounded border border-line bg-white">
          <div className="min-w-0 px-4 py-3">
            <div className="flex items-center gap-1.5">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="mt-3 h-7 w-2/3" />
            <Skeleton className="mt-3 h-3 w-full" />
            <Skeleton className="mt-2 h-3 w-5/6" />
            <Skeleton className="mt-2 h-3 w-4/6" />
          </div>
        </article>
        <div className="rounded border border-line bg-white p-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-20 w-full" />
        </div>
      </div>
    );
  }

  if (postQuery.isError || !postQuery.data) {
    return (
      <div className="flex flex-col gap-3">
        <ErrorBanner message="No se encontró la publicación." />
        <Link to="/" className="text-sm font-semibold text-brand-text hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const post = postQuery.data;
  const canModerate = isOwnAuthor(post.name, currentAuthor);

  return (
    <article className="flex flex-col gap-3">
      <Link to="/" className="text-xs font-bold text-brand-text hover:underline">
        ← Volver al feed
      </Link>
      <div className="overflow-hidden rounded border border-line bg-white">
        <div className="min-w-0 px-4 py-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
            <Avatar name={post.name} src={post.avatar} size="sm" />
            <span className="font-bold text-ink">u/{post.name}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">
            {post.title}
          </h1>
          <div className="mt-3">
            <PostBody content={post.content} />
          </div>
          {canModerate ? (
            <div className="mt-3 flex flex-wrap gap-1">
              <Button variant="ghost" className="text-xs" onClick={() => setEditing(true)}>
                Editar
              </Button>
              <Button
                variant="ghost"
                className="text-xs"
                onClick={() => setConfirmDelete(true)}
              >
                Borrar
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      <CommentsSection postId={post.id} />

      <Modal
        open={editing}
        title="Editar publicación"
        onClose={() => {
          setEditing(false);
          updatePost.reset();
        }}
      >
        {editing ? (
          <PostForm
            initial={post}
            submitLabel="Guardar cambios"
            pending={updatePost.isPending}
            errorMessage={
              updatePost.isError
                ? getErrorMessage(updatePost.error, 'No se pudo guardar.')
                : undefined
            }
            onSubmit={(values) => {
              updatePost.mutate(
                { postId: post.id, payload: values },
                { onSuccess: () => setEditing(false) },
              );
            }}
          />
        ) : null}
      </Modal>

      <Modal
        open={confirmDelete}
        title="Borrar publicación"
        onClose={() => setConfirmDelete(false)}
      >
        <p className="text-sm text-copy">
          ¿Borrar “{post.title}”? También perderás el hilo de comentarios.
        </p>
        {deletePost.isError ? (
          <div className="mt-3">
            <ErrorBanner
              message={getErrorMessage(deletePost.error, 'No se pudo borrar.')}
            />
          </div>
        ) : null}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            loading={deletePost.isPending}
            onClick={() => {
              deletePost.mutate(post.id, {
                onSuccess: () => {
                  void navigate('/');
                },
              });
            }}
          >
            Borrar
          </Button>
        </div>
      </Modal>
    </article>
  );
}
