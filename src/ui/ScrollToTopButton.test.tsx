import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ScrollToTopButton } from './ScrollToTopButton';

function setScrollY(value: number): void {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value,
  });
  fireEvent.scroll(window);
}

describe('ScrollToTopButton', () => {
  afterEach(() => {
    cleanup();
    setScrollY(0);
    vi.restoreAllMocks();
  });

  it('stays hidden at the top of the page', () => {
    setScrollY(0);
    render(<ScrollToTopButton />);

    expect(
      screen.queryByRole('button', { name: 'Ir al inicio' }),
    ).not.toBeInTheDocument();
  });

  it('appears after scrolling down and scrolls back to the top', () => {
    const scrollTo = vi
      .spyOn(window, 'scrollTo')
      .mockImplementation(() => undefined);
    render(<ScrollToTopButton />);

    setScrollY(400);

    const button = screen.getByRole('button', { name: 'Ir al inicio' });
    fireEvent.click(button);

    expect(scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});
