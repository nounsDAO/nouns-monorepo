import bidBtnClasses from '../BidHistoryBtn/BidHistoryBtn.module.css';
import { useAppSelector } from '../../hooks';
import { Trans } from '@lingui/macro';
import { Col } from 'react-bootstrap';

const BidHistoryToggle: React.FC<{
  onBidsClick: () => void;
  onCommentsClick: () => void;
  isBidsToggleActive: boolean;
}> = props => {
  const { onBidsClick, onCommentsClick, isBidsToggleActive } = props;

  const isCool = useAppSelector(state => state.application.stateBackgroundColor) === '#d5d7e1';

  const Bids: React.FC = () => (
    <div
      className={
        isCool
          ? isBidsToggleActive
            ? bidBtnClasses.bidHistoryWrapperCoolActive
            : bidBtnClasses.bidHistoryWrapperCool
          : isBidsToggleActive
          ? bidBtnClasses.bidHistoryWrapperWarmActive
          : bidBtnClasses.bidHistoryWrapperWarm
      }
      onClick={onBidsClick}
    >
      <Col lg={12} className={bidBtnClasses.currentBidsCol}>
        <Trans>Bids</Trans>
      </Col>
    </div>
  );

  const Comments: React.FC = () => (
    <div
      className={
        isCool
          ? isBidsToggleActive
            ? bidBtnClasses.bidHistoryWrapperCool 
            : bidBtnClasses.bidHistoryWrapperCoolActive
          : isBidsToggleActive
          ? bidBtnClasses.bidHistoryWrapperWarm
          : bidBtnClasses.bidHistoryWrapperWarmActive
      }
      onClick={onCommentsClick}
    >
      <Col lg={12} className={bidBtnClasses.auctionCommentsCol}>
        <Trans>Comments</Trans>
      </Col>
    </div>
  );

  return (
    <>
      <div className={bidBtnClasses.container}>
        <Bids />
        <Comments />
      </div>
    </>
  );
};

export default BidHistoryToggle;
