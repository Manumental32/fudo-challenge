import type { ReactNode, Ref } from 'react';
import { Button } from './Button';
import { ErrorBanner } from './ErrorBanner';

interface LoadMoreTailProps {
  canLoadMore: boolean;
  isFetchingMore: boolean;
  failedMore: boolean;
  fetchingLabel: string;
  errorMessage: string;
  sentinelRef: Ref<HTMLDivElement>;
  className?: string;
  onRetry: () => void;
  children: ReactNode;
}

export function LoadMoreTail({
  canLoadMore,
  isFetchingMore,
  failedMore,
  fetchingLabel,
  errorMessage,
  sentinelRef,
  className = '',
  onRetry,
  children,
}: Readonly<LoadMoreTailProps>) {
  if (!canLoadMore) {
    return null;
  }

  return (
    <div
      ref={sentinelRef}
      className={className}
      aria-busy={isFetchingMore}
      aria-label={isFetchingMore ? fetchingLabel : undefined}
    >
      {isFetchingMore ? children : null}
      {failedMore ? (
        <div className="flex flex-col items-start gap-2">
          <ErrorBanner message={errorMessage} />
          <Button variant="secondary" onClick={onRetry}>
            Reintentar
          </Button>
        </div>
      ) : null}
      {!isFetchingMore && !failedMore ? <div className="h-10" /> : null}
    </div>
  );
}
