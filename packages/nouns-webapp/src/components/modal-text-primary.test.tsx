import React from 'react';

import { render, screen } from '@testing-library/react';

import ModalTextPrimary from './modal-text-primary';

describe('ModalTextPrimary', () => {
  it('renders provided children', () => {
    render(<ModalTextPrimary>Primary text</ModalTextPrimary>);
    expect(screen.getByText('Primary text')).toBeInTheDocument();
  });
});
