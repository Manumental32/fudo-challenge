import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';
import { ToastProvider } from './Toast';
import { useToast } from './toastContext';

function Probe() {
  const { showError } = useToast();

  return (
    <button type="button" onClick={() => showError('No se pudo guardar.')}>
      Avisar
    </button>
  );
}

describe('Toast', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('shows an error toast', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Avisar' }));

    expect(screen.getByRole('status')).toHaveTextContent(
      'No se pudo guardar.',
    );
  });

  it('closes the toast from the dismiss button', async () => {
    const user = userEvent.setup();

    render(
      <ToastProvider>
        <Probe />
      </ToastProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Avisar' }));
    await user.click(screen.getByRole('button', { name: 'Cerrar aviso' }));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders the toast inside an open modal so it stays visible', async () => {
    HTMLDialogElement.prototype.showModal = function showModal() {
      this.setAttribute('open', '');
    };
    HTMLDialogElement.prototype.close = function close() {
      this.removeAttribute('open');
    };

    const user = userEvent.setup();

    render(
      <ToastProvider>
        <Probe />
        <Modal open title="Borrar publicación" onClose={() => undefined}>
          <p>¿Borrar?</p>
        </Modal>
      </ToastProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Avisar' }));

    await waitFor(() => {
      expect(document.querySelector('dialog')?.querySelector('[role="status"]')).toHaveTextContent(
        'No se pudo guardar.',
      );
    });
  });
});
