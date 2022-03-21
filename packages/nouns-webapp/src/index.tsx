import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChainId, DAppProvider } from '@usedapp/core';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import account from './state/slices/account';
import application, { setPrices } from './state/slices/application';
import logs from './state/slices/logs';
import auction, {
  reduxSafeAuction,
  reduxSafeNewAuction,
  reduxSafeBid,
  setActiveAuction,
  setAuctionExtended,
  setAuctionSettled,
  setFullAuction,
} from './state/slices/auction';
import onDisplayAuction, {
  setLastAuctionNounId,
  setOnDisplayAuctionNounId,
} from './state/slices/onDisplayAuction';
import { ApolloProvider, useQuery } from '@apollo/client';
import { auctionQuery, clientFactory, latestAuctionsQuery } from './wrappers/subgraph';
import { useEffect } from 'react';
import pastAuctions, { addPastAuctions } from './state/slices/pastAuctions';
import LogsUpdater from './state/updaters/logs';
import config, { CHAIN_ID, createNetworkHttpUrl, EXCHANGE_API } from './config';
import { WebSocketProvider } from '@ethersproject/providers';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { NounsAuctionHouseFactory } from '@digitalax/nouns-sdk';
import dotenv from 'dotenv';
import { useAppDispatch, useAppSelector } from './hooks';
import { appendBid } from './state/slices/auction';
import { ConnectedRouter, connectRouter } from 'connected-react-router';
import { createBrowserHistory, History } from 'history';
import { applyMiddleware, createStore, combineReducers, PreloadedState } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { nounPath } from './utils/history';
import { push } from 'connected-react-router';
import { Auction } from './wrappers/nounsAuction';

dotenv.config();

declare global {
  interface Window {
    web3: ethers.providers.Web3Provider;
    ethereum: any;
  }
}

export const history = createBrowserHistory();

const createRootReducer = (history: History) =>
  combineReducers({
    router: connectRouter(history),
    account,
    application,
    auction,
    logs,
    pastAuctions,
    onDisplayAuction,
  });

export default function configureStore(preloadedState: PreloadedState<any>) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composeWithDevTools(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        // ... other middlewares ...
      ),
    ),
  );

  return store;
}

const store = configureStore({});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// prettier-ignore
const useDappConfig = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [ChainId.Rinkeby]: createNetworkHttpUrl('rinkeby'),
    [ChainId.Mainnet]: createNetworkHttpUrl('mainnet'),
    [ChainId.Hardhat]: 'http://localhost:8545',
    [ChainId.Mumbai]: 'https://polygon-mumbai.g.alchemy.com/v2/ut-A8hy0NasKAOgsRwDbqgnaaay40zD6',
    [ChainId.Polygon]: 'https://polygon-mainnet.g.alchemy.com/v2/l_-zZAI0v9EWjrG1dee494hg1XDh38A8'
  },
};

const client = clientFactory(config.app.subgraphApiUri);

const Updaters = () => {
  return (
    <>
      <LogsUpdater />
    </>
  );
};

const BLOCKS_PER_DAY = 6_500;

