import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { saveAuthorName } from '../../lib/author';
import type { Post } from '../../types';
import { PostCard } from './PostCard';

const post: Post = {
  id: '42',
  title: 'Hola mundo',
  content: 'Texto del post',
  name: 'Ana',
  avatar: '',
  createdAt: '2026-01-01T12:00:00.000Z',
};

function renderCard(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PostCard', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('links to the post detail', () => {
    renderCard(<PostCard post={post} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByRole('link', { name: 'Hola mundo' })).toHaveAttribute(
      'href',
      '/posts/42',
    );
  });

  it('does not offer edit or delete for another author’s post', () => {
    saveAuthorName('Beto');

    renderCard(<PostCard post={post} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Borrar' })).not.toBeInTheDocument();
  });

  it('offers edit and delete for your own post', () => {
    saveAuthorName('Ana');

    renderCard(<PostCard post={post} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Borrar' })).toBeInTheDocument();
  });
});
