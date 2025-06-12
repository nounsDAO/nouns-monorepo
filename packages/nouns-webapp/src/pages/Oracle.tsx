import type { Address } from '@/utils/types';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Trans, useLingui } from '@lingui/react/macro';
import {
  getNounData,
  getNounSeedFromBlockHash,
  ImageData as imageData,
} from '@noundry/nouns-assets';
import { buildSVG } from '@nouns/sdk';
import dayjs from 'dayjs';
import { isNonNullish, isNullish } from 'remeda';
import { toast } from 'sonner';
import { formatEther } from 'viem';
import { useWatchBlocks } from 'wagmi';

import Noun, { LoadingNoun } from '@/components/LegacyNoun';
import {
  readNounsAuctionHouseAuction,
  useWriteNounsAuctionHouseSettleCurrentAndCreateNewAuction,
} from '@/contracts';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setStateBackgroundColor } from '@/state/slices/application';
import { RootState } from '@/store';
import { beige, grey } from '@/utils/nounBgColors';
import { config } from '@/wagmi';

enum AuctionState {
  NotStarted,
  Active,
  OverNotSettled,
  OverAndSettled,
}

type Auction = {
  nounId: number;
  endTime: Date;
  startTime: Date;
  amount: string;
  settled: boolean;
  bidder: Address;
  state: AuctionState;
};

type Noun = {
  nounId: number;
  seed: ReturnType<typeof getNounSeedFromBlockHash>;
  image: string;
};

const determineAuctionState = (
  startTime: number,
  settled: boolean,
  currentTime: number,
  endTime: number,
): AuctionState => {
  if (startTime === 0) return AuctionState.NotStarted;
  if (settled) return AuctionState.OverAndSettled;
  if (currentTime < endTime) return AuctionState.Active;
  return AuctionState.OverNotSettled;
};

const processNounData = (nounId: number, blockHash: string) => {
  const nounSeed = getNounSeedFromBlockHash(nounId, blockHash);
  const { parts, background } = getNounData(nounSeed);
  const image = `data:image/svg+xml;base64,${btoa(buildSVG(parts, imageData.palette, background))}`;
  return {
    nounId,
    seed: nounSeed,
    image,
    backgroundColor: nounSeed.background === 0 ? grey : beige,
  };
};

const createAuctionData = (
  auctionData: {
    nounId: bigint;
    amount: bigint;
    startTime: number;
    endTime: number;
    bidder: Address;
    settled: boolean;
  },
  state: AuctionState,
): Auction => ({
  nounId: Number(auctionData.nounId),
  endTime: dayjs.unix(auctionData.endTime).toDate(),
  startTime: dayjs.unix(auctionData.startTime).toDate(),
  amount: formatEther(auctionData.amount),
  settled: auctionData.settled,
  bidder: auctionData.bidder,
  state,
});

