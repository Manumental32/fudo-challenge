import { logout, requestLogin, useSession } from '../../lib/author';
import { Avatar } from '../../ui/Avatar';
import { Button } from '../../ui/Button';

export function AuthBar() {
  const user = useSession();

  if (!user) {
    return (
      <Button variant="secondary" className="text-xs" onClick={requestLogin}>
        Entrar
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar name={user.name} src={user.avatar} size="sm" />
      <span className="hidden max-w-28 truncate text-xs font-bold text-ink sm:inline">
        u/{user.name}
      </span>
      <Button variant="ghost" className="text-xs" onClick={logout}>
        Salir
      </Button>
    </div>
  );
}
