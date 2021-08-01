import nounPointerImg from '../../assets/noun-pointer.png';
import classes from './BidHistoryBtn.module.css';

const BidHistoryBtn: React.FC<{ onClick: () => void }> = props => {
  const { onClick } = props;
  return (
    <div className={classes.bidHistoryWrapper}>
      <img src={nounPointerImg} alt="Pointer noun" />
      <div className={classes.bidHistory} onClick={onClick}>
        See bid history
      </div>
    </div>
  );
};
export default BidHistoryBtn;
