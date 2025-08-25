import React from 'react';

import { render, screen } from '@testing-library/react';

import { default as BrandDatePicker } from './brand-date-picker';

describe('BrandDatePicker', () => {
  it('renders the label when provided', () => {
    render(<BrandDatePicker label="Select Date" onChange={() => {}} value="" />);
    expect(screen.getByText('Select Date')).toBeInTheDocument();
  });

  it('does not render the label when not provided', () => {
    render(<BrandDatePicker onChange={() => {}} value="" />);
    expect(screen.queryByText('Select Date')).not.toBeInTheDocument();
  });

  it('renders the input with the specified value', () => {
    render(<BrandDatePicker onChange={() => {}} value="2025-08-24" label="Select Date" />);
    expect(screen.getByDisplayValue('2025-08-24')).toBeInTheDocument();
  });
});
