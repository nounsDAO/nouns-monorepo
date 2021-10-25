import { BigNumber } from 'ethers';
import classes from './AuctionActivityNounTitle.module.css';
import { Link } from 'react-router-dom';

const AuctionActivityNounTitle: React.FC<{ nounId: BigNumber }> = props => {
  const { nounId } = props;
  const nounIdContent = `Noun ${nounId.toString()}`;
  return (
    <div className={classes.nounTitle}>
      <Link to={`/noun/${nounId}`}>
        <h1>{nounIdContent}</h1>
      </Link>
    </div>
  );
};
export default AuctionActivityNounTitle;
