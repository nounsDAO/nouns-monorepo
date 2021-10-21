import { BigNumber } from 'ethers';
import classes from './AuctionActivityNounTitle.module.css';
import { Link } from 'react-router-dom';

const AuctionActivityNounTitle: React.FC<{ nounId: BigNumber }> = props => {
  const { nounId } = props;
  const nounIdContent = `Noun ${nounId.toString()}`;
  return (
    <Link to={`/noun/${nounId}`}>
      <h1 className={classes.nounTitle}>{nounIdContent}</h1>
    </Link>
  );
};
export default AuctionActivityNounTitle;
