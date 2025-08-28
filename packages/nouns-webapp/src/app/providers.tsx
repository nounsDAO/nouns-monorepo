'use client';

import type { Address } from '@/utils/types';

import React, { useEffect } from 'react';

// eslint-disable-next-line no-restricted-imports
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
// eslint-disable-next-line no-restricted-imports
import { Provider as ReduxProvider } from 'react-redux';
import { parseAbiItem } from 'viem';
import { hardhat } from 'viem/chains';
import { usePublicClient, WagmiProvider, useAccount } from 'wagmi';

import { CustomConnectkitProvider } from '@/components/custom-connectkit-provider';
import NetworkAlert from '@/components/network-alert';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import config, { CHAIN_ID } from '@/config';
import {
  nounsAuctionHouseAddress,
  useReadNounsAuctionHouseAuction,
  useWatchNounsAuctionHouseAuctionBidEvent,
  useWatchNounsAuctionHouseAuctionCreatedEvent,
  useWatchNounsAuctionHouseAuctionExtendedEvent,
  useWatchNounsAuctionHouseAuctionSettledEvent,
} from '@/contracts';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { LanguageProvider } from '@/i18n/language-provider';
import { setActiveAccount } from '@/state/slices/account';
import {
  appendBid,
  reduxSafeAuction,
  reduxSafeBid,
  reduxSafeNewAuction,
  setActiveAuction,
  setAuctionExtended,
  setAuctionSettled,
  setFullAuction,
} from '@/state/slices/auction';
import { setLastAuctionNounId, setOnDisplayAuctionNounId } from '@/state/slices/on-display-auction';
import { addPastAuctions } from '@/state/slices/past-auctions';
import { store } from '@/store';
import { execute } from '@/subgraphs/execute';
import { nounPath } from '@/utils/history';
import { defaultChain, config as wagmiConfig } from '@/wagmi';
import { clientFactory, latestAuctionsQuery } from '@/wrappers/subgraph';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();
const client = clientFactory(config.app.subgraphApiUri);

const ChainSubscriber: React.FC = () => {
  const dispatch = useAppDispatch();
  const publicClient = usePublicClient();
  const chainId = defaultChain.id;

  // Fetch the current auction
  const { data: currentAuction } = useReadNounsAuctionHouseAuction();
  useEffect(() => {
    if (currentAuction) {
      dispatch(setFullAuction(reduxSafeAuction(currentAuction)));
      dispatch(setLastAuctionNounId(Number(currentAuction.nounId)));
    }
  }, [currentAuction, dispatch]);

  // Fetch the previous 24 hours of bids
  useEffect(() => {
    if (CHAIN_ID === hardhat.id) {
      return;
    }
    (async () => {
      const latestBlock = await publicClient.getBlock();
      const fromBlock = latestBlock.number > 7200n ? latestBlock.number - 7200n : 0n;

      const logs = await publicClient.getLogs({
        address: nounsAuctionHouseAddress[chainId],
        event: parseAbiItem(
          'event AuctionBid(uint256 indexed nounId, address sender, uint256 value, bool extended)',
        ),
        fromBlock,
        toBlock: latestBlock.number,
      });

      for (const {
        args: { extended, nounId, sender, value },
        blockNumber,
        transactionHash,
        transactionIndex,
      } of logs) {
        const block = await publicClient.getBlock({
          blockNumber: blockNumber ?? undefined,
        });
        const timestamp = block.timestamp;

        dispatch(
          appendBid(
            reduxSafeBid({
              nounId: Number(nounId),
              sender: sender as Address,
              value: Number(value),
              extended: extended !== undefined,
              transactionHash: transactionHash ?? '',
              transactionIndex: transactionIndex ?? 0,
              timestamp,
            }),
          ),
        );
      }
    })();
  }, [chainId, dispatch, publicClient]);

  // Watch for new bids
  useWatchNounsAuctionHouseAuctionBidEvent({
    enabled: publicClient != null,
    onLogs: async logs => {
      for (const {
        args: { extended, nounId, sender, value },
        blockNumber,
        transactionHash,
        transactionIndex,
      } of logs) {
        const block = await publicClient.getBlock({
          blockNumber: blockNumber ?? undefined,
        });
        const timestamp = block.timestamp;

        dispatch(
          appendBid(
            reduxSafeBid({
              nounId: Number(nounId),
              sender: sender as Address,
              value: Number(value),
              extended: extended !== undefined,
              transactionHash: transactionHash ?? '',
              transactionIndex: transactionIndex ?? 0,
              timestamp,
            }),
          ),
        );
      }
    },
  });

  // Watch for new auction creation events
  useWatchNounsAuctionHouseAuctionCreatedEvent({
    enabled: publicClient != null,
    onLogs: logs => {
      for (const log of logs) {
        const { startTime, endTime, nounId } = log.args;
        dispatch(
          setActiveAuction(
            reduxSafeNewAuction({
              nounId: Number(nounId),
              startTime: Number(startTime),
              endTime: Number(endTime),
              settled: false,
            }),
          ),
        );
        const nounIdNumber = Number(nounId);
        window.location.href = nounPath(nounIdNumber);
        dispatch(setOnDisplayAuctionNounId(nounIdNumber));
        dispatch(setLastAuctionNounId(nounIdNumber));
      }
    },
  });

  // Watch for new auction extended events
  useWatchNounsAuctionHouseAuctionExtendedEvent({
    enabled: publicClient != null,
    onLogs: logs => {
      for (const log of logs) {
        const { endTime, nounId } = log.args;
        dispatch(
          setAuctionExtended({
            nounId: Number(nounId),
            endTime: Number(endTime),
          }),
        );
      }
    },
  });

  // Watch for auction settlement events
  useWatchNounsAuctionHouseAuctionSettledEvent({
    enabled: publicClient != null,
    onLogs: logs => {
      for (const log of logs) {
        const { amount, winner, nounId } = log.args;
        dispatch(
          setAuctionSettled({
            nounId: Number(nounId),
            amount: Number(amount),
            winner: winner as Address,
          }),
        );
      }
    },
  });

  return <></>;
};

