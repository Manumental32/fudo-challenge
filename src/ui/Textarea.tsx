import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({
  label,
  id,
  className = '',
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;
  const field = (
    <textarea
      id={textareaId}
      className={`min-h-24 w-full resize-y rounded border border-line bg-white px-3 py-2 text-sm font-normal text-ink outline-none focus:border-brand-text focus:ring-1 focus:ring-brand-text ${className}`}
      {...props}
    />
  );

  if (!label) {
    return field;
  }

  return (
    <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-muted">
      {label}
      {field}
    </label>
  );
}
