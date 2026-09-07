import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useOnVisible } from './useOnVisible';

function Probe({
  active,
  onVisible,
}: {
  active: boolean;
  onVisible: () => void;
}) {
  const ref = useOnVisible(active, onVisible);
  return <div ref={ref} data-testid="sentinel" />;
}

describe('useOnVisible', () => {
  const observers: IntersectionObserverCallback[] = [];
  const disconnect = vi.fn();

  beforeEach(() => {
    observers.length = 0;
    disconnect.mockClear();

    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          observers.push(callback);
        }

        observe() {
          return undefined;
        }

        unobserve() {
          return undefined;
        }

        disconnect() {
          disconnect();
        }
      },
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('calls onVisible when the sentinel intersects', () => {
    const onVisible = vi.fn();
    render(<Probe active onVisible={onVisible} />);

    act(() => {
      observers[0](
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(onVisible).toHaveBeenCalledTimes(1);
  });

  it('re-observes after becoming active again while still visible', () => {
    const onVisible = vi.fn();
    const { rerender } = render(<Probe active onVisible={onVisible} />);

    act(() => {
      observers[0](
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });
    expect(onVisible).toHaveBeenCalledTimes(1);

    rerender(<Probe active={false} onVisible={onVisible} />);
    expect(disconnect).toHaveBeenCalled();

    rerender(<Probe active onVisible={onVisible} />);

    act(() => {
      observers.at(-1)?.(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(onVisible).toHaveBeenCalledTimes(2);
  });
});
