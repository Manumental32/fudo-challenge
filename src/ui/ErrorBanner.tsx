interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <p
      className="rounded-lg border border-danger-line bg-danger-soft px-3 py-2 text-sm text-danger"
      role="alert"
    >
      {message}
    </p>
  );
}
