import { toDisplayHtml } from '../../lib/richText';

interface PostBodyProps {
  content: string;
}

export function PostBody({ content }: PostBodyProps) {
  const html = toDisplayHtml(content);

  if (!html) {
    return null;
  }

  return (
    <div
      className="rich-text text-[15px] leading-6 text-copy"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
