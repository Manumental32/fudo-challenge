import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { getRouterBasename } from './lib/router';
import { AppLayout } from './pages/AppLayout';
import { HomePage } from './pages/Home';
import { NotFoundPage } from './pages/NotFound';
import { Skeleton } from './ui/Skeleton';

const PostDetailPage = lazy(async () => {
  const module = await import('./pages/PostDetail');
  return { default: module.PostDetailPage };
});

function RouteFallback() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-label="Cargando">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={getRouterBasename()}>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:postId" element={<PostDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
