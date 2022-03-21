import BigNumber from 'bignumber.js';
import classes from './CurrentBid.module.css';
import TruncatedAmount from '../TruncatedAmount';
import { Row, Col } from 'react-bootstrap';
import { useAppSelector } from '../../hooks';
import clsx from 'clsx';
import { black, primary } from '../../utils/nounBgColors';

/**
 * Passible to CurrentBid as `currentBid` prop to indicate that
 * the bid amount is not applicable to this auction. (Nounder Noun)
 */
export const BID_N_A = 'n/a';

/**
 * Special Bid type for not applicable auctions (Nounder Nouns)
 */
type BidNa = typeof BID_N_A;

const CurrentBid: React.FC<{
  currentBid: BigNumber | BidNa;
  isEthereum?: boolean;
  auctionEnded: boolean;
}> = props => {
  const { currentBid, auctionEnded, isEthereum = false } = props;
  const titleContent = auctionEnded ? 'Winning bid' : 'Current bid';

  return (
    <div className={clsx(classes.wrapper, classes.container, classes.section)}>
      <div className={classes.leftCol}>
        <h4
          style={{
            color: isEthereum ? primary : black,
          }}
        >
          {titleContent}
        </h4>
      </div>
      <div>
        <h2 className={classes.currentBid} style={{ color: isEthereum ? primary : black }}>
          {currentBid === BID_N_A ? BID_N_A : <TruncatedAmount amount={currentBid && currentBid} />}
        </h2>
      </div>
    </div>
  );
};

export default CurrentBid;
