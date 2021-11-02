import { BigNumber } from 'ethers';
import classes from './AuctionActivityNounTitle.module.css';

const AuctionActivityNounTitle: React.FC<{ whaleId: BigNumber }> = props => {
  const { whaleId } = props;
  const whaleIdContent = `Whale ${whaleId.toString()}`;
  return (
    <div className={classes.wrapper}>
      <h1>{whaleIdContent}</h1>
    </div>
  );
};
export default AuctionActivityNounTitle;
