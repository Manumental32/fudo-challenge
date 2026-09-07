import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { getRouterBasename } from './lib/router';
import { AppLayout } from './pages/AppLayout';
import { HomePage } from './pages/Home';
import { NotFoundPage } from './pages/NotFound';
import { PostDetailPage } from './pages/PostDetail';

export default function App() {
  return (
    <BrowserRouter basename={getRouterBasename()}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
