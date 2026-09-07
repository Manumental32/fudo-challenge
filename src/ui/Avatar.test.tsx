import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('shows the initial when there is no image', () => {
    render(<Avatar name="Maquino" src="" />);

    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('falls back to the initial when the image fails', () => {
    render(
      <Avatar
        name="Maquino"
        src="https://media.licdn.com/blocked.jpg"
      />,
    );

    const image = document.querySelector('img');

    if (!image) {
      throw new Error('expected an avatar image');
    }

    fireEvent.error(image);

    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
