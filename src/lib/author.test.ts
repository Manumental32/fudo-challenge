import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getSavedAuthorName,
  getSession,
  isOwnAuthor,
  login,
  logout,
  requestCreatePost,
  saveAuthorName,
  subscribeCreatePost,
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

  it('notifies subscribers when a create post is requested', () => {
    const onOpen = vi.fn();
    const unsubscribe = subscribeCreatePost(onOpen);

    requestCreatePost();

    expect(onOpen).toHaveBeenCalledOnce();
    unsubscribe();
  });

  it('clears the session on logout', () => {
    saveAuthorName('Ana');
    logout();

    expect(getSession()).toBeNull();
    expect(isOwnAuthor('Ana')).toBe(false);
  });
});
