import { logout, requestCreatePost, useSession } from '../../lib/author';
import { Avatar } from '../../ui/Avatar';
import { Button } from '../../ui/Button';

export function AuthBar() {
  const user = useSession();

  return (
    <div className="flex items-center gap-2">
      <Button className="text-xs" onClick={requestCreatePost}>
        Crear post
      </Button>
      {user ? (
        <>
          <Avatar name={user.name} src={user.avatar} size="sm" />
          <span className="hidden max-w-28 truncate text-xs font-bold text-ink sm:inline">
            u/{user.name}
          </span>
          <Button variant="ghost" className="text-xs" onClick={logout}>
            Salir
          </Button>
        </>
      ) : null}
    </div>
  );
}
