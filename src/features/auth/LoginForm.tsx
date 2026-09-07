import { useMemo, useState, type FormEvent } from 'react';
import { AVATAR_STYLES, avatarChoices, login } from '../../lib/author';
import { useDebouncedValue } from '../../lib/useDebouncedValue';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [name, setName] = useState('');
  const [styleIndex, setStyleIndex] = useState(0);
  const avatarSeed = useDebouncedValue(name.trim() || 'fudo', 280);
  const choices = useMemo(() => avatarChoices(avatarSeed), [avatarSeed]);
  const selected = choices[styleIndex] ?? choices[0] ?? '';
  const pending = (name.trim() || 'fudo') !== avatarSeed;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      return;
    }

    login({ name: trimmed, avatar: selected });
    onSuccess();
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <p className="text-sm text-copy">
        Elegí un usuario y un avatar. Se van a usar en todo lo que publiques.
      </p>
      <Input
        label="Nombre de usuario"
        name="username"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        autoComplete="username"
        placeholder="u/tu-nombre"
      />
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-ink">
          Avatar
        </legend>
        <div
          className={`grid grid-cols-3 justify-items-center gap-3 transition-opacity duration-200 sm:grid-cols-6 motion-reduce:transition-none ${
            pending ? 'opacity-50' : 'opacity-100'
          }`}
        >
          {choices.map((src, index) => (
            <button
              key={AVATAR_STYLES[index] ?? src}
              type="button"
              onClick={() => setStyleIndex(index)}
              className={`size-12 cursor-pointer overflow-hidden rounded-full p-0 outline-none ring-2 ring-offset-2 ${
                styleIndex === index
                  ? 'ring-brand-text'
                  : 'ring-transparent hover:ring-line focus-visible:ring-brand-text'
              }`}
              aria-label={`Avatar ${index + 1} de ${choices.length}`}
              aria-pressed={styleIndex === index}
            >
              <img
                key={src}
                src={src}
                alt=""
                className="avatar-swap size-full rounded-full bg-sage object-cover"
              />
            </button>
          ))}
        </div>
      </fieldset>
      <div className="flex justify-end">
        <Button type="submit">Entrar</Button>
      </div>
    </form>
  );
}
