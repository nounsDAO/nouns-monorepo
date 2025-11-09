import React from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import NavBarItem from './nav-bar-item';

describe('NavBarItem', () => {
  it('renders children', () => {
    render(
      <NavBarItem>
        <span>Menu Item</span>
      </NavBarItem>,
    );
    expect(screen.getByText('Menu Item')).toBeInTheDocument();
  });

  it('invokes onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <NavBarItem onClick={onClick}>
        <span>Clickable</span>
      </NavBarItem>,
    );
    await user.click(screen.getByText('Clickable'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
