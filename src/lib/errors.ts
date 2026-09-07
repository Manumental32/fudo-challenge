import { isAxiosError } from 'axios';

const RETRY_HINT = 'Reintentá.';

function isNetworkFailure(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return false;
  }

  return (
    !error.response ||
    error.code === 'ERR_NETWORK' ||
    error.message === 'Network Error'
  );
}

export function isQuotaExceeded(error: unknown): boolean {
  if (!isAxiosError(error)) {
    return false;
  }

  const data = error.response?.data;
  return typeof data === 'string' && data.includes('Max number of elements');
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    if (isQuotaExceeded(error)) {
      return 'La API está llena. No se pudo guardar.';
    }

    if (isNetworkFailure(error)) {
      return `No hay conexión. ${RETRY_HINT}`;
    }
  }

  if (fallback.includes('Reintent')) {
    return fallback;
  }

  return `${fallback.replace(/\.$/, '')}. ${RETRY_HINT}`;
}
