import { lazy, Suspense, useState, type FormEvent } from 'react';
import { useSession } from '../../lib/author';
import { isRichTextEmpty, sanitizeHtml } from '../../lib/richText';
import type { Post } from '../../types';
import { Avatar } from '../../ui/Avatar';
import { Button } from '../../ui/Button';
import { ErrorBanner } from '../../ui/ErrorBanner';
import { Input } from '../../ui/Input';
import { Skeleton } from '../../ui/Skeleton';

const RichTextEditor = lazy(async () => {
  const module = await import('../../ui/RichTextEditor');
  return { default: module.RichTextEditor };
});

interface PostFormValues {
  name: string;
  title: string;
  content: string;
  avatar: string;
}

interface PostFormProps {
  initial?: Pick<Post, 'name' | 'title' | 'content' | 'avatar'>;
  submitLabel: string;
  pending: boolean;
  errorMessage?: string;
  onSubmit: (values: PostFormValues) => void;
}

export function PostForm({
  initial,
  submitLabel,
  pending,
  errorMessage,
  onSubmit,
}: PostFormProps) {
  const session = useSession();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!session) {
      return;
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle || isRichTextEmpty(content)) {
      return;
    }

    onSubmit({
      name: session.name,
      avatar: session.avatar,
      title: trimmedTitle,
      content: sanitizeHtml(content),
    });
  }

  if (!session) {
    return null;
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <p className="flex items-center gap-2 text-sm text-copy">
        <Avatar name={session.name} src={session.avatar} size="sm" />
        Publicando como <span className="font-bold">u/{session.name}</span>
      </p>
      <Input
        label="Título"
        name="title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
      />
      <Suspense
        fallback={
          <div
            className="flex flex-col gap-1"
            aria-busy="true"
            aria-label="Cargando editor"
          >
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-36 w-full" />
          </div>
        }
      >
        <RichTextEditor
          label="Contenido"
          value={content}
          onChange={setContent}
        />
      </Suspense>
      {errorMessage ? <ErrorBanner message={errorMessage} /> : null}
      <div className="flex justify-end">
        <Button type="submit" loading={pending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
