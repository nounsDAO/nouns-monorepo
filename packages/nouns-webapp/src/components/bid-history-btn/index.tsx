import React from 'react';

import { Trans } from '@lingui/react/macro';

import { useAppSelector } from '@/hooks';

import bidBtnClasses from './bid-history-btn.module.css';

interface BidHistoryBtnProps {
  onClick: () => void;
}

const BidHistoryBtn: React.FC<BidHistoryBtnProps> = ({ onClick }) => {
  const isCool = useAppSelector(state => state.application.stateBackgroundColor) === '#d5d7e1';

  return (
    <div
      className={isCool ? bidBtnClasses.bidHistoryWrapperCool : bidBtnClasses.bidHistoryWrapperWarm}
      onClick={onClick}
    >
      <div className={bidBtnClasses.bidHistory}>
        <Trans>View all bids</Trans>
      </div>
    </div>
  );
};
export default BidHistoryBtn;
