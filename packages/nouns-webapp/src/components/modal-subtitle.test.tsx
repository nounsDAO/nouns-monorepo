import React from 'react';

import { render, screen } from '@testing-library/react';

import ModalSubTitle from './modal-subtitle';

describe('ModalSubTitle', () => {
  it('renders provided children', () => {
    render(<ModalSubTitle>Some subtitle</ModalSubTitle>);
    expect(screen.getByText('Some subtitle')).toBeInTheDocument();
  });
});
