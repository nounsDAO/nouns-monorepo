import React from 'react';

import { render, screen, within } from '@testing-library/react';

import ModalTitle from './modal-title';

describe('ModalTitle', () => {
  it('renders children inside an h1 heading', () => {
    render(
      <ModalTitle>
        <span>Important Title</span>
      </ModalTitle>,
    );

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(within(heading).getByText('Important Title')).toBeInTheDocument();
  });
});
