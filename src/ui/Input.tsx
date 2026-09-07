import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, id, className = '', ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wide text-muted">
      {label}
      <input
        id={inputId}
        className={`rounded border border-line bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-ink outline-none focus:border-brand-text focus:ring-1 focus:ring-brand-text ${className}`}
        {...props}
      />
    </label>
  );
}
