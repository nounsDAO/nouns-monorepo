import React, { useCallback, useEffect } from 'react';
import classes from './AuctionNavigation.module.css';
import { useAppSelector } from '../../hooks';
import { useHistory } from 'react-router';
import useOnDisplayAuction from '../../wrappers/onDisplayAuction';

const AuctionNavigation: React.FC<{
  isFirstAuction: boolean;
  isLastAuction: boolean;
  onPrevAuctionClick: () => void;
  onNextAuctionClick: () => void;
}> = props => {
  const { isFirstAuction, isLastAuction, onPrevAuctionClick, onNextAuctionClick } = props;
  const isCool = useAppSelector(state => state.application.stateBackgroundColor) === '#d5d7e1';
  const history = useHistory();
  const onDisplayAuction = useOnDisplayAuction();
  const lastAuctionNounBRId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounBRId);
  const onDisplayAuctionNounBRId = onDisplayAuction?.nounbrId.toNumber();

  // Page through NounsBR via keyboard
  // handle what happens on key press
  const handleKeyPress = useCallback(
    event => {
      if (event.key === 'ArrowLeft') {
        // This is a hack. If we don't put this the first keystoke
        // from the nounbr at / doesn't work (i.e. to go from current nounbr to current nounbr - 1 would take two arrow presses)
        if (onDisplayAuctionNounBRId === lastAuctionNounBRId) {
          history.push(`/nounbr/${lastAuctionNounBRId}`);
        }

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
    [
      history,
      isFirstAuction,
      isLastAuction,
      lastAuctionNounBRId,
      onDisplayAuctionNounBRId,
      onNextAuctionClick,
      onPrevAuctionClick,
    ],
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
