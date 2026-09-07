import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('replaces the visible label with a spinner without changing the name', () => {
    render(
      <Button loading variant="danger">
        Borrar
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Borrar' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.getByText('Borrar')).toHaveClass('invisible');
  });
});
