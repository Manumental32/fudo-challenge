import { useCallback, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { ToastContext } from './toastContext';

const TOAST_MS = 5000;

function useOpenDialog(): HTMLDialogElement | null {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);

  useEffect(() => {
    function sync(): void {
      const openDialogs = Array.from(
        document.querySelectorAll<HTMLDialogElement>('dialog[open]'),
      );
      setDialog(openDialogs.at(-1) ?? null);
    }

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['open'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return dialog;
}

interface ToastItem {
  id: number;
  message: string;
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;

    return () => {
      for (const timer of pending) {
        window.clearTimeout(timer);
      }
    };
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showError = useCallback(
    (message: string) => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { id, message }]);

      const timer = window.setTimeout(() => {
        dismiss(id);
      }, TOAST_MS);
      timers.current.push(timer);
    },
    [dismiss],
  );

  const openDialog = useOpenDialog();
  const region = (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-4"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded border border-danger-line bg-white px-3 py-3 text-sm text-danger shadow-lg"
        >
          <p className="flex-1">{toast.message}</p>
          <button
            type="button"
            className="cursor-pointer text-base leading-none text-danger hover:text-danger-hover"
            aria-label="Cerrar aviso"
            onClick={() => dismiss(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <ToastContext.Provider value={{ showError }}>
      {children}
      {openDialog ? createPortal(region, openDialog) : region}
    </ToastContext.Provider>
  );
}
