import { Link, Outlet } from 'react-router-dom';
import { AuthBar } from '../features/auth/AuthBar';
import { LoginModal } from '../features/auth/LoginModal';
import { ScrollToTopButton } from '../ui/ScrollToTopButton';

export function AppLayout() {
  return (
    <div className="min-h-svh bg-canvas text-copy">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-bold focus:text-ink focus:shadow"
      >
        Saltar al contenido
      </a>
      <header className="sticky top-0 z-20 border-b border-line bg-white">
        <div className="mx-auto flex h-12 max-w-5xl items-center justify-between gap-3 px-3 sm:px-4">
          <Link
            to="/"
            className="flex items-center gap-2 no-underline"
            aria-label="Fudo, ir al inicio"
          >
            <img
              src={`${import.meta.env.BASE_URL}favicon.svg`}
              alt=""
              width={32}
              height={32}
              className="size-8"
            />
            <span className="text-lg font-extrabold uppercase tracking-[0.14em] text-ink">
              fudo
            </span>
          </Link>
          <AuthBar />
        </div>
      </header>
      <main
        id="contenido"
        className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6"
      >
        <Outlet />
      </main>
      <LoginModal />
      <ScrollToTopButton />
    </div>
  );
}