const ChainSubscriber: React.FC = () => {
  const dispatch = useAppDispatch();
  const wsProvider = new WebSocketProvider(config.app.wsRpcUri);
  const nounsAuctionHouseContract = NounsAuctionHouseFactory.connect(
    config.addresses.nounsAuctionHouseProxy,
    wsProvider,
  );
  const [currentAuction, setCurrentAuction] = useState<Auction | undefined>();
  const { data } = useQuery(auctionQuery(currentAuction?.nounId.toNumber() ?? 0), {
    skip: !currentAuction?.nounId.toNumber(),
  });

  const fetchPrices = async () => {
    const eth = await fetch(`${EXCHANGE_API}/simple/price?ids=ethereum&vs_currencies=usd`).then(
      res => res.json(),
    );
    const mona = await fetch(`${EXCHANGE_API}/simple/price?ids=monavale&vs_currencies=usd`).then(
      res => res.json(),
    );
    dispatch(setPrices({ eth: eth.ethereum.usd, mona: mona.monavale.usd }));
  };

  useEffect(() => {
    if (data && data.auction && currentAuction) {
      dispatch(setFullAuction(reduxSafeAuction(currentAuction)));
      dispatch(setLastAuctionNounId(currentAuction.nounId.toNumber()));
      dispatch(
        setFullAuction({
          ...currentAuction,
          name: data.auction.noun.name,
          description: data.auction.noun.description,
          image: data.auction.noun.image,
          animation: data.auction.noun.animation,
        }),
      );
    }
  }, [data, currentAuction]);

  useEffect(() => {
    loadState();
    fetchPrices();
  }, []);

  const loadState = async () => {
    const bidFilter = nounsAuctionHouseContract.filters.AuctionBidERC20(null, null, null, null);
    const extendedFilter = nounsAuctionHouseContract.filters.AuctionExtended(null, null);
    const createdFilter = nounsAuctionHouseContract.filters.AuctionCreated(null, null, null);
    const settledFilter = nounsAuctionHouseContract.filters.AuctionSettled(null, null, null);
    const processBidFilter = async (
      nounId: BigNumberish,
      sender: string,
      value: BigNumberish,
      extended: boolean,
      event: any,
    ) => {
      const timestamp = (await event.getBlock()).timestamp;
      const transactionHash = event.transactionHash;
      dispatch(
        appendBid(reduxSafeBid({ nounId, sender, value, extended, transactionHash, timestamp })),
      );
    };
    const processAuctionCreated = (
      nounId: BigNumberish,
      startTime: BigNumberish,
      endTime: BigNumberish,
    ) => {
      dispatch(
        setActiveAuction(reduxSafeNewAuction({ nounId, startTime, endTime, settled: false })),
      );
      const nounIdNumber = BigNumber.from(nounId).toNumber();
      dispatch(push(nounPath(nounIdNumber)));
      dispatch(setOnDisplayAuctionNounId(nounIdNumber));
      dispatch(setLastAuctionNounId(nounIdNumber));
    };
    const processAuctionExtended = (nounId: BigNumberish, endTime: BigNumberish) => {
      dispatch(setAuctionExtended({ nounId, endTime }));
    };
    const processAuctionSettled = (nounId: BigNumberish, winner: string, amount: BigNumberish) => {
      dispatch(setAuctionSettled({ nounId, amount, winner }));
    };

    // Fetch the current auction
    const currentAuction = await nounsAuctionHouseContract.auction();
    setCurrentAuction(currentAuction);
    // Fetch the previous 24hours of  bids
    const previousBids = await nounsAuctionHouseContract.queryFilter(bidFilter, 0 - BLOCKS_PER_DAY);
    for (let event of previousBids) {
      if (event.args === undefined) return;
      processBidFilter(...(event.args as [BigNumber, string, BigNumber, boolean]), event);
    }

    nounsAuctionHouseContract.on(bidFilter, (nounId, sender, value, extended, event) =>
      processBidFilter(nounId, sender, value, extended, event),
    );
    nounsAuctionHouseContract.on(createdFilter, (nounId, startTime, endTime) =>
      processAuctionCreated(nounId, startTime, endTime),
    );
    nounsAuctionHouseContract.on(extendedFilter, (nounId, endTime) =>
      processAuctionExtended(nounId, endTime),
    );
    nounsAuctionHouseContract.on(settledFilter, (nounId, winner, amount) =>
      processAuctionSettled(nounId, winner, amount),
    );
  };

  return <></>;
};

const PastAuctions: React.FC = () => {
  const latestAuctionId = useAppSelector(state => state.onDisplayAuction.lastAuctionNounId);
  const { data } = useQuery(latestAuctionsQuery());
  const dispatch = useAppDispatch();

  useEffect(() => {
    data && dispatch(addPastAuctions({ data }));
  }, [data, latestAuctionId, dispatch]);

  return <></>;
};

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <React.StrictMode>
        <Web3ReactProvider
          getLibrary={
            provider => new Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
          }
        >
          <ApolloProvider client={client}>
            <ChainSubscriber />
            <PastAuctions />
            <DAppProvider config={useDappConfig}>
              <App />
              <Updaters />
            </DAppProvider>
          </ApolloProvider>
        </Web3ReactProvider>
      </React.StrictMode>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
