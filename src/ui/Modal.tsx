import { useEffect, useId, useRef, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-ink/60"
      onClose={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-[min(100%,32rem)] overflow-hidden rounded-xl border border-line bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 id={titleId} className="text-base font-extrabold text-ink">
              {title}
            </h2>
            <button
              type="button"
              className="cursor-pointer rounded-full px-2 py-1 text-sm text-muted hover:bg-sage"
              onClick={onClose}
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
          <div className="px-4 py-4">{children}</div>
        </div>
      </div>
    </dialog>
  );
}
