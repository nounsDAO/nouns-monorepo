import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

import { Trans } from '@lingui/react/macro';
import { Button, Col, FormControl, InputGroup, Spinner } from 'react-bootstrap';
import { formatEther, parseEther } from 'viem';

import SettleManuallyBtn from '@/components/SettleManuallyBtn';
import WalletConnectModal from '@/components/WalletConnectModal';
import {
  useReadNounsAuctionHouseMinBidIncrementPercentage,
  useWriteNounsAuctionHouseCreateBid,
  useWriteNounsAuctionHouseSettleCurrentAndCreateNewAuction,
} from '@/contracts';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useActiveLocale } from '@/hooks/useActivateLocale';
import { AlertModal, setAlertModal } from '@/state/slices/application';
import { Auction } from '@/wrappers/nounsAuction';

import classes from './Bid.module.css';

import responsiveUiUtilsClasses from '@/utils/ResponsiveUIUtils.module.css';

const computeMinimumNextBid = (
  currentBid: bigint,
  minBidIncPercentage: bigint | undefined,
): bigint => {
  if (!minBidIncPercentage) {
    return 0n;
  }
  // Calculate minBidIncPercentage/100 + 1 with bigint
  // Since bigint division truncates, we multiply first then divide to maintain precision
  return (currentBid * (minBidIncPercentage + 100n)) / 100n;
};

const minBidEth = (minBid: bigint): string => {
  if (minBid === 0n) {
    return '0.01';
  }

  const eth = formatEther(minBid);
  // We need to round up to 2 decimal places
  const ethNum = parseFloat(eth);
  return (Math.ceil(ethNum * 100) / 100).toFixed(2);
};

const currentBid = (bidInputRef: React.RefObject<HTMLInputElement>) => {
  if (!bidInputRef.current || !bidInputRef.current.value) {
    return 0n;
  }
  return parseEther(bidInputRef.current.value);
};

interface BidProps {
  auction: Auction;
  auctionEnded: boolean;
}

