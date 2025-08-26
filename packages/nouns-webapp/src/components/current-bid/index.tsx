import React from 'react';

import { Trans } from '@lingui/react/macro';

import TruncatedAmount from '@/components/truncated-amount';
import { useAppSelector } from '@/hooks';
import { cn } from '@/lib/utils';

import classes from './current-bid.module.css';

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
        classes.wrapper,
        classes.container,
        classes.section,
        'flex flex-row items-end justify-between gap-2 lg:flex-col',
      )}
    >
      <div className={cn(classes.leftCol, 'basis-5/12 lg:w-full lg:basis-auto')}>
        <h4
          style={{
            color: isCool ? 'var(--brand-cool-light-text)' : 'var(--brand-warm-light-text)',
          }}
        >
          {titleContent}
        </h4>
      </div>
      <div className="lg:w-full">
        <h2
          className={classes.currentBid}
          style={{ color: isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)' }}
        >
          {currentBid === BID_N_A ? BID_N_A : <TruncatedAmount amount={currentBid} />}
        </h2>
      </div>
    </div>
  );
};

export default CurrentBid;
