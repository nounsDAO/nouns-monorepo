import React from 'react';

import { Trans } from '@lingui/react/macro';

import TruncatedAmount from '@/components/truncated-amount';
import { useAppSelector } from '@/hooks';
import { cn } from '@/lib/utils';

/**
 * Passible to CurrentBid as `currentBid` prop to indicate that
 * the bid amount is not applicable to this auction. (Nounder Noun)
 */
export const BID_N_A = 'n/a';

/**
 * Special Bid type for not applicable auctions (Nounder Nouns)
 */
type BidNa = typeof BID_N_A;

interface CurrentBidProps {
  currentBid: bigint | BidNa;
  auctionEnded: boolean;
}

const CurrentBid: React.FC<CurrentBidProps> = props => {
  const { currentBid, auctionEnded } = props;
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const titleContent = auctionEnded ? <Trans>Winning bid</Trans> : <Trans>Current bid</Trans>;

  return (
    <div
      className={cn(
        'max-lg:w-full max-lg:mx-0 max-lg:justify-between px-0',
        'flex flex-row items-end justify-between gap-2 lg:flex-col',
      )}
    >
      <div className={cn('max-lg:pl-2', 'basis-5/12 lg:w-full lg:basis-auto')}>
        <h4
          className="font-pt max-lg:mb-0 max-lg:mt-1.5 text-lg font-bold"
          style={{
            color: isCool ? 'var(--brand-cool-light-text)' : 'var(--brand-warm-light-text)',
          }}
        >
          {titleContent}
        </h4>
      </div>
      <div className="lg:w-full">
        <h2
          className="font-pt text-32 mt-0.75 max-lg:text-23 max-lg:mr-2 mb-0 font-bold"
          style={{ color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)' }}
        >
          {currentBid === BID_N_A ? BID_N_A : <TruncatedAmount amount={currentBid} />}
        </h2>
      </div>
    </div>
  );
};

export default CurrentBid;
