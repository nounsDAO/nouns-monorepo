import { BigNumber } from 'ethers';
import classes from './AuctionActivityNounTitle.module.css';

const AuctionActivityNounTitle: React.FC<{ nounId: BigNumber }> = props => {
  const { nounId } = props;
  const nounIdContent = `Noun ${nounId.toString()}`;
  return <h1 className={classes.nounTitle}>{nounIdContent}</h1>;
};
export default AuctionActivityNounTitle;
