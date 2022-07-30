import React, { useCallback, useEffect } from 'react';
import classes from './AuctionNavigation.module.css';
import { useAppSelector } from '../../hooks';

const AuctionNavigation: React.FC<{
  isFirstAuction: boolean;
  isLastAuction: boolean;
  onPrevAuctionClick: () => void;
  onNextAuctionClick: () => void;
}> = props => {
  const { isFirstAuction, isLastAuction, onPrevAuctionClick, onNextAuctionClick } = props;
  const isCool = useAppSelector(state => state.application.stateBackgroundColor) === '#d5d7e1';

  // Page through Nouns via keyboard
  // handle what happens on key press
  const handleKeyPress = useCallback(
    event => {
      if (event.key === 'ArrowLeft') {
        if (!isFirstAuction) {
          onPrevAuctionClick();
        }
      }
      if (event.key === 'ArrowRight') {
        if (!isLastAuction) {
          onNextAuctionClick();
        }
      }
    },
    [isFirstAuction, isLastAuction, onNextAuctionClick, onPrevAuctionClick],
  );

  useEffect(() => {
    // attach the event listener
    document.addEventListener('keydown', handleKeyPress);

    // remove the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <div className={classes.navArrowsContainer}>
      <button
        onClick={() => onPrevAuctionClick()}
        className={isCool ? classes.leftArrowCool : classes.leftArrowWarm}
        disabled={isFirstAuction}
      >
        ←
      </button>
      <button
        onClick={() => onNextAuctionClick()}
        className={isCool ? classes.rightArrowCool : classes.rightArrowWarm}
        disabled={isLastAuction}
      >
        →
      </button>
    </div>
  );
};
export default AuctionNavigation;
