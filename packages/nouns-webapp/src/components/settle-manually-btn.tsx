/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';

import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from '@lingui/react/macro';
import dayjs from 'dayjs';

import { CHAIN_ID } from '@/config';
import { Auction } from '@/wrappers/nouns-auction';

const SettleManuallyBtn: React.FC<{
  settleAuctionHandler: () => void;
  auction: Auction;
}> = props => {
  const { settleAuctionHandler, auction } = props;

  const MINS_TO_ENABLE_MANUAL_SETTLEMENT = 5;

  const [settleEnabled, setSettleEnabled] = useState(false);
  const [auctionTimer, setAuctionTimer] = useState(MINS_TO_ENABLE_MANUAL_SETTLEMENT * 60);
  const auctionTimerRef = useRef(auctionTimer); // to access within setTimeout
  auctionTimerRef.current = auctionTimer;

  const timerDuration = dayjs.duration(auctionTimerRef.current, 's');

  // timer logic
  useEffect(() => {
    // Allow immediate manual settlement when testing
    if (CHAIN_ID !== 1) {
      setSettleEnabled(true);
      setAuctionTimer(0);
      return;
    }

    if (auction == null) {
      return;
    }

    const endTimeSec = Number(auction.endTime);
    const timeLeft = MINS_TO_ENABLE_MANUAL_SETTLEMENT * 60 - (dayjs().unix() - endTimeSec);

    setAuctionTimer(timeLeft);

    if (timeLeft <= 0) {
      setSettleEnabled(true);
      setAuctionTimer(0);
    } else {
      const timer = setTimeout(() => {
        setAuctionTimer(auctionTimerRef.current - 1);
      }, 1_000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [auction, auctionTimer]);

  const mins = timerDuration.minutes();

  return (
    <p className={`lg-max:text-center lg-max:ml-2 max-[660px]:ml-0`}>
      <button
        type="button"
        onClick={settleAuctionHandler}
        className="m-0 inline cursor-pointer border-0 bg-transparent p-0 underline disabled:cursor-default disabled:text-[#8c8d92] disabled:no-underline"
        disabled={!settleEnabled}
      >
        {settleEnabled ? (
          <>
            <Trans>Settle manually</Trans>
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faInfoCircle} />
            {mins !== 0 ? (
              <Trans>You can settle manually in {mins + 1} minutes</Trans>
            ) : (
              <Trans>You can settle manually in 1 minute</Trans>
            )}
          </>
        )}
      </button>
    </p>
  );
};

export default SettleManuallyBtn;
