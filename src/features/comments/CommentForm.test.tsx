import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { login } from '../../lib/author';
import { CommentForm } from './CommentForm';

describe('CommentForm', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('asks to log in instead of asking for a name', () => {
    render(
      <CommentForm
        submitLabel="Comentar"
        pending={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByText(/Iniciá sesión para comentar/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/nombre/i)).not.toBeInTheDocument();
  });

  it('uses the session user and does not ask for a name', () => {
    login({ name: 'Ana', avatar: 'https://example.com/a.svg' });

    render(
      <CommentForm
        submitLabel="Responder"
        pending={false}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByText(/Comentando como/)).toHaveTextContent('u/Ana');
    expect(screen.queryByLabelText(/nombre/i)).not.toBeInTheDocument();
  });

  it('keeps the comment text when submit fails', async () => {
    login({ name: 'Ana', avatar: '' });
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error('fail'));

    render(
      <CommentForm
        submitLabel="Comentar"
        pending={false}
        onSubmit={onSubmit}
      />,
    );

    await user.type(screen.getByLabelText('Comentario'), 'hola');
    await user.click(screen.getByRole('button', { name: 'Comentar' }));

    expect(onSubmit).toHaveBeenCalled();
    expect(screen.getByLabelText('Comentario')).toHaveValue('hola');
  });
});
