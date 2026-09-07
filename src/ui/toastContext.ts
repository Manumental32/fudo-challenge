import { createContext, useContext } from 'react';

export interface ToastContextValue {
  showError: (message: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast requiere ToastProvider');
  }

  return context;
}
