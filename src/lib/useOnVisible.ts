import { useEffect, useRef } from 'react';

export function useOnVisible(active: boolean, onVisible: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const onVisibleRef = useRef(onVisible);

  useEffect(() => {
    onVisibleRef.current = onVisible;
  }, [onVisible]);

  useEffect(() => {
    if (!active) {
      return;
    }

    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onVisibleRef.current();
        }
      },
      { rootMargin: '160px' },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [active]);

  return ref;
}