const PastAuctions: React.FC = () => {
  const latestAuctionId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);

  const { data: auctions } = useQuery({
    queryKey: ['latestAuctions'],
    queryFn: async () =>
      await Promise.all([
        execute(latestAuctionsQuery, { first: 1000 }),
        execute(latestAuctionsQuery, { first: 1000, skip: 1000 }),
      ]).then(([page1, page2]) => [...page1.auctions, ...page2.auctions]),
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (auctions) {
      dispatch(addPastAuctions({ auctions }));
    }
  }, [auctions, latestAuctionId, dispatch]);

  return <></>;
};

const AccountSubscriber: React.FC = () => {
  const { address: account } = useAccount();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setActiveAccount(account));
  }, [account, dispatch]);

  // Initialize dayjs plugin
  useEffect(() => {
    dayjs.extend(relativeTime);
  }, []);

  return <></>;
};

const NetworkAlertWrapper: React.FC = () => {
  const { chainId } = useAccount();

  if (chainId !== undefined && Number(CHAIN_ID) !== chainId) {
    return <NetworkAlert />;
  }

  return null;
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
      <TooltipProvider delayDuration={0}>
        <ReduxProvider store={store}>
          <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
              {process.env.NEXT_PUBLIC_ENABLE_TANSTACK_QUERY_DEVTOOLS === 'true' && (
                <ReactQueryDevtools initialIsOpen={false} />
              )}
              <ChainSubscriber />
              <AccountSubscriber />
              <ApolloProvider client={client}>
                <PastAuctions />
                <LanguageProvider>
                  <CustomConnectkitProvider>
                    <NetworkAlertWrapper />
                    {children}
                    <Toaster
                      expand
                      closeButton
                      toastOptions={{
                        classNames: {
                          closeButton:
                            '[--toast-close-button-start:auto] [--toast-close-button-end:0] [--toast-close-button-transform:translate(35%,-35%)]',
                        },
                      }}
                    />
                  </CustomConnectkitProvider>
                </LanguageProvider>
              </ApolloProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </ReduxProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
