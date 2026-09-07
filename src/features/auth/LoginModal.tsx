import { useEffect, useState } from 'react';
import { subscribeLoginModal } from '../../lib/author';
import { Modal } from '../../ui/Modal';
import { LoginForm } from './LoginForm';

export function LoginModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => subscribeLoginModal(() => setOpen(true)), []);

  return (
    <Modal open={open} title="Iniciar sesión" onClose={() => setOpen(false)}>
      <LoginForm onSuccess={() => setOpen(false)} />
    </Modal>
  );
}
