import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-text text-white hover:bg-brand-text/90 focus-visible:outline-brand-text disabled:bg-brand-text/40',
  secondary:
    'bg-white text-brand-text ring-1 ring-brand-text hover:bg-sage focus-visible:outline-brand-text disabled:text-muted',
  danger:
    'bg-danger text-white hover:bg-danger-hover focus-visible:outline-danger disabled:bg-danger/40',
  ghost:
    'bg-transparent text-muted hover:bg-sage hover:text-ink focus-visible:outline-muted disabled:text-line',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`relative inline-flex cursor-pointer items-center justify-center rounded-full px-3 py-1.5 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      <span className={loading ? 'invisible' : undefined}>{children}</span>
      {loading ? (
        <span
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" />
        </span>
      ) : null}
    </button>
  );
}