const Bid: React.FC<BidProps> = props => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const { auction, auctionEnded } = props;
  const activeLocale = useActiveLocale();

  const account = useAppSelector(state => state.account.activeAccount);

  const bidInputRef = useRef<HTMLInputElement>(null);

  const [bidInput, setBidInput] = useState('');

  const [bidButtonContent, setBidButtonContent] = useState({
    loading: false,
    content: auctionEnded ? <Trans>Settle</Trans> : <Trans>Place bid</Trans>,
  });

  const [showConnectModal, setShowConnectModal] = useState(false);

  const hideModalHandler = () => {
    setShowConnectModal(false);
  };

  const dispatch = useAppDispatch();
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

  const { data: minBidIncPercentage } = useReadNounsAuctionHouseMinBidIncrementPercentage();
  const minBid = computeMinimumNextBid(
    auction && BigInt(auction.amount?.toString() ?? '0'),
    minBidIncPercentage ? BigInt(minBidIncPercentage.toString()) : undefined,
  );

  const {
    writeContract: placeBid,
    isPending: isPlacingBid,
    isError: didPlaceBidFail,
    isIdle: isPlaceBidIdle,
    error: placeBidError,
  } = useWriteNounsAuctionHouseCreateBid();

  const {
    writeContract: settleAuction,
    isPending: isSettlingAuction,
    isSuccess: didSettleAuction,
    isError: didSettleFail,
    isIdle: isSettleIdle,
    error: settleAuctionError,
  } = useWriteNounsAuctionHouseSettleCurrentAndCreateNewAuction();

  const bidInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    // disable more than 2 digits after the decimal point
    if (input.includes('.') && event.target.value.split('.')[1].length > 2) {
      return;
    }

    setBidInput(event.target.value);
  };

  const placeBidHandler = async () => {
    if (!auction || !bidInputRef.current || !bidInputRef.current.value) {
      return;
    }

    if (currentBid(bidInputRef) < minBid) {
      setModal({
        show: true,
        title: <Trans>Insufficient bid amount 🤏</Trans>,
        message: (
          <Trans>
            Please place a bid higher than or equal to the minimum bid amount of {minBidEth(minBid)}{' '}
            ETH
          </Trans>
        ),
      });
      setBidInput(minBidEth(minBid));
      return;
    }

    const value = parseEther(bidInputRef.current.value);
    placeBid({
      args: [BigInt(auction.nounId)],
      value,
    });
  };

  const settleAuctionHandler = () => {
    settleAuction({});
  };

  const clearBidInput = () => {
    if (bidInputRef.current) {
      bidInputRef.current.value = '';
    }
  };

  // successful bid using redux store state
  useEffect(() => {
    if (!account) return;

    // tx state is mining
    const isMiningUserTx = isPlacingBid;
    // allows user to rebid against themselves so long as it is different tx
    const isCorrectTx = currentBid(bidInputRef) === BigInt(auction.amount?.toString() ?? '0');
    if (isMiningUserTx && auction.bidder === account && isCorrectTx) {
      setModal({
        title: <Trans>Success</Trans>,
        message: <Trans>Bid was placed successfully!</Trans>,
        show: true,
      });
      setBidButtonContent({ loading: false, content: <Trans>Place bid</Trans> });
      clearBidInput();
    }
  }, [auction, account, setModal, isPlacingBid]);

  // placing bid transaction state hook
  useEffect(() => {
    if (!auctionEnded && isPlaceBidIdle) {
      setBidButtonContent({
        loading: false,
        content: <Trans>Place bid</Trans>,
      });
    } else if (!auctionEnded && isPlacingBid) {
      setBidButtonContent({ loading: true, content: <></> });
    } else if (!auctionEnded && didPlaceBidFail) {
      setModal({
        title: <Trans>Transaction Failed</Trans>,
        message: placeBidError?.message || <Trans>Please try again.</Trans>,
        show: true,
      });
      setBidButtonContent({ loading: false, content: <Trans>Bid</Trans> });
    }
  }, [
    auctionEnded,
    setModal,
    isPlaceBidIdle,
    isPlacingBid,
    didPlaceBidFail,
    placeBidError?.message,
  ]);

  // settle auction transaction state hook
  useEffect(() => {
    if (auctionEnded && isSettleIdle) {
      setBidButtonContent({
        loading: false,
        content: <Trans>Settle Auction</Trans>,
      });
    } else if (auctionEnded && isSettlingAuction) {
      setBidButtonContent({ loading: true, content: <></> });
    } else if (auctionEnded && didSettleAuction) {
      setModal({
        title: <Trans>Success</Trans>,
        message: <Trans>Settled auction successfully!</Trans>,
        show: true,
      });
      setBidButtonContent({ loading: false, content: <Trans>Settle Auction</Trans> });
    } else if (auctionEnded && didSettleFail) {
      setModal({
        title: <Trans>Transaction Failed</Trans>,
        message: settleAuctionError?.message || <Trans>Please try again.</Trans>,
        show: true,
      });
      setBidButtonContent({ loading: false, content: <Trans>Settle Auction</Trans> });
    }
  }, [
    auctionEnded,
    setModal,
    isSettleIdle,
    isSettlingAuction,
    didSettleAuction,
    didSettleFail,
    settleAuctionError?.message,
  ]);

  if (!auction) return null;

  const isDisabled = isPlacingBid || isSettlingAuction || !activeAccount;

  const fomoNounsBtnOnClickHandler = () => {
    // Open Fomo Nouns in a new tab
    window.open('https://fomonouns.wtf', '_blank', 'noopener,noreferrer')?.focus();
  };

  const isWalletConnected = activeAccount !== undefined;

  return (
    <>
      {showConnectModal && activeAccount === undefined && (
        <WalletConnectModal onDismiss={hideModalHandler} />
      )}
      <InputGroup>
        {!auctionEnded && (
          <>
            <span className={classes.customPlaceholderBidAmt}>
              {!auctionEnded && !bidInput ? (
                <>
                  Ξ {minBidEth(minBid)}{' '}
                  <span
                    className={
                      activeLocale === 'ja-JP' ? responsiveUiUtilsClasses.disableSmallScreens : ''
                    }
                  >
                    <Trans>or more</Trans>
                  </span>
                </>
              ) : (
                ''
              )}
            </span>
            <FormControl
              className={classes.bidInput}
              type="number"
              min="0"
              onChange={bidInputHandler}
              ref={bidInputRef}
              value={bidInput}
            />
          </>
        )}
        {!auctionEnded ? (
          <Button
            className={auctionEnded ? classes.bidBtnAuctionEnded : classes.bidBtn}
            onClick={auctionEnded ? settleAuctionHandler : placeBidHandler}
            disabled={isDisabled}
          >
            {bidButtonContent.loading ? <Spinner animation="border" /> : bidButtonContent.content}
          </Button>
        ) : (
          <>
            <Col lg={12} className={classes.voteForNextNounBtnWrapper}>
              <Button className={classes.bidBtnAuctionEnded} onClick={fomoNounsBtnOnClickHandler}>
                <Trans>Vote for the next Noun</Trans> ⌐◧-◧
              </Button>
            </Col>
            {/* Only show the force settles button if the wallet connected */}
            {isWalletConnected && (
              <Col lg={12}>
                <SettleManuallyBtn settleAuctionHandler={settleAuctionHandler} auction={auction} />
              </Col>
            )}
          </>
        )}
      </InputGroup>
    </>
  );
};
export default Bid;
