import React from 'react';

import { render, screen } from '@testing-library/react';

import Section from './section';

describe('Section', () => {
  it('renders children', () => {
    render(
      <Section fullWidth>
        <span>Child content</span>
      </Section>,
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});
