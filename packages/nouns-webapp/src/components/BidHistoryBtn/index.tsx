import classes from './BidHistoryBtn.module.css';

const BidHistoryBtn: React.FC<{ onClick: () => void }> = props => {
  const { onClick } = props;
  return (
    <div className={classes.bidHistoryWrapper}>
      <div className={classes.bidHistory} onClick={onClick}>
        Bid History →
      </div>
    </div>
  );
};
export default BidHistoryBtn;
