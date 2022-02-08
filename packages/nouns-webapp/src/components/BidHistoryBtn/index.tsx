import bidBtnClasses from './BidHistoryBtn.module.css';

import { useAppSelector } from '../../hooks';

const BidHistoryBtn: React.FC<{ onClick: () => void }> = props => {
  const { onClick } = props;

  const isCool = useAppSelector(state => state.application.stateBackgroundColor) === '#d5d7e1';

  return (
    <div
      className={isCool ? bidBtnClasses.bidHistoryWrapperCool : bidBtnClasses.bidHistoryWrapperWarm}
      onClick={onClick}
    >
      <div className={bidBtnClasses.bidHistory}>View all bids</div>
    </div>
  );
};
export default BidHistoryBtn;
