import { useState } from 'react';
import { isOwnAuthor, useCurrentAuthor } from '../../lib/author';
import { formatDate } from '../../lib/dates';
import type { CommentNode } from '../../types';
import { Avatar } from '../../ui/Avatar';
import { Button } from '../../ui/Button';
import { Modal } from '../../ui/Modal';
import { CommentForm } from './CommentForm';
import { useCreateComment } from './hooks/useCreateComment';
import { useDeleteComment } from './hooks/useDeleteComment';
import { useUpdateComment } from './hooks/useUpdateComment';

interface CommentItemProps {
  postId: string;
  node: CommentNode;
}

export function CommentItem({ postId, node }: CommentItemProps) {
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const currentAuthor = useCurrentAuthor();
  const canModerate = isOwnAuthor(node.name, currentAuthor);
  const createComment = useCreateComment(postId);
  const updateComment = useUpdateComment(postId);
  const deleteComment = useDeleteComment(postId);

  return (
    <article data-testid={`comment-${node.id}`}>
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <Avatar name={node.name} src={node.avatar} size="sm" />
        <p className="font-bold text-ink">u/{node.name}</p>
        <span className="text-muted" aria-hidden="true">
          •
        </span>
        <time className="text-muted" dateTime={node.createdAt}>
          {formatDate(node.createdAt)}
        </time>
      </div>
      {editing ? (
        <div className="mt-2">
          <CommentForm
            submitLabel="Guardar"
            pending={updateComment.isPending}
            initialContent={node.content}
            onCancel={() => setEditing(false)}
            onSubmit={async ({ content }) => {
              await updateComment.mutateAsync({
                commentId: node.id,
                payload: { content },
              });
              setEditing(false);
            }}
          />
        </div>
      ) : (
        <p className="mt-1 whitespace-pre-wrap text-sm text-copy">
          {node.content}
        </p>
      )}
      <div className="mt-1 flex flex-wrap gap-0">
        <Button
          variant="ghost"
          className="h-7 px-2 text-[11px] uppercase"
          onClick={() => setReplying((open) => !open)}
        >
          {replying ? 'Cancelar' : 'Responder'}
        </Button>
        {canModerate ? (
          <>
            <Button
              variant="ghost"
              className="h-7 px-2 text-[11px] uppercase"
              onClick={() => setEditing((open) => !open)}
            >
              {editing ? 'Cerrar' : 'Editar'}
            </Button>
            <Button
              variant="ghost"
              className="h-7 px-2 text-[11px] uppercase"
              onClick={() => setConfirmDelete(true)}
            >
              Borrar
            </Button>
          </>
        ) : null}
      </div>
      {replying ? (
        <div className="mt-2 rounded border border-line bg-sage p-2">
          <CommentForm
            submitLabel="Responder"
            pending={createComment.isPending}
            onCancel={() => setReplying(false)}
            onSubmit={async (values) => {
              await createComment.mutateAsync({
                ...values,
                parentId: node.id,
              });
              setReplying(false);
            }}
          />
        </div>
      ) : null}
      <Modal
        open={confirmDelete}
        title="¿Eliminar comentario?"
        onClose={() => setConfirmDelete(false)}
      >
        <p className="text-sm text-copy">
          ¿Seguro que quieres eliminar tu comentario? Esta acción no puede
          deshacerse.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setConfirmDelete(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            loading={deleteComment.isPending}
            onClick={() => {
              deleteComment.mutate(node.id, {
                onSuccess: () => setConfirmDelete(false),
              });
            }}
          >
            Eliminar
          </Button>
        </div>
      </Modal>
    </article>
  );
}
