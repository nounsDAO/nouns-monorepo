import type { Address } from '@/utils/types';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import dayjs from 'dayjs';
import { describe, expect, it, vi } from 'vitest';

import { BidHistoryItem } from './bid-history-item';

// Mock the dependencies
vi.mock('@/assets/icons/Link.svg?react', () => ({
  default: () => <div data-testid="link-icon">Link Icon</div>,
}));

vi.mock('@/components/short-address', () => ({
  default: ({ address, avatar }: { address: string; avatar?: boolean }) => (
    <div data-testid="short-address">
      Short: {address} {avatar === true ? '(with avatar)' : ''}
    </div>
  ),
}));

vi.mock('@/components/truncated-amount', () => ({
  default: ({ amount }: { amount: bigint }) => (
    <div data-testid="truncated-amount">Amount: {amount.toString()}</div>
  ),
}));

vi.mock('@/utils/etherscan', () => ({
  buildEtherscanTxLink: (hash: never) => `https://etherscan.io/tx/${hash}`,
}));

describe('BidHistoryItem Component', () => {
  const mockBid = {
    nounId: 1n,
    sender: '0x123456789abcdef123456789abcdef123456789a' as Address,
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
    render(<BidHistoryItem bid={mockBid} />);

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

  it('applies cool style when isCool is true', () => {
    render(<BidHistoryItem bid={mockBid} isCool={true} />);

    const bidRow = screen.getByRole('listitem');
    expect(bidRow).toHaveClass('text-[1.1rem]');
    expect(bidRow).toHaveClass('p-3');
    expect(bidRow).not.toHaveClass('text-[0.95rem]');
  });

  it('defaults to warm style when isCool is not provided', () => {
    render(<BidHistoryItem bid={mockBid} />);

    const bidRow = screen.getByRole('listitem');
    expect(bidRow).toHaveClass('text-[0.95rem]');
    expect(bidRow).not.toHaveClass('text-[1.1rem]');
  });

  it('handles mobile view correctly', () => {
    // Set window width to mobile size
    window.innerWidth = 800;

    render(<BidHistoryItem bid={mockBid} />);

    // Check ShortAddress is rendered without an avatar
    expect(screen.getByTestId('short-address')).not.toHaveTextContent('(with avatar)');

    // Reset window width
    window.innerWidth = 1200;
  });
});
