import { useEffect } from 'react';
import { APP_NAME } from './brand';

export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = title;

    return () => {
      document.title = APP_NAME;
    };
  }, [title]);
}
