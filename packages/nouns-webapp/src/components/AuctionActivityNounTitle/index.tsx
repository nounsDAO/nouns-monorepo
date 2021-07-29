import { BigNumber } from 'ethers';
import classes from './AuctionActivityNounTitle.module.css';

const AuctionActivityNounTitle: React.FC<{ nounId: BigNumber; nounderNoun: boolean }> = props => {
  const { nounId, nounderNoun } = props;
  const nounIdContent = `${nounderNoun ? 'Nounder ' : ''}Noun ${nounId.toString()}`;
  return <h1 className={classes.nounTitle}>{nounIdContent}</h1>;
};
export default AuctionActivityNounTitle;
