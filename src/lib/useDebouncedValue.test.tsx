import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue';

function Probe({ value }: { value: string }) {
  const debounced = useDebouncedValue(value, 200);
  return <p>{debounced}</p>;
}

describe('useDebouncedValue', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('updates the value after the delay', () => {
    vi.useFakeTimers();
    const { rerender, getByText } = render(<Probe value="a" />);

    expect(getByText('a')).toBeInTheDocument();

    rerender(<Probe value="ab" />);
    expect(getByText('a')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(getByText('ab')).toBeInTheDocument();
  });
});
