import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getSavedAuthorName,
  getSession,
  isOwnAuthor,
  login,
  logout,
  saveAuthorName,
} from './author';

describe('session and ownership', () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('does not treat content as own without a session', () => {
    expect(isOwnAuthor('Ana')).toBe(false);
  });

  it('stores name and avatar on login', () => {
    login({ name: 'María', avatar: 'https://example.com/a.svg' });

    expect(getSavedAuthorName()).toBe('María');
    expect(getSession()).toEqual({
      name: 'María',
      avatar: 'https://example.com/a.svg',
    });
    expect(isOwnAuthor('María')).toBe(true);
    expect(isOwnAuthor('maria')).toBe(true);
    expect(isOwnAuthor('Pedro')).toBe(false);
  });

  it('clears the session on logout', () => {
    saveAuthorName('Ana');
    logout();

    expect(getSession()).toBeNull();
    expect(isOwnAuthor('Ana')).toBe(false);
  });
});
