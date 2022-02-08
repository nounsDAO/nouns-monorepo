import { useState, useEffect, useRef } from 'react';
import { Auction } from '../../wrappers/nounsAuction';
import classes from './SettleManuallyBtn.module.css';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

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
    const timeLeft =
      MINS_TO_ENABLE_MANUAL_SETTLEMENT * 60 -
      (dayjs().unix() - (auction && Number(auction.endTime)));

    setAuctionTimer(auction && timeLeft);

    if (auction && timeLeft <= 0) {
      setSettleEnabled(true);
      setAuctionTimer(0);
    } else {
      const timer = setTimeout(() => {
        setAuctionTimer(auctionTimerRef.current - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [auction, auctionTimer]);

  const mins = timerDuration.minutes();
  const minsContent = () => `${mins + 1} minute${mins !== 0 ? 's' : ''}`;

  return (
    <p className={classes.emergencySettleWrapper}>
      <button
        onClick={settleAuctionHandler}
        className={classes.emergencySettleButton}
        disabled={!settleEnabled}
      >
        {settleEnabled ? (
          <>{` Settle manually`}</>
        ) : (
          <>
            <FontAwesomeIcon icon={faInfoCircle} />
            {` You can settle manually in ${minsContent()}`}
          </>
        )}
      </button>
    </p>
  );
};

export default SettleManuallyBtn;
