import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { default as TruncatedAmount } from './truncated-amount';

describe('TruncatedAmount Component', () => {
  it('renders the amount formatted to 2 decimals with Ξ symbol', () => {
    const { container } = render(<TruncatedAmount amount={1000000000000000000n} />);
    expect(container.textContent).toBe('Ξ 1.00');
  });

  it('formats small values correctly to 2 decimals', () => {
    const { container } = render(<TruncatedAmount amount={123456789n} />);
    expect(container.textContent).toBe('Ξ 0.00');
  });

  it('formats decimal precision appropriately', () => {
    const { container } = render(<TruncatedAmount amount={1543222000000000000n} />);
    expect(container.textContent).toBe('Ξ 1.54');
  });
});
