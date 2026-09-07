import { useState, type FormEvent } from 'react';
import { LoginGate } from '../auth/LoginGate';
import { useSession } from '../../lib/author';
import { Avatar } from '../../ui/Avatar';
import { Button } from '../../ui/Button';
import { Textarea } from '../../ui/Textarea';

interface CommentFormProps {
  submitLabel: string;
  pending: boolean;
  initialContent?: string;
  onSubmit: (values: {
    name: string;
    content: string;
    avatar: string;
  }) => void | Promise<unknown>;
  onCancel?: () => void;
}

export function CommentForm({
  submitLabel,
  pending,
  initialContent = '',
  onSubmit,
  onCancel,
}: CommentFormProps) {
  const session = useSession();
  const [content, setContent] = useState(initialContent);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session) {
      return;
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    try {
      await onSubmit({
        name: session.name,
        content: trimmedContent,
        avatar: session.avatar,
      });
      setContent('');
    } catch {
      return;
    }
  }

  if (!session) {
    return <LoginGate action="comentar" />;
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <p className="flex items-center gap-2 text-xs text-muted">
        <Avatar name={session.name} src={session.avatar} size="sm" />
        Comentando como <span className="font-bold text-ink">u/{session.name}</span>
      </p>
      <Textarea
        name="comment-content"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        required
        placeholder="¿Qué opinás?"
        className="min-h-20"
        aria-label="Comentario"
      />
      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" loading={pending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
