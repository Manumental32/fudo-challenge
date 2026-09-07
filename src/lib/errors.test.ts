import axios, { AxiosError } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getErrorMessage } from './errors';

describe('getErrorMessage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a Spanish retry message for unknown errors', () => {
    expect(getErrorMessage(new Error('boom'), 'No se pudo guardar.')).toBe(
      'No se pudo guardar. Reintentá.',
    );
  });

  it('does not leak English Axios network errors', () => {
    const error = new AxiosError('Network Error');
    error.code = 'ERR_NETWORK';

    expect(getErrorMessage(error, 'No se pudo guardar.')).toBe(
      'No hay conexión. Reintentá.',
    );
  });

  it('explains when the shared API is full', () => {
    const error = new AxiosError('Request failed');
    error.response = {
      data: 'Max number of elements reached for this resource',
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
    };

    expect(getErrorMessage(error, 'No se pudo')).toBe(
      'La API está llena. No se pudo guardar.',
    );
  });
});
