import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LoadMoreTail } from './LoadMoreTail';

describe('LoadMoreTail', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('does not keep loading when the next page failed', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();

    render(
      <LoadMoreTail
        canLoadMore
        isFetchingMore={false}
        failedMore
        fetchingLabel="Cargando más comentarios"
        errorMessage="No se pudieron cargar más comentarios."
        sentinelRef={createRef<HTMLDivElement>()}
        onRetry={onRetry}
      >
        <p>skeleton</p>
      </LoadMoreTail>,
    );

    expect(screen.queryByText('skeleton')).not.toBeInTheDocument();
    expect(
      screen.getByText('No se pudieron cargar más comentarios.'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
