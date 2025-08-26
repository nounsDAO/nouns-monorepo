import React from 'react';

import { ExternalLinkIcon } from '@heroicons/react/solid';
import { i18n } from '@lingui/core';
import { blo } from 'blo';

import _trophy from '@/assets/icons/trophy.svg';
import TruncatedAmount from '@/components/truncated-amount';
import { cn } from '@/lib/utils';
import { shortENS, formatShortAddress } from '@/utils/address-and-ens-display-utils';
import { useReverseENSLookUp } from '@/utils/ens-lookup';
import { buildEtherscanTxLink } from '@/utils/etherscan';
import { containsBlockedText } from '@/utils/moderation/contains-blocked-text';
import { Address, Bid } from '@/utils/types';

interface BidHistoryModalRowProps {
  bid: Bid;
  index: number;
}

const BidHistoryModalRow: React.FC<BidHistoryModalRowProps> = ({ bid, index }) => {
  const txLink = buildEtherscanTxLink(bid.transactionHash);

  const bidAmount = <TruncatedAmount amount={BigInt(bid.value.toString())} />;

  const ens = useReverseENSLookUp(bid.sender);
  const ensMatchesBlocklistRegex = containsBlockedText(ens || '', 'en');
  const shortAddress = formatShortAddress(bid.sender);

  return (
    <li
      className={cn(
        'font-pt p-3 text-[1.1rem] font-bold transition-all duration-200 ease-in-out',
        'rounded-14 h-18 mt-3 w-full border-b-0 bg-white',
        'border-[var(--brand-cool-border)] hover:brightness-105',
      )}
    >
      <div className={cn('flex items-center justify-between')}>
        <div className={cn('flex flex-col')}>
          <div className={cn('font-pt font-bold')}>
            <div className="flex">
              <img
                alt={bid.sender}
                src={blo(bid.sender as Address)}
                className="size-10 rounded-full"
              />
              <div className="ml-2 inline-block p-0 leading-6">
                <span>
                  {ens && !ensMatchesBlocklistRegex ? shortENS(ens) : shortAddress}
                  {index === 0 && (
                    <img
                      src={_trophy}
                      alt="Winning bidder"
                      className={'ml-1 inline-block size-4'}
                    />
                  )}
                  <div className="text-brand-gray-light-text font-pt text-13 font-medium">
                    {i18n.date(new Date(Number(bid.timestamp) * 1000), {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className={cn('flex flex-row items-center justify-center')}>
          <div
            className={cn(
              'whitespace-nowrap',
              'font-pt mr-4 pt-[2px] text-[18px] font-bold',
              'text-[var(--brand-cool-dark-text)]',
            )}
          >
            {bidAmount}
          </div>
          <div
            className={cn(
              'text-[var(--brand-cool-light-text)] hover:text-[var(--brand-cool-dark-text)]',
            )}
          >
            <a href={txLink} target="_blank" rel="noreferrer">
              <div className="text-brand-gray-light-text mb-px transition-all duration-150 ease-in-out hover:cursor-pointer hover:text-black">
                <ExternalLinkIcon height={24} width={24} />
              </div>
            </a>
          </div>
        </div>
      </div>
    </li>
  );
};

export default BidHistoryModalRow;
