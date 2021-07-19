import nounPointerImg from '../../assets/noun-pointer.png';
import classes from './MinBid.module.css';

const MinBid: React.FC<{ minBid: number; onClick: () => void }> = props => {
  const { minBid, onClick } = props;

  return (
    <div className={classes.minBidWrapper} onClick={onClick}>
      <img src={nounPointerImg} alt="Pointer noun" />
      <h3 className={classes.minBid}>You must bid at least {minBid && minBid} ETH</h3>
    </div>
  );
};
export default MinBid;
