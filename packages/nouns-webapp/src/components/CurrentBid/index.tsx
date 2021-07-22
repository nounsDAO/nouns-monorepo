import { BigNumber } from 'ethers';
import classes from './CurrentBid.module.css';
import TruncatedAmount from '../TruncatedAmount';

const CurrentBid: React.FC<{ currentBid: BigNumber; auctionEnded: boolean }> = props => {
  const { currentBid, auctionEnded } = props;

  const titleContent = auctionEnded ? 'Winning bid' : 'Current bid';

  return (
    <div className={classes.section}>
      <h2>{titleContent}</h2>
      <span>
        <TruncatedAmount amount={currentBid ? currentBid : BigNumber.from(0)} />
      </span>
    </div>
  );
};

export default CurrentBid;
