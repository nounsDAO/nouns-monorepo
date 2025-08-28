import React from 'react';

import { render } from '@testing-library/react';

import { Spinner } from './spinner';
import '@testing-library/jest-dom/vitest';

describe('Spinner', () => {
  it('renders with default classes', () => {
    const { container } = render(<Spinner />);
    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('size-10 animate-spin');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-class';
    const { container } = render(<Spinner className={customClass} />);
    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('custom-class');
  });

  it('keeps default classes when custom className is provided', () => {
    const customClass = 'custom-class';
    const { container } = render(<Spinner className={customClass} />);
    const icon = container.querySelector('svg');
    expect(icon).toHaveClass('size-10 animate-spin');
  });
});
