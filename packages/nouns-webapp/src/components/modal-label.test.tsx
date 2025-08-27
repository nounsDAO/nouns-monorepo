import React from 'react';

import { render, screen } from '@testing-library/react';

import ModalLabel from './modal-label';

describe('ModalLabel', () => {
  it('renders provided children', () => {
    render(<ModalLabel>Label text</ModalLabel>);
    expect(screen.getByText('Label text')).toBeInTheDocument();
  });
});
