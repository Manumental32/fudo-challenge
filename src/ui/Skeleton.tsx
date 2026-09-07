interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <span
      className={`inline-block animate-pulse rounded bg-sage motion-reduce:animate-none ${className}`}
      aria-hidden="true"
    />
  );
}
