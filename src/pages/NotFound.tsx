import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Página no encontrada · Fudo');

  return (
    <div className="flex flex-col items-start gap-3">
      <h1 className="text-2xl font-extrabold">Página no encontrada</h1>
      <Link to="/" className="text-sm font-semibold text-brand-text hover:underline">
        Volver al inicio
      </Link>
    </div>
  );
}
