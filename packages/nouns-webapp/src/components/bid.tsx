import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Trans, useLingui } from '@lingui/react/macro';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatEther, parseEther } from 'viem';

import SettleManuallyBtn from '@/components/settle-manually-btn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  useReadNounsAuctionHouseMinBidIncrementPercentage,
  useWriteNounsAuctionHouseCreateBid,
  useWriteNounsAuctionHouseSettleCurrentAndCreateNewAuction,
} from '@/contracts';
import { useAppSelector } from '@/hooks';
import { useActiveLocale } from '@/hooks/use-activate-locale';
import { Auction } from '@/wrappers/nouns-auction';

import responsiveUiUtilsClasses from '@/utils/responsive-ui-utils.module.css';

const computeMinimumNextBid = (
  currentBid: bigint,
  minBidIncPercentage: bigint | undefined,
): bigint => {
  if (minBidIncPercentage === undefined) {
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

const currentBid = (bidInputRef: React.RefObject<HTMLInputElement | null>) => {
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

  const { t } = useLingui();

  const { data: minBidIncPercentage } = useReadNounsAuctionHouseMinBidIncrementPercentage();
  const minBid = computeMinimumNextBid(
    auction.amount !== undefined ? BigInt(auction.amount.toString()) : 0n,
    minBidIncPercentage !== undefined ? BigInt(minBidIncPercentage.toString()) : undefined,
  );

  const {
    writeContract: placeBid,
    isPending: isPlacingBid,
    isError: didPlaceBidFail,
    isSuccess: placeBidSucceeded,
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

  useEffect(() => {
    if (didPlaceBidFail) toast.error(t`Please try again.`);
  }, [didPlaceBidFail, t]);
  useEffect(() => {
    if (placeBidSucceeded) toast.success(t`Bid placed.`);
  }, [placeBidSucceeded, t]);

  const placeBidHandler = async () => {
    if (auction === undefined || !bidInputRef.current || !bidInputRef.current.value) {
      return;
    }

    if (currentBid(bidInputRef) < minBid) {
      toast.error(
        t`Please place a bid higher than or equal to the minimum bid amount of ${minBidEth(minBid)} ETH`,
      );
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
      toast.success(t`Bid was placed successfully!`);
      clearBidInput();
    }
  }, [auction, account, t, isPlacingBid]);
  // settle auction transaction state hook
  useEffect(() => {
    if (auctionEnded && didSettleAuction) {
      toast.success(t`Settled auction successfully!`);
    }
    if (auctionEnded && didSettleFail) {
      toast.error(settleAuctionError?.message || t`Please try again.`);
    }
  }, [
    auctionEnded,
    isSettleIdle,
    isSettlingAuction,
    didSettleAuction,
    didSettleFail,
    settleAuctionError?.message,
    t,
  ]);

  if (auction === undefined) return null;

  const isDisabled = isPlacingBid || isSettlingAuction || !activeAccount;

  const voteForNextNounOnClickHandler = () => {
    // Open external site in a new tab
    const newWin = window.open('https://fomonouns.wtf', '_blank');
    if (newWin) newWin.opener = null;
    newWin?.focus();
  };

  const isWalletConnected = activeAccount !== undefined;

  return (
    <>
      <div className={!auctionEnded ? 'm-0 flex flex-row items-center justify-center' : undefined}>
        {!auctionEnded && (
          <>
            <div className="relative flex flex-1">
              <span className="pointer-events-none absolute left-[3%] top-[15%] z-[1] font-pt text-[25px] font-bold text-[var(--brand-cool-light-text)] opacity-30">
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
              <Input
                className="h-[54px] w-auto grow appearance-none rounded-[12px] border-0 !bg-white font-pt text-[25px] font-bold text-black shadow-none outline-none ring-1 ring-inset ring-white transition-all duration-200 ease-in-out focus:ring-1 focus:ring-inset focus:ring-[var(--brand-cool-dark-text)] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                min="0"
                onChange={bidInputHandler}
                ref={bidInputRef}
                value={bidInput}
              />
            </div>
          </>
        )}
        {!auctionEnded ? (
          <Button
            type="button"
            className="ml-2 mt-[3px] h-12 w-auto rounded-[12px] border border-transparent bg-[var(--brand-black)] px-4 font-bold leading-none tracking-normal text-white transition-all duration-200 ease-in-out hover:bg-[#2125298a] focus:bg-[#2125298a] active:bg-[#2125298a] disabled:cursor-not-allowed disabled:bg-gray-500"
            onClick={placeBidHandler}
            disabled={isDisabled}
          >
            {isPlacingBid ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                <Trans>Processing</Trans>
              </>
            ) : (
              <Trans>Bid</Trans>
            )}
          </Button>
        ) : (
          <>
            <div className="w-full">
              <Button
                type="button"
                className="h-12 w-full rounded-[10px] border border-transparent bg-[var(--brand-black)] font-pt text-[18px] font-bold text-white hover:bg-gray-500 focus:bg-gray-500 active:bg-gray-500 disabled:bg-gray-500 disabled:text-[rgb(209,207,207)]"
                onClick={voteForNextNounOnClickHandler}
              >
                <Trans>Vote for the next Noun</Trans> ⌐◧-◧
              </Button>
            </div>
            {/* Only show the force settles button if the wallet connected */}
            {isWalletConnected && (
              <div>
                <SettleManuallyBtn settleAuctionHandler={settleAuctionHandler} auction={auction} />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default Bid;
