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
    <div className={cn('-mx-3 mt-0 flex flex-wrap border-0 border-solid border-neutral-200 px-0')}>
      <div
        className={cn(
          'mt-0 max-w-full flex-none border-0 border-solid border-neutral-200 px-3 lg:w-full lg:flex-none',
        )}
      >
        <h4
          className={cn(
            'font-pt line-height-1 m-0 border-0 border-solid border-neutral-200 text-lg font-bold text-slate-500 xl:text-2xl',
            isCool ? 'border-brand-cool-border border-b-2' : 'border-brand-warm-border border-b-2',
          )}
        >
          {titleContent}
        </h4>
      </div>
      <div className="mt-0 w-auto max-w-full flex-none border-0 border-solid border-neutral-200 px-3 lg:w-full lg:flex-none">
        <h2
          className={cn(
            'font-pt linee-height-1 mx-0 mb-0 mt-1 border-0 border-solid border-neutral-200 text-3xl font-bold text-slate-800 xl:text-3xl',
            isCool ? 'border-brand-cool-border border-b-2' : 'border-brand-warm-border border-b-2',
          )}
        >
          {currentBid === BID_N_A ? BID_N_A : <TruncatedAmount amount={currentBid} />}
        </h2>
      </div>
    </div>
  );
};

export default CurrentBid;
