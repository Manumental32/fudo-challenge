import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { saveAuthorName } from '../../lib/author';
import type { CommentNode } from '../../types';
import { ToastProvider } from '../../ui/Toast';
import { CommentThread } from './CommentThread';

function node(
  partial: Partial<CommentNode> & Pick<CommentNode, 'id' | 'content'>,
): CommentNode {
  return {
    createdAt: '2026-01-01T00:00:00.000Z',
    name: 'User',
    avatar: '',
    parentId: null,
    children: [],
    ...partial,
  };
}

function renderThread(comment: CommentNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <CommentThread postId="post-1" node={comment} />
      </ToastProvider>
    </QueryClientProvider>,
  );
}

describe('CommentThread', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders a comment and nested replies with indentation', () => {
    renderThread(
      node({
        id: 'root',
        name: 'Ana',
        content: 'Comentario raíz',
        children: [
          node({
            id: 'child',
            name: 'Beto',
            content: 'Respuesta anidada',
            parentId: 'root',
          }),
        ],
      }),
    );

    expect(screen.getByTestId('comment-root')).toHaveTextContent(
      'Comentario raíz',
    );
    expect(screen.getByTestId('comment-child')).toHaveTextContent(
      'Respuesta anidada',
    );

    const nested = screen.getByTestId('comment-child').closest('[data-depth]');
    expect(nested).toHaveAttribute('data-depth', '1');
  });

  it('keeps longer reply threads collapsed until expanded', () => {
    renderThread(
      node({
        id: 'root',
        content: 'Raíz',
        children: [
          node({ id: 'a', content: 'uno', parentId: 'root' }),
          node({ id: 'b', content: 'dos', parentId: 'root' }),
          node({ id: 'c', content: 'tres', parentId: 'root' }),
        ],
      }),
    );

    expect(screen.queryByTestId('comment-a')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Ver 3 respuestas' }),
    ).toBeInTheDocument();
  });

  it('shows nested replies after expanding the thread', async () => {
    const user = userEvent.setup();

    renderThread(
      node({
        id: 'root',
        content: 'Raíz',
        children: [
          node({ id: 'a', content: 'uno', parentId: 'root' }),
          node({ id: 'b', content: 'dos', parentId: 'root' }),
          node({ id: 'c', content: 'tres', parentId: 'root' }),
        ],
      }),
    );

    await user.click(screen.getByRole('button', { name: 'Ver 3 respuestas' }));

    expect(screen.getByTestId('comment-a')).toHaveTextContent('uno');
    expect(screen.getByTestId('comment-c')).toHaveTextContent('tres');
  });

  it('hides edit and delete on someone else’s comment', () => {
    saveAuthorName('Ana');

    renderThread(
      node({
        id: 'root',
        name: 'Beto',
        content: 'Ajeno',
      }),
    );

    expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Borrar' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Responder' })).toBeInTheDocument();
  });

  it('renders comment HTML without executing unsafe tags', () => {
    renderThread(
      node({
        id: 'root',
        content: '<p>ok</p><script>alert(1)</script>',
      }),
    );

    const comment = screen.getByTestId('comment-root');
    expect(comment).toHaveTextContent('ok');
    expect(comment.innerHTML.toLowerCase()).not.toContain('script');
  });

  it('shows edit and delete on your own comment', () => {
    saveAuthorName('Ana');

    renderThread(
      node({
        id: 'root',
        name: 'Ana',
        content: 'Mío',
      }),
    );

    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Borrar' })).toBeInTheDocument();
  });

  it('asks for confirmation before deleting a comment', async () => {
    const showModal = vi.fn();
    HTMLDialogElement.prototype.showModal = showModal;
    HTMLDialogElement.prototype.close = vi.fn();

    saveAuthorName('Ana');
    const user = userEvent.setup();

    renderThread(
      node({
        id: 'root',
        name: 'Ana',
        content: 'Mío',
      }),
    );

    await user.click(screen.getByRole('button', { name: 'Borrar' }));

    expect(showModal).toHaveBeenCalled();

    const dialog = document.querySelector('dialog');
    expect(dialog).toHaveTextContent('¿Eliminar comentario?');
    expect(dialog).toHaveTextContent(
      '¿Seguro que quieres eliminar tu comentario? Esta acción no puede deshacerse.',
    );
    expect(dialog).toHaveTextContent('Eliminar');
    expect(dialog).toHaveTextContent('Cancelar');
  });
});
