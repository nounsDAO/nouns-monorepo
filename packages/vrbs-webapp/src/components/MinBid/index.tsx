import vrbPointerImg from '../../assets/vrb-pointer.png';
import classes from './MinBid.module.css';
import BigNumber from 'bignumber.js';
import TruncatedAmount from '../TruncatedAmount';

const MinBid: React.FC<{ minBid: BigNumber; onClick: () => void }> = props => {
  const { minBid, onClick } = props;

  return (
    <div className={classes.minBidWrapper} onClick={onClick}>
      <img src={vrbPointerImg} alt="Pointer vrb" />
      <h3 className={classes.minBid}>
        You must bid at least {minBid && <TruncatedAmount amount={minBid} />}
      </h3>
    </div>
  );
};
export default MinBid;
