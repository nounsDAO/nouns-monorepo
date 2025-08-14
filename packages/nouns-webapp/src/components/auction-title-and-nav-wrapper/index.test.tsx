import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import classes from './auction-title-and-nav-wrapper.module.css';

import AuctionTitleAndNavWrapper from './index';

describe('AuctionTitleAndNavWrapper Component', () => {
  it('should render children correctly', () => {
    const testText = 'Test Child Content';
    render(
      <AuctionTitleAndNavWrapper>
        <div data-testid="child-element">{testText}</div>
      </AuctionTitleAndNavWrapper>,
    );

    const childElement = screen.getByTestId('child-element');
    expect(childElement).toBeInTheDocument();
    expect(childElement).toHaveTextContent(testText);
  });

  it('should apply the correct CSS class', () => {
    render(
      <AuctionTitleAndNavWrapper>
        <div>Test Content</div>
      </AuctionTitleAndNavWrapper>,
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveClass(classes.auctionTitleAndNavContainer);
  });

  it('should use Bootstrap Col with lg={12} prop', () => {
    render(
      <AuctionTitleAndNavWrapper>
        <div>Test Content</div>
      </AuctionTitleAndNavWrapper>,
    );

    const container = screen.getByText('Test Content').parentElement;
    expect(container).toHaveAttribute('class', expect.stringContaining('col-lg-12'));
  });

  it('should render multiple children correctly', () => {
    render(
      <AuctionTitleAndNavWrapper>
        <div data-testid="first-child">First Child</div>
        <div data-testid="second-child">Second Child</div>
      </AuctionTitleAndNavWrapper>,
    );

    expect(screen.getByTestId('first-child')).toBeInTheDocument();
    expect(screen.getByTestId('second-child')).toBeInTheDocument();
  });
});
