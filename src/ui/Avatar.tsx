import { useState } from 'react';

interface AvatarProps {
  readonly name: string;
  readonly src: string;
  readonly size?: 'sm' | 'md';
}

export function Avatar({ name, src, size = 'md' }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState('');
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  const box = size === 'sm' ? 'size-5 text-[10px]' : 'size-9 text-sm';

  if (!src || failedSrc === src) {
    return (
      <span
        className={`flex shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white ${box}`}
        aria-hidden="true"
      >
        {initial}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      className={`shrink-0 rounded-full bg-sage object-cover ${box}`}
      onError={() => setFailedSrc(src)}
    />
  );
}
