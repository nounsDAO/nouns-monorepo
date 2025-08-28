import React from 'react';

import { render, screen } from '@testing-library/react';

import Link from './link';

describe('Link', () => {
  it('renders anchor with text and href', () => {
    render(<Link text="Docs" url="https://example.com" leavesPage={false} />);
    const anchor = screen.getByRole('link', { name: 'Docs' });
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute('href', 'https://example.com');
  });

  it('opens in same tab when leavesPage is false', () => {
    render(<Link text="Home" url="/home" leavesPage={false} />);
    const anchor = screen.getByRole('link', { name: 'Home' });
    expect(anchor).toHaveAttribute('target', '_self');
    expect(anchor).toHaveAttribute('rel', 'noreferrer');
  });

  it('opens in new tab when leavesPage is true', () => {
    render(<Link text="External" url="https://example.com" leavesPage={true} />);
    const anchor = screen.getByRole('link', { name: 'External' });
    expect(anchor).toHaveAttribute('target', '_blank');
    expect(anchor).toHaveAttribute('rel', 'noreferrer');
  });
});