export function OraclePage() {
  const { t } = useLingui();
  const dispatch = useAppDispatch();
  const stateBgColor = useAppSelector((state: RootState) => state.application.stateBackgroundColor);

  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextNoun, setNextNoun] = useState<Noun | null>(null);
  const [currentBlockTimestamp, setCurrentBlockTimestamp] = useState<number>(0);
  const prevNounIdRef = useRef<number | null>(null); // Add this to track the previous noun ID

  const {
    writeContract: settleAuction,
    isPending: isSettlingAuction,
    isError: didSettleFail,
    error: settleAuctionError,
  } = useWriteNounsAuctionHouseSettleCurrentAndCreateNewAuction();

  useWatchBlocks({
    syncConnectedChain: false,
    onBlock: async block => {
      try {
        setCurrentBlockTimestamp(Number(block.timestamp));

        const auctionData = await readNounsAuctionHouseAuction(config, {});

        if (isNullish(auctionData)) {
          setLoading(false);
          return;
        }

        const { nounId, endTime, startTime, settled } = auctionData;
        const currentNounId = Number(nounId);

        if (prevNounIdRef.current !== currentNounId) {
          setLoading(true);
          prevNounIdRef.current = currentNounId;
        }

        const state = determineAuctionState(startTime, settled, Number(block.timestamp), endTime);
        const nextNounId = currentNounId % 10 === 9 ? currentNounId + 2 : currentNounId + 1;

        setAuction(createAuctionData(auctionData, state));

        const nounData = processNounData(nextNounId, block.hash);
        setNextNoun(nounData);
        dispatch(setStateBackgroundColor(nounData.backgroundColor));
      } catch (error) {
        console.error('Failed to fetch auction data:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (didSettleFail) {
      toast.error(
        () => settleAuctionError?.message || <Trans>Transaction Failed. Please try again.</Trans>,
      );
    }
  }, [didSettleFail, settleAuctionError?.message]);

  const handleSettleAuction = useCallback(() => {
    settleAuction({});
  }, [settleAuction]);

  if (!(isNonNullish(auction) && auction.state === AuctionState.OverNotSettled)) {
    return (
      <div style={{ backgroundColor: stateBgColor }}>
        <div className="container-xl">
          <div className="flex w-full flex-col lg:flex-row">
            <div className="mt-0 w-full max-w-full flex-shrink-0 pb-0 pl-3 pr-20 leading-6 text-neutral-800 lg:w-1/2 lg:flex-none">
              <div>
                <p>
                  <Trans>Please wait for the auction to end before settling.</Trans>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: stateBgColor }}>
      <div className="container-xl">
        <div className="flex w-full flex-col lg:flex-row">
          <div className="mt-0 w-full max-w-full flex-shrink-0 px-3 lg:w-1/2 lg:flex-none">
            <div className="mx-[15%] w-[70%] self-end lg:mx-0 lg:w-auto">
              {(loading || isNullish(auction)) && <LoadingNoun />}
              {!loading && (
                <Noun
                  imgPath={nextNoun?.image ?? ''}
                  alt={nextNoun?.nounId.toString() ?? t`Noun`}
                />
              )}
            </div>
          </div>
          <div className="mt-0 w-full max-w-full flex-shrink-0 pb-0 pl-3 pr-20 leading-6 text-neutral-800 lg:w-1/2 lg:flex-none">
            <AuctionControlPanel
              nextNoun={nextNoun}
              currentBlockTimestamp={currentBlockTimestamp}
              onSettleAuction={handleSettleAuction}
              isSettlingAuction={isSettlingAuction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const AuctionControlPanel = ({
  nextNoun,
  currentBlockTimestamp,
  onSettleAuction,
  isSettlingAuction,
}: {
  nextNoun: Noun | null;
  currentBlockTimestamp: number;
  onSettleAuction: () => void;
  isSettlingAuction: boolean;
}) => {
  const { t } = useLingui();

  return (
    <div>
      <h1>
        <Trans>Auction</Trans>
      </h1>
      <p>
        {t`Noun ID`}: {nextNoun?.nounId.toString()}
      </p>
      {currentBlockTimestamp > 0 && (
        <div className="my-3">
          <p>
            <Trans>Next block in:</Trans>
          </p>
          <BlockTimeCountdown currentBlockTimestamp={currentBlockTimestamp} />
        </div>
      )}
      <button
        type="button"
        className="relative m-0 inline-block h-12 w-full cursor-pointer select-none rounded-lg border-x-0 border-y-0 border-none border-transparent bg-neutral-800 px-3 py-1 text-center align-middle text-lg normal-case leading-7 text-white hover:bg-zinc-500 hover:text-stone-300 focus:bg-zinc-500 focus:text-stone-300"
        onClick={onSettleAuction}
        disabled={isSettlingAuction}
      >
        <Trans>Settle Auction</Trans>
      </button>
    </div>
  );
};

function BlockTimeCountdown({
  currentBlockTimestamp,
}: Readonly<{ currentBlockTimestamp: number }>) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const AVERAGE_BLOCK_TIME = 12; // 12 seconds per block on average

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
      const nextBlockTime = currentBlockTimestamp + AVERAGE_BLOCK_TIME;
      const difference = nextBlockTime - now;

      // Make sure we don't show negative time
      return Math.max(difference, 0);
    };

    // Set the initial time left
    setTimeLeft(calculateTimeLeft());

    // Update the countdown every second
    const timerId = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Clear interval when countdown reaches zero
      if (newTimeLeft <= 0) {
        clearInterval(timerId);
      }
    }, 1000);

    // Clean up the interval on a component unmount
    return () => clearInterval(timerId);
  }, [currentBlockTimestamp]);

  return (
    <div className="block-time-countdown">
      <span className="font-bold">{timeLeft}</span> {timeLeft === 1 ? 'second' : 'seconds'} until
      next block
    </div>
  );
}
