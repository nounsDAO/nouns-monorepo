import BigNumber from 'bignumber.js';
import classes from './CurrentBid.module.css';
import TruncatedAmount from '../TruncatedAmount';

/**
 * Passible to CurrentBid as `currentBid` prop to indicate that
 * the bid amount is not applicable to this auction. (Nounder Noun)
 */
export const BID_N_A = 'n/a';

/**
 * Special Bid type for not applicable auctions (Nounder Nouns)
 */
type BidNa = typeof BID_N_A;

const CurrentBid: React.FC<{ currentBid: BigNumber | BidNa; auctionEnded: boolean }> = props => {
  const { currentBid, auctionEnded } = props;

  const titleContent = auctionEnded ? 'Winning bid' : 'Current bid';

  return (
    <div className={classes.section}>
      <h4>{titleContent}</h4>
      <h2>
        {currentBid === BID_N_A ? BID_N_A : <TruncatedAmount amount={currentBid && currentBid} />}
      </h2>
    </div>
  );
};

export default CurrentBid;
