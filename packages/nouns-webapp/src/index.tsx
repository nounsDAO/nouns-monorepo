import React, { useEffect } from 'react';

import './index.css';
import { ApolloProvider, useQuery } from '@apollo/client';
import { Web3Provider } from '@ethersproject/providers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Chain, ChainId, DAppProvider, DEFAULT_SUPPORTED_CHAINS } from '@usedapp/core';
import { Web3ReactProvider } from '@web3-react/core';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore, PreloadedState } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Log, parseAbiItem } from 'viem';
import { hardhat } from 'viem/chains';
import { usePublicClient, WagmiProvider } from 'wagmi';

import App from './App';
import config, {
  CHAIN_ID,
  ChainId_Sepolia,
  createNetworkHttpUrl,
  multicallOnLocalhost,
} from './config';
import {
  nounsAuctionHouseAddress,
  useReadNounsAuctionHouseAuction,
  useWatchNounsAuctionHouseAuctionBidEvent,
  useWatchNounsAuctionHouseAuctionCreatedEvent,
  useWatchNounsAuctionHouseAuctionExtendedEvent,
  useWatchNounsAuctionHouseAuctionSettledEvent,
} from './contracts';
import { useAppDispatch, useAppSelector } from './hooks';
import { LanguageProvider } from './i18n/LanguageProvider';
import reportWebVitals from './reportWebVitals';
import account from './state/slices/account';
import application from './state/slices/application';
import auction, {
  appendBid,
  reduxSafeAuction,
  reduxSafeBid,
  reduxSafeNewAuction,
  setActiveAuction,
  setAuctionExtended,
  setAuctionSettled,
  setFullAuction,
} from './state/slices/auction';
import logs from './state/slices/logs';
import onDisplayAuction, {
  setLastAuctionNounId,
  setOnDisplayAuctionNounId,
} from './state/slices/onDisplayAuction';
import pastAuctions, { addPastAuctions } from './state/slices/pastAuctions';
import LogsUpdater from './state/updaters/logs';
import { nounPath } from './utils/history';
import { config as wagmiConfig } from './wagmi';
import { clientFactory, latestAuctionsQuery } from './wrappers/subgraph';

const queryClient = new QueryClient();

const createRootReducer = () =>
  combineReducers({
    account,
    application,
    auction,
    logs,
    pastAuctions,
    onDisplayAuction,
  });

export default function configureStore(preloadedState: PreloadedState<any>) {
  return createStore(
    createRootReducer(), // root reducer without router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(),
      // ... other middlewares ...
    ),
  );
}

const store = configureStore({});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const supportedChainURLs = {
  [ChainId.Mainnet]: createNetworkHttpUrl('mainnet'),
  [ChainId.Hardhat]: 'http://localhost:8545',
  [ChainId.Goerli]: createNetworkHttpUrl('goerli'),
  [ChainId_Sepolia]: createNetworkHttpUrl('sepolia'),
};

export const Sepolia: Chain = {
  chainId: ChainId_Sepolia,
  chainName: 'Sepolia',
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: '0x6a19Dbfc67233760E0fF235b29158bE45Cc53765',
  getExplorerAddressLink: (address: string) => `https://sepolia.etherscan.io/address/${address}`,
  getExplorerTransactionLink: (transactionHash: string) =>
    `https://sepolia.etherscan.io/tx/${transactionHash}`,
};

// prettier-ignore
const useDappConfig = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [CHAIN_ID]: supportedChainURLs[CHAIN_ID],
  },
  multicallAddresses: {
    [ChainId.Hardhat]: multicallOnLocalhost,
  },
  networks: [...DEFAULT_SUPPORTED_CHAINS, Sepolia],
};

const client = clientFactory(config.app.subgraphApiUri);

const Updaters = () => {
  return (
    <>
      <LogsUpdater />
    </>
  );
};

const ChainSubscriber: React.FC = () => {
  const dispatch = useAppDispatch();
  const publicClient = usePublicClient();

  const processBidFilter = async (
    nounId: bigint,
    sender: string,
    value: bigint,
    extended: boolean,
    event: Log,
  ) => {
    const block = await publicClient.getBlock({
      blockNumber: event.blockNumber ?? undefined,
    });

    const timestamp = block.timestamp;
    const { transactionHash, transactionIndex } = event;
    dispatch(
      appendBid(
        reduxSafeBid({
          nounId,
          sender,
          value,
          extended,
          transactionHash: transactionHash ?? '',
          transactionIndex: transactionIndex ?? 0,
          timestamp,
        }),
      ),
    );
  };
  const processAuctionCreated = (nounId: bigint, startTime: bigint, endTime: bigint) => {
    dispatch(setActiveAuction(reduxSafeNewAuction({ nounId, startTime, endTime, settled: false })));
    const nounIdNumber = Number(BigInt(nounId));
    window.location.href = nounPath(nounIdNumber);
    dispatch(setOnDisplayAuctionNounId(nounIdNumber));
    dispatch(setLastAuctionNounId(nounIdNumber));
  };
  const processAuctionExtended = (nounId: bigint, endTime: bigint) => {
    dispatch(setAuctionExtended({ nounId, endTime }));
  };
  const processAuctionSettled = (nounId: bigint, winner: string, amount: bigint) => {
    dispatch(setAuctionSettled({ nounId, amount, winner }));
  };

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
        address: nounsAuctionHouseAddress[1],
        event: parseAbiItem(
          'event AuctionBid(uint256 indexed nounId, address sender, uint256 value, bool extended)',
        ),
        fromBlock,
        toBlock: latestBlock.number,
      });

      for (const log of logs) {
        if (log.args == undefined) return;

        const { nounId, sender, value, extended } = log.args as {
          nounId: bigint;
          sender: string;
          value: bigint;
          extended: boolean;
        };

        processBidFilter(nounId, sender, value, extended, log);
      }
    })();
  }, [processBidFilter, publicClient]);

  // Watch for new bids
  useWatchNounsAuctionHouseAuctionBidEvent({
    onLogs: logs => {
      for (const log of logs) {
        if (log.args == undefined) return;
        processBidFilter(...(log.args as [bigint, string, bigint, boolean]), log);
      }
    },
  });

  // Watch for new auction creation events
  useWatchNounsAuctionHouseAuctionCreatedEvent({
    onLogs: logs => {
      for (const log of logs) {
        processAuctionCreated(...(log.args as [bigint, bigint, bigint]));
      }
    },
  });

  // Watch for new auction extended events
  useWatchNounsAuctionHouseAuctionExtendedEvent({
    onLogs: logs => {
      for (const log of logs) {
        processAuctionExtended(...(log.args as [bigint, bigint]));
      }
    },
  });

  // Watch for auction settlement events
  useWatchNounsAuctionHouseAuctionSettledEvent({
    onLogs: logs => {
      for (const log of logs) {
        processAuctionSettled(...(log.args as [bigint, string, bigint]));
      }
    },
  });

  return <></>;
};

const PastAuctions: React.FC = () => {
  const latestAuctionId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const { data } = useQuery(latestAuctionsQuery());
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      dispatch(addPastAuctions({ data }));
    }
  }, [data, latestAuctionId, dispatch]);

  return <></>;
};

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <React.StrictMode>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <ChainSubscriber />
          <Web3ReactProvider
            getLibrary={
              provider => new Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
            }
          >
            <ApolloProvider client={client}>
              <PastAuctions />
              <DAppProvider config={useDappConfig}>
                <LanguageProvider>
                  <App />
                </LanguageProvider>
                <Updaters />
              </DAppProvider>
            </ApolloProvider>
          </Web3ReactProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
