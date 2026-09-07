import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useDocumentTitle } from './useDocumentTitle';

function Probe({ title }: { title: string }) {
  useDocumentTitle(title);
  return null;
}

describe('useDocumentTitle', () => {
  afterEach(() => {
    cleanup();
    document.title = '';
  });

  it('sets the document title and restores Ovillos on unmount', () => {
    const { unmount } = render(<Probe title="Feed · Ovillos" />);

    expect(document.title).toBe('Feed · Ovillos');

    unmount();

    expect(document.title).toBe('Ovillos');
  });
});
