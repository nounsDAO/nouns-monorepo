import { Auction } from '../../../wrappers/nounsAuction';
import { utils } from 'ethers';
import classes from './CurrentBid.module.css';

const CurrentBid: React.FC<{ auction: Auction }> = props => {
  const { auction } = props;

  const currentBid = auction ? `${utils.formatEther(auction.amount)} Ξ` : '';

  return (
    <div className={classes.section}>
      <h2>Current bid:</h2>
      <span>{currentBid}</span>
    </div>
  );
};

export default CurrentBid;
