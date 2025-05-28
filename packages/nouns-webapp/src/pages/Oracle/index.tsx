import type { Address } from '@/utils/types';

import { useCallback, useEffect, useState } from 'react';

import { Trans, useLingui } from '@lingui/react/macro';
import {
  getNounData,
  getNounSeedFromBlockHash,
  ImageData as imageData,
} from '@noundry/nouns-assets';
import { buildSVG } from '@nouns/sdk';
import dayjs from 'dayjs';
import { isNonNullish, isNullish } from 'remeda';
import { formatEther } from 'viem';
import { useWatchBlocks } from 'wagmi';

import Noun, { LoadingNoun } from '@/components/Noun';
import {
  readNounsAuctionHouseAuction,
  useWriteNounsAuctionHouseSettleCurrentAndCreateNewAuction,
} from '@/contracts';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { AlertModal, setAlertModal, setStateBackgroundColor } from '@/state/slices/application';
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

export function OraclePage() {
  const { t } = useLingui();

  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [nextNoun, setNextNoun] = useState<Noun | null>(null);

  const dispatch = useAppDispatch();
  const stateBgColor = useAppSelector((state: RootState) => state.application.stateBackgroundColor);
  const setModal = useCallback((modal: AlertModal) => dispatch(setAlertModal(modal)), [dispatch]);

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

  const processNextNounData = (nounId: number, blockHash: string) => {
    const nextNounSeed = getNounSeedFromBlockHash(nounId, blockHash);
    const { parts, background } = getNounData(nextNounSeed);
    const image = `data:image/svg+xml;base64,${btoa(buildSVG(parts, imageData.palette, background))}`;

    dispatch(setStateBackgroundColor(nextNounSeed.background === 0 ? grey : beige));

    return {
      nounId,
      seed: nextNounSeed,
      image,
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
  ) => {
    const { nounId, endTime, startTime, amount, settled, bidder } = auctionData;

    return {
      nounId: Number(nounId),
      endTime: dayjs.unix(endTime).toDate(),
      startTime: dayjs.unix(startTime).toDate(),
      amount: formatEther(amount),
      settled,
      bidder,
      state,
    };
  };

  useWatchBlocks({
    syncConnectedChain: false,
    onBlock: async block => {
      setLoading(true);

      try {
        const auctionData = await readNounsAuctionHouseAuction(config, {});

        if (isNullish(auctionData)) {
          setLoading(false);
          return;
        }

        const { nounId, endTime, startTime, settled } = auctionData;
        const state = determineAuctionState(startTime, settled, Number(block.timestamp), endTime);
        const nextNounId = Number(nounId) + 1;

        setAuction(createAuctionData(auctionData, state));
        setNextNoun(processNextNounData(nextNounId, block.hash));
      } catch (error) {
        console.error('Failed to fetch auction data:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  const {
    writeContract: settleAuction,
    isPending: isSettlingAuction,
    // isSuccess: didSettleAuction,
    isError: didSettleFail,
    // isIdle: isSettleIdle,
    error: settleAuctionError,
  } = useWriteNounsAuctionHouseSettleCurrentAndCreateNewAuction();

  useEffect(() => {
    if (didSettleFail) {
      setModal({
        title: <Trans>Transaction Failed</Trans>,
        message: settleAuctionError?.message || <Trans>Please try again.</Trans>,
        show: true,
      });
    }
  }, []);

  return (
    <div style={{ backgroundColor: stateBgColor }}>
      <div className={'container'}>
        <div className={'flex w-full flex-col md:flex-row'}>
          <div className={'mt-0 flex w-full max-w-full flex-shrink-0 px-3 lg:w-1/2 lg:flex-none'}>
            {(loading || isNullish(auction)) && <LoadingNoun />}
            {!loading && isNonNullish(auction) && auction.state === AuctionState.OverNotSettled && (
              <Noun imgPath={nextNoun?.image ?? ''} alt={nextNoun?.nounId.toString() ?? 'Noun'} />
            )}
          </div>
          <div
            className={
              'mt-0 w-full max-w-full flex-shrink-0 pb-0 pl-3 pr-20 leading-6 text-neutral-800 lg:w-1/2 lg:flex-none'
            }
          >
            {isNonNullish(auction) && auction.state === AuctionState.OverNotSettled && (
              <div>
                <h1>
                  <Trans>Auction</Trans>
                </h1>
                <p>
                  {t`Noun ID`}: {auction.nounId.toString()}
                </p>
                {/*<p>End time: {auction.endTime.toString()}</p>*/}
                {/*<p>Start time: {auction.startTime.toString()}</p>*/}
                {/*<p>Amount: {auction.amount.toString()}</p>*/}
                {/*<p>Settled: {auction.settled ? 'yes' : 'no'}</p>*/}
                {/*<p>Bidder: {auction.bidder}</p>*/}
                {/*<p>State: {auction.state}</p>*/}
                <button
                  type="button"
                  className="relative m-0 inline-block h-12 w-full cursor-pointer select-none rounded-lg border-x-0 border-y-0 border-none border-transparent bg-neutral-800 px-3 py-1 text-center align-middle text-lg normal-case leading-7 text-white hover:bg-zinc-500 hover:text-stone-300 focus:bg-zinc-500 focus:text-stone-300"
                  onClick={() => {
                    settleAuction({});
                  }}
                  disabled={isSettlingAuction}
                >
                  <Trans>Settle Auction</Trans>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
