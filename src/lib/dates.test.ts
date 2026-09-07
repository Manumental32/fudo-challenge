import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatDate } from './dates';

describe('formatDate', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('returns the original value when the date is invalid', () => {
    expect(formatDate('no-es-fecha')).toBe('no-es-fecha');
  });

  it('uses a relative label for recent dates', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T12:00:00.000Z'));

    expect(formatDate('2026-01-01T11:50:00.000Z')).toMatch(/minuto/);
  });
});
