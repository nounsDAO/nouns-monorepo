import type { Address } from '@/utils/types';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAuctionBids } from '@/wrappers/on-display-auction';

import BidHistory from './bid-history';

// Mock dependencies
vi.mock('@/hooks', () => ({
  useAppSelector: () => true, // Mock isCool to be true
}));

vi.mock('@/wrappers/on-display-auction', () => ({
  useAuctionBids: vi.fn(),
}));

vi.mock('@/components/bid-history-item', () => ({
  BidHistoryItem: ({
    bid,
    isCool,
  }: {
    bid: {
      value: bigint;
      sender: string;
    };
    classes?: Record<string, string>;
    isCool: boolean;
  }) => (
    <div data-testid="bid-history-item">
      Bid: {bid.value.toString()} | Sender: {bid.sender} | Cool: {isCool ? 'yes' : 'no'}
    </div>
  ),
}));

describe('BidHistory Component', () => {
  const mockBids: {
    extended: boolean;
    nounId: bigint;
    sender: Address;
    timestamp: bigint;
    transactionHash: string;
    transactionIndex: number;
    value: bigint;
  }[] = [
    {
      nounId: BigInt('1'),
      sender: '0x123456789abcdef123456789abcdef123456789a',
      value: BigInt('3000000000000000000'),
      extended: false,
      transactionHash: '0xabc1',
      transactionIndex: 1,
      timestamp: BigInt(1654000003),
    },
    {
      nounId: BigInt('1'),
      sender: '0x123456789abcdef123456789abcdef123456788b',
      value: BigInt('2000000000000000000'),
      extended: false,
      transactionHash: '0xabc2',
      transactionIndex: 2,
      timestamp: BigInt(1654000002),
    },
    {
      nounId: BigInt('1'),
      sender: '0x123456789abcdef123456789abcdef123456787c',
      value: BigInt('1000000000000000000'),
      extended: false,
      transactionHash: '0xabc3',
      transactionIndex: 3,
      timestamp: BigInt(1654000001),
    },
  ];

  it('renders nothing when no bids are available', () => {
    vi.mocked(useAuctionBids).mockReturnValue(undefined);

    render(<BidHistory auctionId="1" max={10} />);

    const bidCollection = screen.getByRole('list');
    expect(bidCollection).toBeEmptyDOMElement();
  });

  it('renders bids sorted by timestamp in descending order', () => {
    vi.mocked(useAuctionBids).mockReturnValue(mockBids);

    render(<BidHistory auctionId="1" max={10} />);

    const bidItems = screen.getAllByTestId('bid-history-item');
    expect(bidItems).toHaveLength(3);

    // First item should be the most recent bid
    expect(bidItems[0]).toHaveTextContent('3000000000000000000');
    expect(bidItems[1]).toHaveTextContent('2000000000000000000');
    expect(bidItems[2]).toHaveTextContent('1000000000000000000');
  });

  it('limits the number of displayed bids to the max prop', () => {
    vi.mocked(useAuctionBids).mockReturnValue(mockBids);

    render(<BidHistory auctionId="1" max={2} />);

    const bidItems = screen.getAllByTestId('bid-history-item');
    expect(bidItems).toHaveLength(2);

    // Should only show the two most recent bids
    expect(bidItems[0]).toHaveTextContent('3000000000000000000');
    expect(bidItems[1]).toHaveTextContent('2000000000000000000');
  });

  it('passes the correct props to BidHistoryItem', () => {
    vi.mocked(useAuctionBids).mockReturnValue([mockBids[0]]);

    render(<BidHistory auctionId="1" max={10} />);

    const bidItem = screen.getByTestId('bid-history-item');
    expect(bidItem).toHaveTextContent(`Bid: ${mockBids[0].value.toString()}`);
    expect(bidItem).toHaveTextContent(`Sender: ${mockBids[0].sender}`);
    expect(bidItem).toHaveTextContent('Cool: yes'); // We mocked isCool to be true
  });

  it('converts auctionId from string to BigInt when calling useAuctionBids', () => {
    vi.mocked(useAuctionBids).mockReturnValue([]);

    render(<BidHistory auctionId="42" max={10} />);

    expect(useAuctionBids).toHaveBeenCalledWith(BigInt(42));
  });
});
