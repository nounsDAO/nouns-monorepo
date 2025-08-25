import React from 'react';

import { render } from '@testing-library/react';

import { default as AuctionActivityWrapper } from './auction-activity-wrapper';

describe('AuctionActivityWrapper', () => {
  it('should render children inside a div with appropriate class', () => {
    const { getByText } = render(
      <AuctionActivityWrapper>
        <p>Test Child</p>
      </AuctionActivityWrapper>,
    );

    const childElement = getByText('Test Child');
    expect(childElement).toBeInTheDocument();
    expect(childElement.parentElement).toHaveClass('max-lg:mx-4');
  });
});
