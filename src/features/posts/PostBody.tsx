import { toDisplayHtml } from '../../lib/richText';

interface PostBodyProps {
  readonly content: string;
  readonly className?: string;
}

export function PostBody({
  content,
  className = 'text-[15px] leading-6 text-copy',
}: PostBodyProps) {
  const html = toDisplayHtml(content);

  if (!html) {
    return null;
  }

  return (
    <div
      className={`rich-text ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
