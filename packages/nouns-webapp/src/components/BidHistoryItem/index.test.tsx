import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import dayjs from 'dayjs';
import { describe, expect, it, vi } from 'vitest';

import { BidHistoryItem } from './index';

// Mock the dependencies
vi.mock('@/assets/icons/Link.svg?react', () => ({
  default: () => <div data-testid="link-icon">Link Icon</div>,
}));

vi.mock('@/components/ShortAddress', () => ({
  default: ({ address, avatar }: { address: string; avatar?: boolean }) => (
    <div data-testid="short-address">
      Short: {address} {avatar ? '(with avatar)' : ''}
    </div>
  ),
}));

vi.mock('@/components/TruncatedAmount', () => ({
  default: ({ amount }: { amount: bigint }) => (
    <div data-testid="truncated-amount">Amount: {amount.toString()}</div>
  ),
}));

vi.mock('@/utils/etherscan', () => ({
  buildEtherscanTxLink: (hash: never) => `https://etherscan.io/tx/${hash}`,
}));

describe('BidHistoryItem Component', () => {
  const mockClasses = {
    bidRowCool: 'bidRowCool',
    bidRowWarm: 'bidRowWarm',
    bidItem: 'bidItem',
    leftSectionWrapper: 'leftSectionWrapper',
    bidder: 'bidder',
    bidDate: 'bidDate',
    rightSectionWrapper: 'rightSectionWrapper',
    bidAmount: 'bidAmount',
    linkSymbol: 'linkSymbol',
  };

  const mockBid = {
    nounId: 1n,
    sender: '0x123456789abcdef123456789abcdef123456789a',
    value: 1000000000000000000n,
    extended: false,
    transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    transactionIndex: 1,
    timestamp: BigInt(Math.floor(Date.now() / 1000)),
  };

  // Mock window.innerWidth
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: 1200, // Desktop by default
  });

  it('renders the bid information correctly', () => {
    render(<BidHistoryItem bid={mockBid} classes={mockClasses} />);

    // Check address is rendered
    expect(screen.getByTestId('short-address')).toBeInTheDocument();
    expect(screen.getByTestId('short-address')).toHaveTextContent(mockBid.sender);

    // Check amount is rendered
    expect(screen.getByTestId('truncated-amount')).toBeInTheDocument();
    expect(screen.getByTestId('truncated-amount')).toHaveTextContent(mockBid.value.toString());

    // Check the timestamp is formatted correctly
    const date = `${dayjs(Number(mockBid.timestamp) * 1000).format('MMM DD')} at ${dayjs(
      Number(mockBid.timestamp) * 1000,
    ).format('hh:mm a')}`;
    expect(screen.getByText(date)).toBeInTheDocument();

    // Check a transaction link
    expect(screen.getByTestId('link-icon')).toBeInTheDocument();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `https://etherscan.io/tx/${mockBid.transactionHash}`);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('applies warm style when isCool is false', () => {
    render(<BidHistoryItem bid={mockBid} classes={mockClasses} isCool={false} />);

    const bidRow = screen.getByRole('listitem');
    expect(bidRow).toHaveClass(mockClasses.bidRowWarm);
    expect(bidRow).not.toHaveClass(mockClasses.bidRowCool);
  });

  it('applies cool style when isCool is true', () => {
    render(<BidHistoryItem bid={mockBid} classes={mockClasses} isCool={true} />);

    const bidRow = screen.getByRole('listitem');
    expect(bidRow).toHaveClass(mockClasses.bidRowCool);
    expect(bidRow).not.toHaveClass(mockClasses.bidRowWarm);
  });

  it('defaults to warm style when isCool is not provided', () => {
    render(<BidHistoryItem bid={mockBid} classes={mockClasses} />);

    const bidRow = screen.getByRole('listitem');
    expect(bidRow).toHaveClass(mockClasses.bidRowWarm);
    expect(bidRow).not.toHaveClass(mockClasses.bidRowCool);
  });

  it('handles mobile view correctly', () => {
    // Set window width to mobile size
    window.innerWidth = 800;

    render(<BidHistoryItem bid={mockBid} classes={mockClasses} />);

    // Check ShortAddress is rendered without an avatar
    expect(screen.getByTestId('short-address')).not.toHaveTextContent('(with avatar)');

    // Reset window width
    window.innerWidth = 1200;
  });
});
