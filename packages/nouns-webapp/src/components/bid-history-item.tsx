import React from 'react';

import dayjs from 'dayjs';
import { isTruthy } from 'remeda';

import LinkIcon from '@/assets/icons/Link.svg?react';
import ShortAddress from '@/components/short-address';
import TruncatedAmount from '@/components/truncated-amount';
import { cn } from '@/lib/utils';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import { Bid } from '@/utils/types';

interface BidHistoryItemProps {
  bid: Bid;
  isCool?: boolean;
}

export const BidHistoryItem: React.FC<BidHistoryItemProps> = ({ bid, isCool }) => {
  const bidAmount = <TruncatedAmount amount={BigInt(bid.value.toString())} />;
  const date = `${dayjs(Number(bid.timestamp) * 1000).format('MMM DD')} at ${dayjs(
    Number(bid.timestamp) * 1000,
  ).format('hh:mm a')}`;

  const txLink = buildEtherscanTxLink(bid.transactionHash);
  const isMobile = window.innerWidth < 992;

  return (
    <li
      className={cn(
        'font-pt border-b font-bold transition-all duration-200 ease-in-out hover:brightness-105',
        isTruthy(isCool)
          ? 'border-brand-cool-border text-brand-cool-dark-text p-3 text-[1.1rem]'
          : 'border-brand-warm-border text-brand-warm-dark-text px-3 pb-2 pt-1 text-[0.95rem]',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="font-pt font-bold">
            <div
              className={`font-pt text-[18px] font-bold ${
                isTruthy(isCool) ? 'text-brand-cool-dark-text' : 'text-brand-warm-dark-text'
              }`}
            >
              <ShortAddress address={bid.sender} avatar={!isMobile} />
            </div>
          </div>
          <div className="hidden text-gray-500">{date}</div>
        </div>
        <div className="flex flex-row items-center justify-center">
          <div className="font-pt mr-4 pt-[2px] text-[18px] font-bold">{bidAmount}</div>
          <div className="text-brand-cool-light-text hover:text-brand-cool-dark-text">
            <a href={txLink} target="_blank" rel="noreferrer">
              <LinkIcon width={24} height={24} aria-label="link symbol" />
            </a>
          </div>
        </div>
      </div>
    </li>
  );
};
