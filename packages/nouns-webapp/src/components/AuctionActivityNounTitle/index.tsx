import { BigNumber } from 'ethers';
import { black, primary } from '../../utils/nounBgColors';
import classes from './AuctionActivityNounTitle.module.css';

const AuctionActivityNounTitle: React.FC<{
  nounId: BigNumber;
  name?: string;
  isEthereum?: boolean;
}> = props => {
  const { nounId, isEthereum, name } = props;
  const nounIdContent = `${nounId.toString()} | ${name}`;
  return (
    <div className={classes.wrapper}>
      <h1 style={{ color: isEthereum ? primary : black }}>{nounIdContent}</h1>
    </div>
  );
};
export default AuctionActivityNounTitle;
