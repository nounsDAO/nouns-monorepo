import { Auction } from '../../../../wrappers/nounsAuction';
import { utils } from 'ethers';
import classes from './CurrentBid.module.css';

const CurrentBid: React.FC<{ auction: Auction; auctionEnded: boolean }> = props => {
  const { auction, auctionEnded } = props;

  const currentBid = auction ? `${utils.formatEther(auction.amount)} ETH` : '';

  const titleContent = auctionEnded ? 'Winning bid' : 'Current bid';

  return (
    <div className={classes.section}>
      <h2>{auction && titleContent}</h2>
      <span>{currentBid}</span>
    </div>
  );
};

export default CurrentBid;
