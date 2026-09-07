import { requestLogin, useSession } from '../../lib/author';
import { Button } from '../../ui/Button';

interface LoginGateProps {
  action: string;
}

export function LoginGate({ action }: LoginGateProps) {
  const user = useSession();

  if (user) {
    return null;
  }

  return (
    <div className="flex flex-col items-start gap-2 rounded border border-dashed border-line bg-sage px-3 py-3">
      <p className="text-sm text-copy">Iniciá sesión para {action}.</p>
      <Button variant="secondary" onClick={requestLogin}>
        Entrar
      </Button>
    </div>
  );
}
