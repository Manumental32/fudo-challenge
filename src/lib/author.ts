import { useEffect, useState } from 'react';

const LEGACY_NAME_KEY = 'fudo-author-name';
const STORAGE_KEY = 'fudo-session';
const AUTHOR_EVENT = 'fudo-author-changed';
const LOGIN_EVENT = 'fudo-request-login';
const CREATE_POST_EVENT = 'fudo-request-create-post';

export interface SessionUser {
  name: string;
  avatar: string;
}

export const AVATAR_STYLES = [
  'adventurer',
  'lorelei',
  'notionists',
  'bottts',
  'fun-emoji',
  'initials',
] as const;

export function avatarFor(name: string, style = 'initials'): string {
  const seed = encodeURIComponent(name.trim() || 'ovillos');
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}`;
}

export function avatarChoices(name: string): string[] {
  return AVATAR_STYLES.map((style) => avatarFor(name, style));
}

function readSession(): SessionUser | null {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<SessionUser>;
      const name = parsed.name?.trim() ?? '';

      if (name) {
        return {
          name,
          avatar: parsed.avatar?.trim() || avatarFor(name),
        };
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const legacy = localStorage.getItem(LEGACY_NAME_KEY)?.trim();

  if (!legacy) {
    return null;
  }

  const migrated = { name: legacy, avatar: avatarFor(legacy) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
  localStorage.removeItem(LEGACY_NAME_KEY);
  return migrated;
}

function emitChange(): void {
  window.dispatchEvent(new Event(AUTHOR_EVENT));
}

export function getSession(): SessionUser | null {
  return readSession();
}

export function getSavedAuthorName(): string {
  return readSession()?.name ?? '';
}

export function login(user: SessionUser): void {
  const name = user.name.trim();

  if (!name) {
    return;
  }

  const session = {
    name,
    avatar: user.avatar.trim() || avatarFor(name),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  localStorage.removeItem(LEGACY_NAME_KEY);
  emitChange();
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_NAME_KEY);
  emitChange();
}

export function saveAuthorName(name: string): void {
  login({ name, avatar: avatarFor(name) });
}

export function requestLogin(): void {
  window.dispatchEvent(new Event(LOGIN_EVENT));
}

export function isOwnAuthor(
  authorName: string,
  current = getSavedAuthorName(),
): boolean {
  if (!current || !authorName.trim()) {
    return false;
  }

  return (
    current.localeCompare(authorName.trim(), 'es', {
      sensitivity: 'base',
    }) === 0
  );
}

export function useSession(): SessionUser | null {
  const [user, setUser] = useState(getSession);

  useEffect(() => {
    function sync(): void {
      setUser(getSession());
    }

    window.addEventListener(AUTHOR_EVENT, sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener(AUTHOR_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return user;
}

export function useCurrentAuthor(): string {
  return useSession()?.name ?? '';
}

export function subscribeLoginModal(onOpen: () => void): () => void {
  window.addEventListener(LOGIN_EVENT, onOpen);
  return () => window.removeEventListener(LOGIN_EVENT, onOpen);
}

export function requestCreatePost(): void {
  window.dispatchEvent(new Event(CREATE_POST_EVENT));
}

export function subscribeCreatePost(onOpen: () => void): () => void {
  window.addEventListener(CREATE_POST_EVENT, onOpen);
  return () => window.removeEventListener(CREATE_POST_EVENT, onOpen);
}
