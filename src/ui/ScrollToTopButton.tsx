import { useEffect, useState } from 'react';
import { scrollToTop } from '../lib/scrollToTop';

const SHOW_AFTER_PX = 240;

function useScrolledDown(): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function sync(): void {
      setScrolled(window.scrollY > SHOW_AFTER_PX);
    }

    sync();
    window.addEventListener('scroll', sync, { passive: true });

    return () => {
      window.removeEventListener('scroll', sync);
    };
  }, []);

  return scrolled;
}

export function ScrollToTopButton() {
  const visible = useScrolledDown();

  if (!visible) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Ir al inicio"
      onClick={scrollToTop}
      className="fixed bottom-5 right-4 z-30 flex size-11 cursor-pointer items-center justify-center rounded-full bg-brand-text text-white shadow-lg hover:bg-brand-text/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-text"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5" />
        <path d="M6 11l6-6 6 6" />
      </svg>
    </button>
  );
}
